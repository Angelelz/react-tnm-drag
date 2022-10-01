import React, { useEffect, useRef } from "react";
import { emptyElement, isReactEv, isTouchEv } from "../helpers/helpers";
import {
  DispatchDragObjectOne,
  DispatchDragObjectThree,
  DispatchDragObjectTwo,
  DragStateLike,
  DragStateOne,
  DragStateThree,
  DragStateTwo,
  EventLike,
  NoS,
} from "../types/types";

function useDrag<
  T extends
    | DragStateOne<NoS>
    | DragStateTwo<NoS, NoS>
    | DragStateThree<NoS, NoS, NoS>
>(
  dragState: T,
  dispatchDragState: T extends DragStateOne<infer P>
    ? React.Dispatch<DispatchDragObjectOne<P>>
    : T extends DragStateTwo<infer P, infer Q>
    ? React.Dispatch<DispatchDragObjectTwo<P, Q>>
    : T extends DragStateThree<infer P, infer Q, infer R>
    ? React.Dispatch<DispatchDragObjectThree<P, Q, R>>
    : never,
  identifier: T extends DragStateOne<infer P>
    ? P
    : T extends DragStateTwo<NoS, infer Q>
    ? Q
    : T extends DragStateThree<NoS, NoS, infer R>
    ? R
    : never,
  index: number,
  moveItem: T extends DragStateOne<infer P>
    ? (DS: DragStateOne<P>, identifier: P) => void
    : T extends DragStateTwo<infer P, NoS>
    ? (DS: DragStateTwo<P, NoS>, identifier: P) => void
    : T extends DragStateThree<infer P, NoS, NoS>
    ? (DS: DragStateThree<P, NoS, NoS>, identifier: P) => void
    : never,
  direction: "vertical" | "horizontal" = "vertical",
  delayMS: number = 0,
  ref?: React.RefObject<HTMLElement>
): {
  draggable: boolean;
  onDragStart: (e: React.DragEvent<HTMLElement>) => void;
  onDrag: (e: React.DragEvent<HTMLElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLElement>) => void;
  onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLElement>) => void;
  onTouchEnd: (e: React.TouchEvent<HTMLElement>) => void;
  ref: React.RefObject<HTMLElement>;
} {
  const elementRef = useRef<HTMLElement>(null);
  const touchTimeout = useRef<number | null>(null);
  const scrollTimeout = useRef<number | null>(null);
  const dragStateRef = useRef<typeof dragState>(dragState);
  const mousePosition = useRef<{ x: number; y: number } | null>(null);
  const pointerId = useRef<number | null>(null);
  dragStateRef.current = dragState;

  const workingRef = ref ?? elementRef;

  const onDragStart = (e: React.DragEvent<HTMLElement>) => {
    if (e.dataTransfer) {
      e.dataTransfer.setDragImage(emptyElement.element, 0, 0);
      e.dataTransfer.dropEffect = "copy";
    }

    setTimeout(() => {
      startDrag(workingRef, e, direction, dispatchDragState, identifier, index);
    }, 0);
  };

  const onDrag = (e: React.DragEvent<HTMLElement>) => {
    followPointer(dragState, e);
  };

  const onDragOver = (e: React.DragEvent<HTMLElement>) => {
    if (e.type !== "touchmove") e.preventDefault();
    draggingOver(
      dragState,
      workingRef,
      e,
      direction,
      identifier,
      dispatchDragState,
      index
    );
  };

  const onDragEnd = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    moveItem(dragState, identifier);
    setTimeout(() => {
      document.getElementById("clone")?.remove();
      const elements = document.querySelectorAll("[id='clone']");
      if (elements.length > 0) {
        elements.forEach((element) => {
          element.remove();
        });
      }
    }, delayMS);
    dispatchDragState({
      type: "drop",
    });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    pointerId.current = e.pointerId;
  };

  function onPointerMove(e: PointerEvent) {
    if (dragStateRef.current && dragStateRef.current.isDragging) {
      draggingOver(
        dragStateRef.current,
        workingRef,
        createEventLike(e),
        direction,
        identifier,
        dispatchDragState,
        index
      );
    }
  }

  const onPointerUp = (e: React.PointerEvent<HTMLElement>) => {
    pointerId.current = null;
  };

  const onTouchStart = (e: TouchEvent) => {
    touchTimeout.current = setTimeout(() => {
      touchTimeout.current = null;
      if (dragStateRef.current && !!onDragStart && pointerId.current) {
        e.preventDefault();
        (e.target as HTMLElement).releasePointerCapture(pointerId.current);
        startDrag(
          workingRef,
          createEventLike(e),
          direction,
          dispatchDragState,
          identifier,
          index
        );
      }
      mousePosition.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      if (scrollTimeout.current === null) {
        scrollTimeout.current = setInterval(
          () => doScroll(mousePosition.current),
          150
        );
      }
      window.getSelection()?.removeAllRanges();
    }, 500);
  };
  const onTouchMove = (e: TouchEvent) => {
    if (touchTimeout.current) {
      clearTimeout(touchTimeout.current);
      touchTimeout.current = null;
    } else if (e.cancelable && dragStateRef.current) {
      e.preventDefault();
      window.getSelection()?.removeAllRanges();
      mousePosition.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      followPointer(dragStateRef.current, createEventLike(e));
      clearInterval(scrollTimeout.current ? scrollTimeout.current - 1 : 0); // in Development mode the timeout is created twice
    }
  };
  const onTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    if (e.cancelable) e.preventDefault();
    if (scrollTimeout.current) {
      clearInterval(scrollTimeout.current);
      clearInterval(scrollTimeout.current - 1); // in Development mode the timeout is created twice
      scrollTimeout.current = null;
    }

    if (touchTimeout.current) {
      clearTimeout(touchTimeout.current);
      touchTimeout.current = null;
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        detail: 1,
      });

      e.target?.dispatchEvent(clickEvent);
    }
    if (dragStateRef.current && dragStateRef.current.isDragging) {
      moveItem(dragStateRef.current, identifier);
      setTimeout(() => {
        document.getElementById("clone")?.remove();
        const elements = document.querySelectorAll("[id='clone']");
        if (elements.length > 0) {
          elements.forEach((element) => {
            element.remove();
          });
        }
      }, delayMS);
      mousePosition.current = null;
      dispatchDragState({ type: "drop" });
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
}

