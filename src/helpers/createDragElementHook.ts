import React, { useEffect, useRef } from "react";
import {
  removeAndAnimateClone,
  createEventLike,
  doScroll,
  draggingOver,
  emptyElement,
  followPointer,
  createCloneAndStartDrag,
} from "./helpers";
import {
  AnimationSync,
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
  animationSync: AnimationSync
): DragElementHook => {
  return <T extends NoS, R extends HTMLElement>(
    id: T,
    index: number,
    arrayCallback: ArrayCallback<El>,
    direction: Direction = "vertical",
    delayMS: number = 1000,
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
      index,
      id,
    });

    internalRef.current.dragState = dragState;
    internalRef.current.index = index;
    internalRef.current.id = id;

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
      id === dragState.sourceItem.id &&
      workingRef.current
    ) {
      workingRef.current.style.pointerEvents = "none";
      workingRef.current.style.opacity = "0";
    } else if (workingRef.current) {
      workingRef.current.style.pointerEvents = "";
    }

    if (
      internalRef.current.initialStyle !== null &&
      id !== dragState.targetItem.id
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
      dragState.droppedItem.id === id
    ) {
      workingRef.current!.style.opacity = "0";
      setTimeout(() => {
        workingRef.current!.style.opacity =
          internalRef.current.initialStyle!.opacity;
      }, delayMS / 2);
    }

    const onDragStart = (e: React.DragEvent<HTMLElement>) => {
      // internalRef.current.index = index
      // console.log(internalRef.current.index)
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
          id,
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
        dragDispatch,
        arrayCallback,
        elementArray,
        internalRef.current,
        delayMS / 2,
        animationSync,
        id,
        index
      );
    };

    const onDragEnd = (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      if (animationSync.timeout === null)
        removeAndAnimateClone(delayMS, workingRef);
      else {
        animationSync.RunAfterTimer.add(() =>
          removeAndAnimateClone(delayMS, workingRef)
        );
      }
      dragDispatch({
        type: "drop",
      });
    };

    const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
      internalRef.current.pointerId = e.pointerId;
      // internalRef.current.index = index;
      // console.log(internalRef.current.index)
    };

    function onPointerMove(e: PointerEvent) {
      if (
        internalRef.current.dragState &&
        internalRef.current.dragState.isDragging
      ) {
        // console.log({id, index, currentIndex: internalRef.current.index})
        draggingOver(
          internalRef.current.dragState,
          workingRef,
          createEventLike(e),
          direction,
          dragDispatch,
          arrayCallback,
          elementArray,
          internalRef.current,
          delayMS / 2,
          animationSync
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
            id,
            internalRef.current.index!
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
        if (animationSync.timeout === null)
          removeAndAnimateClone(delayMS, workingRef);
        else {
          animationSync.RunAfterTimer.add(() =>
            removeAndAnimateClone(delayMS, workingRef)
          );
        }
        internalRef.current.mousePosition = null;
        dragDispatch({ type: "drop" });
      }
    };

    useEffect(() => {
      const unRegister = animationSync.Register(index, workingRef);
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
        unRegister();
        if (workingRef.current) {
          workingRef.current.removeEventListener("pointermove", onPointerMove);
          workingRef.current.removeEventListener("touchstart", onTouchStart);
          workingRef.current.removeEventListener("touchmove", onTouchMove);
        }
      };
    });

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
