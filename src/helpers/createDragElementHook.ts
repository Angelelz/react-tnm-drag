import React, { useEffect, useRef } from "react";
import {
  createEventLike,
  doScroll,
  draggingOver,
  emptyElement,
  followPointer,
  createCloneAndStartDrag,
} from "./helpers";
import {
  GlobalDragStore,
  ArrayCallback,
  Direction,
  DragElementHook,
  DragProps,
  InternalRef,
  NoS,
} from "../types/types";

const createDragElementHook = <El>(
  elementArray: El[],
  GlobalDragStore: GlobalDragStore
): DragElementHook => {
  return <T extends NoS, R extends HTMLElement>(
    id: T,
    index: number,
    arrayCallback: ArrayCallback<El>,
    direction: Direction = "vertical",
    delayMS: number = 500,
    ref?: React.RefObject<R>
  ): DragProps<R> => {
    const elementRef = useRef<R>(null);
    const internalRef = useRef<InternalRef>({
      touchTimeout: null,
      scrollTimeout: null,
      mousePosition: null,
      pointerId: null,
      initialStyle: null,
      index,
      id,
    });

    internalRef.current.index = index;
    internalRef.current.id = id;

    const workingRef = ref ?? elementRef;

    useEffect(() => {
      if (internalRef.current.initialStyle === null && workingRef.current) {
        internalRef.current.initialStyle = {
          transition: workingRef.current.style.transition,
          translate: workingRef.current.style.translate,
          opacity: workingRef.current.style.opacity,
        };
      }
    }, []);

    if (
      GlobalDragStore.dragState.current.isDragging &&
      id === GlobalDragStore.dragState.current.sourceItem.id &&
      workingRef.current
    ) {
      workingRef.current.style.pointerEvents = "none";
      workingRef.current.style.opacity = "0";
    } else if (workingRef.current) {
      workingRef.current.style.pointerEvents = "";
    }

    if (
      internalRef.current.initialStyle !== null &&
      id !== GlobalDragStore.dragState.current.targetItem.id
    ) {
      workingRef.current!.style.transition =
        internalRef.current.initialStyle.transition;
      workingRef.current!.style.translate =
        internalRef.current.initialStyle.translate;
    }

    if (
      !GlobalDragStore.dragState.current.isDragging &&
      workingRef.current &&
      GlobalDragStore.dragState.current.droppedItem &&
      GlobalDragStore.dragState.current.droppedItem.id === id
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
          GlobalDragStore.dragDispatch,
          id,
          index
        );
      }, 0);
    };

    const onDrag = (e: React.DragEvent<HTMLElement>) => {
      followPointer(GlobalDragStore.dragState.current, createEventLike(e));
    };

    const onDragOver = (e: React.DragEvent<HTMLElement>) => {
      if (e.type !== "touchmove") e.preventDefault();
      draggingOver(
        GlobalDragStore.dragState.current,
        workingRef,
        e,
        direction,
        GlobalDragStore.dragDispatch,
        arrayCallback,
        elementArray,
        internalRef.current,
        delayMS / 2,
        GlobalDragStore,
        id,
        index
      );
    };

    const onDragEnd = (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      GlobalDragStore.dragDispatch(
        {
          type: "drop",
        },
        delayMS,
        workingRef
      );
    };

    const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
      internalRef.current.pointerId = e.pointerId;
    };

    function onPointerMove(e: PointerEvent) {
      if (
        GlobalDragStore.dragState.current &&
        GlobalDragStore.dragState.current.isDragging
      ) {
        draggingOver(
          GlobalDragStore.dragState.current,
          workingRef,
          createEventLike(e),
          direction,
          GlobalDragStore.dragDispatch,
          arrayCallback,
          elementArray,
          internalRef.current,
          delayMS / 2,
          GlobalDragStore
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
          GlobalDragStore.dragState.current &&
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
            GlobalDragStore.dragDispatch,
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
      } else if (e.cancelable && GlobalDragStore.dragState.current) {
        e.preventDefault();
        window.getSelection()?.removeAllRanges();
        internalRef.current.mousePosition = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        followPointer(GlobalDragStore.dragState.current, createEventLike(e));
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
        GlobalDragStore.dragState.current &&
        GlobalDragStore.dragState.current.isDragging
      ) {
        internalRef.current.mousePosition = null;
        GlobalDragStore.dragDispatch({ type: "drop" }, delayMS, workingRef);
      }
    };

    useEffect(() => {
      const unRegister = GlobalDragStore.AnimationSync.Register(
        index,
        workingRef
      );
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
