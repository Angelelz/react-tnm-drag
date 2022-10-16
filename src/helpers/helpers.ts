import React from "react";
import {
  ArrayCallback,
  DispatchDragObject,
  DispatchDragObjectOneContainer,
  DispatchDragObjectPrimaryContainer,
  DispatchDragObjectSecondaryContainer,
  DispatchDragObjectSource,
  DispatchDragObjectTarget,
  DispatchDragObjectTwoContainers,
  DragActionsThree,
  DragObjIdentifier,
  DragOptions,
  DragOptionsNoContainer,
  DragState,
  DragStateLike,
  DragStateOneContainer,
  DragStateSimple,
  DragStateTwoContainers,
  ElementObject,
  EventLike,
  InitialStyle,
  InternalRef,
  NoS,
} from "../types/types";

export function isSourceDispatchObj<P extends NoS>(
  objA: DispatchDragObject<any>
): objA is DispatchDragObjectSource<P> {
  return objA.type === "sourceItem";
}

export function isTargetDispatchObj<P extends NoS>(
  obj: DispatchDragObject<any>
): obj is DispatchDragObjectTarget<P> {
  return obj.type === "overItem";
}

export function isPrimaryContainerDispatchObj<P extends NoS, Q extends NoS>(
  obj: DispatchDragObject<any>
): obj is DispatchDragObjectPrimaryContainer<Q> {
  return (
    obj.type === "primaryContainerEnter" || obj.type === "primaryContainerLeave"
  );
}

export function isSecondaryContainerDispatchObj<
  P extends NoS,
  Q extends NoS,
  R extends NoS
>(
  obj: DispatchDragObject<any>
): obj is DispatchDragObjectSecondaryContainer<R> {
  return (
    obj.type === "secondaryContainerEnter" ||
    obj.type === "secondaryContainerLeave"
  );
}

export function isDragStateOneContainer(
  obj: DragState<any>
): obj is DragStateOneContainer<NoS, NoS> {
  return "containerNumber" in obj && obj.containerNumber === 1;
}

export function isDragStateTwoContainers(
  obj: DragState<any>
): obj is DragStateTwoContainers<NoS, NoS, NoS> {
  return "containerNumber" in obj && obj.containerNumber === 2;
}

export const emptyElement: ElementObject =
  typeof document !== "undefined"
    ? {
        element: document.createElement("span"),
        x: 0,
        y: 0,
        offsetX: 0,
        offsetY: 0,
      }
    : ({} as ElementObject);

export const initialDragState = (
  options: DragOptions<any>
): DragState<typeof options> => {
  const nullItem: DragObjIdentifier<NoS> = {
    identifier: null,
    index: null,
  };
  const dragStateSimple: DragStateSimple<NoS> = {
    element: emptyElement,
    isDragging: false,
    lastTargetItem: nullItem,
    sourceItem: nullItem,
    targetItem: nullItem,
  };

  if (!("containerNumber" in options)) {
    return dragStateSimple;
  }
  const dragStateOneContainer: DragStateOneContainer<NoS, NoS> = {
    ...dragStateSimple,
    containerNumber: 1 as 1,
    primaryContainer: nullItem,
    lastPrimaryContainer: nullItem,
  };
  if (options.containerNumber === 1) {
    return dragStateOneContainer;
  }
  return {
    ...dragStateOneContainer,
    containerNumber: 2,
    secondaryContainer: nullItem,
    lastSecondaryContainer: nullItem,
  };
};

export const isTouchEv = (
  e: any
): e is React.TouchEvent<HTMLElement> | TouchEvent => {
  return e.touches !== undefined;
};

export const isReactEv = (e: any): e is React.DragEvent<HTMLElement> => {
  return e.nativeEvent !== undefined;
};

export function removeAndAnimateClone(
  ms: number,
  ref?: React.RefObject<HTMLElement>
) {
  const el = document.getElementById("clone");
  if (ref && ref.current && el) {
    ref.current.style.transition = `opacity ${ms / 2000}s linear ${ms / 2000}s`;
    ref.current.style.opacity = "";
    const targetRect = ref.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const top = targetRect.top + window.scrollY;
    const left = targetRect.left + window.scrollX;
    el.style.transition = `top ${ms / 2000}s ease-in-out, left ${
      ms / 2000
    }s ease-in-out, opacity ${ms / 2000}s linear ${ms / 2000}s`;
    el.style.top = `${Math.floor(top)}px`;
    el.style.left = `${Math.floor(left)}px`;
    el.style.opacity = "0";
  }
  setTimeout(() => {
    const elements = document.querySelectorAll("[id='clone']");
    if (ref && ref.current) ref.current.style.transition = "";
    if (elements.length > 0) {
      elements.forEach((element) => {
        element.remove();
      });
    }
  }, ms);
}