function draggingOver<T extends NoS>(
  dragState: DragStateLike<T>,
  workingRef: React.RefObject<HTMLElement>,
  e: EventLike,
  direction: "vertical" | "horizontal",
  identifier: T,
  dispatchDragState:
    | React.Dispatch<DispatchDragObjectOne<NoS>>
    | React.Dispatch<DispatchDragObjectTwo<NoS, NoS>>
    | React.Dispatch<DispatchDragObjectThree<NoS, NoS, NoS>>,
  index: number
) {
  if (dragState.isDragging) {
    const dragEl =
      workingRef !== undefined && !!workingRef.current
        ? workingRef.current
        : (e.target as HTMLElement);
    const hoverBoundingRect = dragEl.getBoundingClientRect();
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffsetY = e.clientY;
    const clientOffsetX = e.clientX;
    const hoverClientY = clientOffsetY - hoverBoundingRect.top;
    const hoverClientX = clientOffsetX - hoverBoundingRect.left;

    const position =
      direction === "vertical"
        ? hoverClientY < hoverMiddleY
          ? "before"
          : "after"
        : hoverClientX < hoverMiddleX
        ? "before"
        : "after";
    if (
      dragState.targetItem.position !== position ||
      dragState.targetItem.identifier !== identifier
    )
      dispatchDragState({
        type: "overItem",
        payload: { identifier, index, position },
      });
  }
}

function followPointer(dragState: DragStateLike<NoS>, e: EventLike) {
  const el = document.getElementById("clone");
  if (el && dragState && dragState.element.offsetY !== 0) {
    if (e.type !== "touchmove") e.preventDefault();
    if (e.pageY - dragState.element.offsetY > 0)
      el.style.top = `${e.pageY - dragState.element.offsetY}px`;
    if (e.pageX - dragState.element.offsetX > 0)
      el.style.left = `${e.pageX - dragState.element.offsetX}px`;
  }
}

