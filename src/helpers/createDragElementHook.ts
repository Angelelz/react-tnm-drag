import React, { useEffect, useRef } from "react";
import {
  removeAndAnimateClone,
  createEventLike,
  doScroll,
  draggingOver,
  emptyElement,
  followPointer,
  createCloneAndStartDrag,
  animateTranslateBackwards,
} from "./helpers";
import {
  ArrayCallback,
  Direction,
  DispatchDragObject,
  DragElementHook,
  DragOptions,
  DragProps,
  DragState,
  InternalRef,
  NoS,
} from "../types/types";

const createDragElementHook = <El>(
  dragState: DragState<DragOptions<El>>,
  dragDispatch: React.Dispatch<DispatchDragObject<DragOptions<El>>>,
  elementArray: El[],
  animationTimeout: React.MutableRefObject<number | null>
): DragElementHook => {
  return <T extends NoS, R extends HTMLElement>(
    identifier: T,
    index: number,
    arrayCallback: ArrayCallback<El>,
    direction: Direction = "vertical",
    delayMS: number = 400,
    ref?: React.RefObject<R>
  ): DragProps<R> => {
    const elementRef = useRef<R>(null);
    const internalRef = useRef<InternalRef<El>>({
      touchTimeout: null,
      scrollTimeout: null,
      dragState: dragState,
      mousePosition: null,
      pointerId: null,
      initialStyle: null,
    });

    internalRef.current.dragState = dragState;

    const workingRef = ref ?? elementRef;

    if (internalRef.current.initialStyle === null && workingRef.current) {
      internalRef.current.initialStyle = {
        transition: workingRef.current.style.transition,
        translate: workingRef.current.style.translate,
        opacity: workingRef.current.style.opacity,
      };
    }

    if (
      dragState.isDragging &&
      identifier === dragState.sourceItem.identifier &&
      workingRef.current
    ) {
      workingRef.current.style.pointerEvents = "none";
      workingRef.current.style.opacity = "0";
    } else if (workingRef.current) {
      workingRef.current.style.pointerEvents = "";
    }

    if (
      internalRef.current.initialStyle !== null &&
      identifier !== dragState.targetItem.identifier
    ) {
      workingRef.current!.style.transition =
        internalRef.current.initialStyle.transition;
      workingRef.current!.style.translate =
        internalRef.current.initialStyle.translate;
    }
    if (
      !dragState.isDragging &&
      workingRef.current &&
      dragState.droppedItem &&
      dragState.droppedItem.identifier === identifier
    ) {
      workingRef.current!.style.opacity = "0";
      setTimeout(() => {
        workingRef.current!.style.opacity =
          internalRef.current.initialStyle!.opacity;
      }, delayMS / 2);
    }

    const onDragStart = (e: React.DragEvent<HTMLElement>) => {
      if (e.dataTransfer) {
        e.dataTransfer.setDragImage(emptyElement.element, 0, 0);
        e.dataTransfer.dropEffect = "copy";
      }

      setTimeout(() => {
        createCloneAndStartDrag(
          workingRef,
          e,
          direction,
          dragDispatch,
          identifier,
          index
        );
      }, 0);
    };

    const onDrag = (e: React.DragEvent<HTMLElement>) => {
      followPointer(dragState, createEventLike(e));
    };

    const onDragOver = (e: React.DragEvent<HTMLElement>) => {
      if (e.type !== "touchmove") e.preventDefault();
      draggingOver(
        dragState,
        workingRef,
        e,
        direction,
        identifier,
        dragDispatch,
        index,
        arrayCallback,
        elementArray,
        internalRef.current,
        animationTimeout
      );
    };

    const onDragEnd = (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      // rearrangeCallback(dragState, identifier);
      removeAndAnimateClone(delayMS, workingRef);
      dragDispatch({
        type: "drop",
      });
    };

    const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
      internalRef.current.pointerId = e.pointerId;
    };

    function onPointerMove(e: PointerEvent) {
      if (
        internalRef.current.dragState &&
        internalRef.current.dragState.isDragging
      ) {
        draggingOver(
          internalRef.current.dragState,
          workingRef,
          createEventLike(e),
          direction,
          identifier,
          dragDispatch,
          index,
          arrayCallback,
          elementArray,
          internalRef.current,
          animationTimeout
        );
      }
    }

    const onPointerUp = (e: React.PointerEvent<HTMLElement>) => {
      internalRef.current.pointerId = null;
    };

    const onTouchStart = (e: TouchEvent) => {
      internalRef.current.touchTimeout = setTimeout(() => {
        internalRef.current.touchTimeout = null;
        if (
          internalRef.current.dragState &&
          !!onDragStart &&
          internalRef.current.pointerId
        ) {
          e.preventDefault();
          (e.target as HTMLElement).releasePointerCapture(
            internalRef.current.pointerId
          );
          createCloneAndStartDrag(
            workingRef,
            createEventLike(e),
            direction,
            dragDispatch,
            identifier,
            index
          );
        }
        internalRef.current.mousePosition = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        if (internalRef.current.scrollTimeout === null) {
          internalRef.current.scrollTimeout = setInterval(
            () => doScroll(internalRef.current.mousePosition),
            150
          );
        }
        window.getSelection()?.removeAllRanges();
      }, 500);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (internalRef.current.touchTimeout) {
        clearTimeout(internalRef.current.touchTimeout);
        internalRef.current.touchTimeout = null;
      } else if (e.cancelable && internalRef.current.dragState) {
        e.preventDefault();
        window.getSelection()?.removeAllRanges();
        internalRef.current.mousePosition = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        followPointer(internalRef.current.dragState, createEventLike(e));
        clearInterval(
          internalRef.current.scrollTimeout
            ? internalRef.current.scrollTimeout - 1
            : 0
        ); // in Development mode the timeout is created twice
      }
    };
    const onTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
      if (e.cancelable) e.preventDefault();
      if (internalRef.current.scrollTimeout) {
        clearInterval(internalRef.current.scrollTimeout);
        clearInterval(internalRef.current.scrollTimeout - 1); // in Development mode the timeout is created twice
        internalRef.current.scrollTimeout = null;
      }

      if (internalRef.current.touchTimeout) {
        clearTimeout(internalRef.current.touchTimeout);
        internalRef.current.touchTimeout = null;
        const clickEvent = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          detail: 1,
        });

        e.target?.dispatchEvent(clickEvent);
      }
      if (
        internalRef.current.dragState &&
        internalRef.current.dragState.isDragging
      ) {
        // rearrangeCallback(internalRef.current.dragStateRef, identifier);
        removeAndAnimateClone(delayMS, workingRef);
        internalRef.current.mousePosition = null;
        dragDispatch({ type: "drop" });
      }
    };

    useEffect(() => {
      if (workingRef.current) {
        workingRef.current.addEventListener("pointermove", onPointerMove);
        workingRef.current.addEventListener("touchstart", onTouchStart, {
          passive: false,
        });
        workingRef.current.addEventListener("touchmove", onTouchMove, {
          passive: false,
        });
      }
      return () => {
        if (workingRef.current) {
          workingRef.current.removeEventListener("pointermove", onPointerMove);
          workingRef.current.removeEventListener("touchstart", onTouchStart);
          workingRef.current.removeEventListener("touchmove", onTouchMove);
        }
      };
    }, []);

    return {
      draggable: true,
      onDragStart,
      onDrag,
      onDragOver,
      onDragEnd,
      onPointerDown,
      onPointerUp,
      onTouchEnd,
      ref: workingRef,
    };
  };
};

export default createDragElementHook;
