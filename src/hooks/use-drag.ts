import { useEffect, useRef } from "react";
import { emptyElement } from "../helpers/helpers";
import {
  DispatchDragObjectOne,
  DispatchDragObjectThree,
  DispatchDragObjectTwo,
  DragStateOne,
  DragStateThree,
  DragStateTwo,
  NoS,
} from "../types/types";

export function useDrag<
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
    ? (DS: any, identifier: P) => void
    : T extends DragStateTwo<infer P, NoS>
    ? (DS: any, identifier: P) => void
    : T extends DragStateThree<infer P, NoS, NoS>
    ? (DS: any, identifier: P) => void
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
    // onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
    // onTouchStart: (e: React.TouchEvent<HTMLElement>) => void;
    // onPointerMoveCapture: (e: React.PointerEvent<HTMLElement>) => void;
    // onTouchEnd: (e: React.TouchEvent<HTMLElement>) => void;
    // onPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
    ref: React.RefObject<HTMLElement>;
} {
  // const controller1 = new AbortController();
  // document.addEventListener("touchstart", (e) => e.preventDefault(), {
  //   passive: false,
  //   signal: controller1.signal,
  // });
  // document.addEventListener("touchmove", (e) => e.preventDefault(), {
  //   passive: false,
  // });
  // document.addEventListener("touchend", (e) => e.preventDefault(), {
  //   passive: false,
  // });

  // controller1.abort();
  // console.log("executed");
  const elementRef = useRef<HTMLElement>(null);
  const timeout = useRef<number | null>(null);
  const initialOffset = useRef<{ x: number; y: number } | null>(null);
  const dragStateRef = useRef<typeof dragState>(dragState)
  dragStateRef.current = dragState;

  const workingRef = ref ?? elementRef;

  const onDragStart = (e: React.DragEvent<HTMLElement>) => {
    if (e.dataTransfer) {
      e.dataTransfer.setDragImage(emptyElement.element, 0, 0);
      e.dataTransfer.dropEffect = "copy";
    }
    console.log("started dragging")
    // if (e.type === "pointerdown") {
    //   document.addEventListener("pointermove", pointerMove);
    //   document.addEventListener("pointerup", removeEvents);
    // }
    
    setTimeout(() => {
      const dragEl =
        workingRef !== undefined && !!workingRef.current
          ? workingRef.current
          : (e.target as HTMLElement);
      const boundingRect = dragEl.getBoundingClientRect();

      initialOffset.current = {
        x:
          e.nativeEvent.offsetX ?? (boundingRect.right - boundingRect.left) / 2,
        y:
          e.nativeEvent.offsetY ?? (boundingRect.right - boundingRect.left) / 2,
      };

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
            offsetX:
              e.nativeEvent.offsetX ??
              (boundingRect.right - boundingRect.left) / 2,
            offsetY:
              e.nativeEvent.offsetY ??
              (boundingRect.right - boundingRect.left) / 2,
          },
        },
      });
    }, 0);
  };

  // function pointerMove(e: PointerEvent) {
  //   const el = document.getElementById("clone");
  //   if (initialOffset.current && el) {
  //     e.preventDefault();
  //     if (e.pageY - initialOffset.current.y > 0)
  //       el.style.top = `${e.pageY - initialOffset.current.y}px`;
  //     if (e.pageX - initialOffset.current.x > 0)
  //       el.style.left = `${e.pageX - initialOffset.current.x}px`;
  //   }
  // }

  // function removeEvents(this: Document) {
  //   this.removeEventListener("pointerup", removeEvents);
  //   this.removeEventListener("pointermove", pointerMove);
  // }

  const onDrag = (e: React.DragEvent<HTMLElement>) => {
    const el = document.getElementById("clone");
    if (initialOffset.current && el) {
      e.preventDefault();
      // e.stopPropagation();
      if (e.pageY - initialOffset.current.y > 0)
        el.style.top = `${e.pageY - initialOffset.current.y}px`;
      if (e.pageX - initialOffset.current.x > 0)
        el.style.left = `${e.pageX - initialOffset.current.x}px`;
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLElement>) => {
    if (e.type !== "touchmove") e.preventDefault();
    if (dragState?.isDragging) {
      const dragEl =
        workingRef !== undefined && !!workingRef.current
          ? workingRef.current
          : (e.target as HTMLElement);
      const hoverBoundingRect = dragEl.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
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
  };

  const onDragEnd = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    initialOffset.current = null;
    // document.removeEventListener("pointermove", pointerMove);

    moveItem(dragState as any, identifier);
    setTimeout(() => {
      document.getElementById("clone")?.remove();
    }, delayMS);
    dispatchDragState({
      type: "drop",
    });
  };

  const pointerDown = (e: PointerEvent) => {
    if (e.pointerType === "touch" && !timeout.current && dragStateRef.current) {
      // e.preventDefault()
      
      
      timeout.current = setTimeout(() => {
        e.preventDefault();
        // (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        timeout.current = null;
        console.log("should start dragging here")
        console.log(dragStateRef.current)
        console.log(onDragStart)

        // onDragStart(e as unknown as React.DragEvent<HTMLElement>);
      }, 500);
    }
  };

  const pointerUp = (e: PointerEvent) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
      const clickEvent = new MouseEvent('click', { bubbles: true });

      e.target?.dispatchEvent(clickEvent);
      // console.log("test")
      // const clickEvent = new MouseEvent('click', { button: 0});
      // e.target.dispatchEvent(clickEvent);
    } // else if (dragState.isDragging) {
      // onDragEnd(e as unknown as React.DragEvent<HTMLElement>);
    // }
  }

  const pointerMove = (e: PointerEvent) => {
    if (
      timeout.current
    ) {
      console.log("should scroll", e.movementX, e.movementY)
      clearTimeout(timeout.current);
      timeout.current = null;
      // window.scroll( e.movementX, e.movementY)
      // document.documentElement.scrollBy(-e.movementX, -e.movementY)
    }
    if (e.pointerType === "touch" && dragStateRef.current && !dragStateRef.current.isDragging) {
      console.log("should scroll here")
      window.scrollBy(-e.movementX * 4, -e.movementY * 4)
    }
  };

  const touchStart = (e: TouchEvent) => {
    e.preventDefault();
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
      // console.log("test")
      // const clickEvent = new MouseEvent('click', { button: 0});
      // e.target.dispatchEvent(clickEvent);
    } else if (dragState.isDragging) {
      onDragEnd(e as unknown as React.DragEvent<HTMLElement>);
    }
    if ((e.target as HTMLElement).style.touchAction === "auto")
      (e.target as HTMLElement).style.touchAction = "none";
  };

  // const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
  //   if (dragState.isDragging) {
  //     onDragOver(e as unknown as React.DragEvent<HTMLElement>);
  //   }
  // };

  useEffect(() => {
    if (workingRef.current) {
      console.log("added event")
      workingRef.current.addEventListener('pointerdown', pointerDown, {passive: false})
      workingRef.current.addEventListener('pointerup', pointerUp, {passive: false})
      workingRef.current.addEventListener('pointermove', pointerMove, {passive: false})
      workingRef.current.addEventListener('touchstart', touchStart, {passive: false})
    }
    return () => {
      if (workingRef.current) {
        console.log("removed event")
        workingRef.current.removeEventListener('pointerdown', pointerDown);
        workingRef.current.removeEventListener('pointerup', pointerUp);
        workingRef.current.removeEventListener('pointermove', pointerMove);
        workingRef.current.removeEventListener('touchstart', touchStart);
      }
    }
  }, [])

  return {
      draggable: true,
      onDragStart,
      onDrag,
      onDragOver,
      onDragEnd,
      // onPointerDown,
      // onTouchStart,
      // onPointerMoveCapture,
      // onTouchEnd,
      // onPointerMove,
      ref: workingRef
  };
}