export function draggingOver<T extends NoS, El>(
  dragState: DragStateLike<T>,
  workingRef: React.RefObject<HTMLElement>,
  e: EventLike,
  direction: "vertical" | "horizontal",
  identifier: T,
  dispatchDragState: React.Dispatch<DispatchDragObject<any>>,
  index: number,
  setArray: ArrayCallback<El>,
  array: El[],
  internalRef: InternalRef<El>,
  animationTimeout: React.MutableRefObject<number | null>
) {
  if (dragState.isDragging) {
    const mms = 100;
    const shouldBeLess = dragState.sourceItem.index! < index;
    if (
      index !== dragState.sourceItem.index &&
      animationTimeout.current === null
    ) {
      const element = array.splice(dragState.sourceItem.index!, 1)[0];
      array.splice(index, 0, element);
      shouldBeLess
        ? animateTranslateBackwards(workingRef.current!, direction, mms)
        : animateTranslateForward(workingRef.current!, direction, mms);
      animationTimeout.current = setTimeout(() => {
        animationTimeout.current = null;
        dispatchDragState({
          type: "overItem",
          payload: {
            identifier,
            index: shouldBeLess ? index - 1 : index + 1,
            newSourceIndex: index,
          },
        });
        setArray(array);
        resetStyles(workingRef.current!, internalRef.initialStyle!);
      }, mms - 20);
    }
  }
}

export function followPointer(dragState: DragStateLike<NoS>, e: EventLike) {
  const el = document.getElementById("clone");
  if (el && dragState && dragState.element.offsetY !== 0) {
    if (e.type !== "touchmove") e.preventDefault();
    if (e.pageY - dragState.element.offsetY > 0) {
      el.style.top = `${e.pageY - dragState.element.offsetY}px`;
    }
    if (e.pageX - dragState.element.offsetX > 0) {
      el.style.left = `${e.pageX - dragState.element.offsetX}px`;
    }
  }
}

export function doScroll(mousePosition: { x: number; y: number } | null) {
  if (mousePosition) {
    if (mousePosition.x > document.documentElement.clientWidth - 40)
      scroller("right");
    if (mousePosition.x < 40) scroller("left");
    if (mousePosition.y > document.documentElement.clientHeight - 40)
      scroller("down");
    if (mousePosition.y < 40) scroller("up");
  }
}

export function scroller(direction: "up" | "down" | "left" | "right") {
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
        window.scrollBy({ left: 60, top: 0, behavior: "smooth" });
      }
      break;
  }
}

export function createCloneAndStartDrag<T extends NoS>(
  workingRef: React.RefObject<HTMLElement>,
  e: EventLike,
  direction: "vertical" | "horizontal",
  dispatchDragState: React.Dispatch<DispatchDragObject<any>>,
  identifier: T,
  index: number
) {
  const dragEl =
    workingRef !== undefined && !!workingRef.current
      ? workingRef.current
      : (e.target as HTMLElement);
  const boundingRect = dragEl.getBoundingClientRect();

  const size =
    direction === "vertical" ? getTotalHeight(dragEl) : getTotalWidth(dragEl);
  document.documentElement.style.setProperty("--pix", size + "px");
  const clonedEl = dragEl.cloneNode(true) as HTMLElement;

  clonedEl.id = "clone";
  clonedEl.style.position = "absolute";
  clonedEl.style.top = boundingRect.y + (e.pageY - e.clientY) + "px";
  clonedEl.style.left = boundingRect.x + (e.pageX - e.clientX) + "px";
  clonedEl.style.width = `${boundingRect.width}px`;
  clonedEl.style.height = `${boundingRect.height}px`;
  clonedEl.style.zIndex = "2000";
  clonedEl.style.pointerEvents = "none";
  clonedEl.style.margin = "0px";

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

export function createEventLike(
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
    screenX: isTouchEv(e) ? e.touches[0].screenX : e.screenX,
    screenY: isTouchEv(e) ? e.touches[0].screenY : e.screenY,
    preventDefault: e.preventDefault,
    target: e.target,
    type: e.type,
  };
  return ev;
}

export function animateTranslateForward<R extends HTMLElement>(
  el: R,
  direction: string,
  ms: number
) {
  const translationPixels =
    direction === "vertical"
      ? `0px ${getTotalHeight(el)}px`
      : `${getTotalWidth(el)}px`;
  el.style.transition = "translate " + ms / 1000 + "s linear";
  el.style.translate = translationPixels;
}

export function animateTranslateBackwards<R extends HTMLElement>(
  el: R,
  direction: string,
  ms: number
) {
  const translationPixels =
    direction === "vertical"
      ? `0px ${-getTotalHeight(el)}px`
      : `${-getTotalWidth(el)}px`;
  el.style.transition = "translate " + ms / 1000 + "s linear";
  el.style.translate = translationPixels;
}

export function resetStyles<R extends HTMLElement>(
  el: R,
  initialStyle: InitialStyle
) {
  el.style.transition = initialStyle.transition;
  el.style.translate = initialStyle.translate;
  el.style.opacity = initialStyle.opacity;
}

export function getTotalHeight<R extends HTMLElement>(el: R): number {
  const elStyle = window.getComputedStyle(el);
  const marginHeight =
    parseFloat(elStyle.marginTop) + parseFloat(elStyle.marginBottom);
  return el.getBoundingClientRect().height + marginHeight;
}

export function getTotalWidth<R extends HTMLElement>(el: R): number {
  const elStyle = window.getComputedStyle(el);
  const marginWidth =
    parseFloat(elStyle.marginLeft) + parseFloat(elStyle.marginRight);
  return el.getBoundingClientRect().width + marginWidth;
}