function doScroll(mousePosition: { x: number; y: number } | null) {
  if (mousePosition) {
    if (mousePosition.x > document.documentElement.clientWidth - 40)
      scroller("right");
    if (mousePosition.x < 40) scroller("left");
    if (mousePosition.y > document.documentElement.clientHeight - 40)
      scroller("down");
    if (mousePosition.y < 40) scroller("up");
  }
}

function scroller(direction: "up" | "down" | "left" | "right") {
  switch (direction) {
    case "up":
      if (window.scrollY >= 60) {
        window.scrollBy({ left: 0, top: -60, behavior: "smooth" });
      }
      break;
    case "down":
      if (
        window.scrollY + document.documentElement.clientHeight <=
        document.body.scrollHeight - 60
      ) {
        window.scrollBy({ left: 0, top: 60, behavior: "smooth" });
      }
      break;
    case "left":
      if (window.scrollX >= 60) {
        window.scrollBy({ left: -60, top: 0, behavior: "smooth" });
      }
      break;
    case "right":
      if (
        window.scrollX + document.documentElement.clientWidth <=
        document.body.scrollWidth
      ) {
        // console.log(window.screenLeft + window.innerWidth, document.body.scrollWidth)
        window.scrollBy({ left: 60, top: 0, behavior: "smooth" });
      }
      break;
  }
}

function startDrag<T extends NoS>(
  workingRef: React.RefObject<HTMLElement>,
  e: EventLike,
  direction: "vertical" | "horizontal",
  dispatchDragState:
    | React.Dispatch<DispatchDragObjectOne<T>>
    | React.Dispatch<DispatchDragObjectTwo<T, NoS>>
    | React.Dispatch<DispatchDragObjectThree<T, NoS, NoS>>,
  identifier: T,
  index: number
) {
  const dragEl =
    workingRef !== undefined && !!workingRef.current
      ? workingRef.current
      : (e.target as HTMLElement);
  const boundingRect = dragEl.getBoundingClientRect();

  const size =
    direction === "vertical" ? boundingRect.height : boundingRect.width;
  document.documentElement.style.setProperty("--pix", size + 4 + "px");
  const clonedEl = dragEl.cloneNode(true) as HTMLElement;

  clonedEl.id = "clone";
  clonedEl.style.position = "absolute";
  clonedEl.style.top = boundingRect.y + (e.pageY - e.clientY) + "px";
  clonedEl.style.left = boundingRect.x + (e.pageX - e.clientX) + "px";
  clonedEl.style.width = `${boundingRect.width}px`;
  clonedEl.style.zIndex = "2000";
  clonedEl.style.pointerEvents = "none";

  document.body.appendChild(clonedEl);

  dispatchDragState({
    type: "sourceItem",
    payload: {
      identifier: identifier,
      index: index,
      element: {
        element: clonedEl,
        x: 2 * boundingRect.x - e.clientX + (e.pageX - e.clientX),
        y: 2 * boundingRect.y - e.clientY + (e.pageY - e.clientY),
        offsetX: !!e.nativeEvent
          ? e.nativeEvent.offsetX
          : (boundingRect.right - boundingRect.left) / 2,
        offsetY: !!e.nativeEvent
          ? e.nativeEvent.offsetY
          : (boundingRect.bottom - boundingRect.top) / 2,
      },
    },
  });
}

function createEventLike(
  e:
    | React.TouchEvent<HTMLElement>
    | React.DragEvent<HTMLElement>
    | React.PointerEvent<HTMLElement>
    | TouchEvent
    | PointerEvent
): EventLike {
  const ev: EventLike = {
    clientX: isTouchEv(e) ? e.touches[0].clientX : e.clientX,
    clientY: isTouchEv(e) ? e.touches[0].clientY : e.clientY,
    nativeEvent: isReactEv(e) ? e.nativeEvent : undefined,
    pageX: isTouchEv(e) ? e.touches[0].pageX : e.pageX,
    pageY: isTouchEv(e) ? e.touches[0].pageY : e.pageY,
    preventDefault: e.preventDefault,
    target: e.target,
    type: e.type,
  };
  return ev;
}

export default useDrag;