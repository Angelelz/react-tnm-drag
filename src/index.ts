import React, { useReducer, useRef } from "react";

export function useDragReducer<P extends "number" | "string">(
  sourceType: P
): {
  dragState: DragStateOne<P extends "number" ? number : string>;
  dragDispatch: React.Dispatch<
    DispatchDragObjectOne<P extends "number" ? number : string>
  >;
};
export function useDragReducer<
  P extends "number" | "string",
  Q extends "number" | "string"
>(
  sourceType: P,
  firstTargetType: Q
): {
  dragState: DragStateOne<P extends "number" ? number : string>;
  dragDispatch: React.Dispatch<
    DispatchDragObjectTwo<
      P extends "number" ? number : string,
      Q extends "number" ? number : string
    >
  >;
};
export function useDragReducer<
  P extends "number" | "string",
  Q extends "number" | "string",
  R extends "number" | "string"
>(
  sourceType: P,
  firstTargetType: Q,
  secondTargetType: R
): {
  dragState: DragStateThree<
    P extends "number" ? number : string,
    Q extends "number" ? number : string,
    R extends "number" ? number : string
  >;
  dragDispatch: React.Dispatch<
    DispatchDragObjectThree<
      P extends "number" ? number : string,
      Q extends "number" ? number : string,
      R extends "number" ? number : string
    >
  >;
};
export function useDragReducer<
  P extends "number" | "string",
  Q extends "number" | "string" | undefined,
  R extends "number" | "string" | undefined
>(sourceType: P, firstTargetType?: Q, secondTargetType?: R) {
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
  const dragReducer = (
    dragState: DragState<P, Q, R>,
    dragObject:
      | DispatchDragObjectOne<P extends "number" ? number : string>
      | DispatchDragObjectTwo<
          P extends "number" ? number : string,
          Q extends "number" ? number : string
        >
      | DispatchDragObjectThree<
          P extends "number" ? number : string,
          Q extends "number" ? number : string,
          R extends "number" ? number : string
        >
  ): DragState<P, Q, R> => {
    if (isSourceDispatchObj(dragObject)) {
      return {
        ...dragState,
        droppedItem: { el: emptyElement, identifier: NaN },
        sourceItem: {
          identifier: dragObject.payload.identifier,
          index: dragObject.payload.index,
        },
        element: dragObject.payload.element,
        isDragging: true,
      };
    }
    if (isTargetDispatchObj(dragObject)) {
      return {
        ...dragState,
        lastTargetItem: dragState.targetItem,
        targetItem: {
          identifier: dragObject.payload.identifier,
          index: dragObject.payload.index,
          position: dragObject.payload.position,
        },
      };
    }
    if (isOneContainerDispatchObj(dragObject)) {
      const draggState = dragState as DragStateTwo<
        P extends "number" ? number : string,
        Q extends "number" ? number : string
      >;
      switch (dragObject.type) {
        case "target1Enter":
          return {
            ...dragState,
            lastTarget1: draggState.target1,
            target1: {
              identifier: dragObject.payload.identifier,
              index: dragObject.payload.index,
            },
          };
        case "target1Leave":
          return {
            ...dragState,
            lastTarget1: draggState.target1,
            lastTargetItem: dragState.targetItem,
            target1: {
              identifier: defaultParamFromTypeName(firstTargetType!),
              index: NaN,
            },
            targetItem: {
              identifier: defaultParamFromTypeName(sourceType),
              index: NaN,
              position: undefined,
            },
          };
      }
    }
    if (isTwoContainersDispatchObj(dragObject)) {
      const draggState = dragState as DragStateThree<
        P extends "number" ? number : string,
        Q extends "number" ? number : string,
        R extends "number" ? number : string
      >;
      switch (dragObject.type) {
        case "target2Enter":
          return {
            ...dragState,
            lastTarget2: draggState.target2,
            target2: {
              identifier: dragObject.payload.identifier,
              index: dragObject.payload.index,
            },
          };
        case "target2Leave":
          return {
            ...dragState,
            lastTarget2: draggState.target2,
            target2: {
              identifier: defaultParamFromTypeName(secondTargetType!),
              index: NaN,
            },
            targetItem: {
              identifier: defaultParamFromTypeName(sourceType),
              index: NaN,
              position: undefined,
            },
          };
      }
    }
    return dragObject.type === "drop"
      ? {
          ...initialDragState(sourceType, firstTargetType, secondTargetType),
          droppedItem: {
            el: document.getElementById("clone"),
            identifier: dragState.sourceItem.identifier,
          },
        }
      : initialDragState(sourceType, firstTargetType, secondTargetType);
  };
  const [dragState, dragDispatch] = useReducer(
    dragReducer,
    initialDragState(sourceType, firstTargetType, secondTargetType)
  );
  return {
    dragState,
    dragDispatch,
  };
}

export function useDragContainer<
  T extends "oneContainer" | "firstContainer" | "secondContainer",
  P extends NoS,
  Q extends NoS,
  R extends NoS
>(
  which: T,
  dragState: T extends "oneContainer"
    ? DragStateTwo<P, Q>
    : DragStateThree<P, Q, R>,
  dispatchDragState: React.Dispatch<
    T extends "oneContainer"
      ? DispatchDragObjectTwo<P, Q>
      : DispatchDragObjectThree<P, Q, R>
  >,
  identifier: T extends "secondContainer" ? R : Q,
  index: number
): {
  onDragOver: (e: React.MouseEvent<HTMLElement>) => void;
  onDragLeave: (e: React.MouseEvent<HTMLElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave: (e: React.PointerEvent<HTMLElement>) => void;
} {
  const isSecondContainer = (
    dr: DragStateTwo<P, Q> | DragStateThree<P, Q, R>
  ): dr is DragStateThree<P, Q, R> => {
    return which === "secondContainer";
  };
  const targetIdentifier = isSecondContainer(dragState)
    ? dragState.target2.identifier
    : dragState.target1.identifier;
  const targetEnter =
    which === "secondContainer" ? "target2Enter" : "target1Enter";
  const targetLeave =
    which === "secondContainer" ? "target2Leave" : "target1Leave";

  const enterRef = useRef<typeof targetIdentifier>(targetIdentifier);

  if (!dragState.isDragging) enterRef.current = initialValue(targetIdentifier);

  const onDragOver = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const shouldChange =
      dragState.isDragging && enterRef.current !== identifier;

    if (shouldChange) {
      enterRef.current = identifier;
      const dispatchObj = {
        type: targetEnter,
        payload: { identifier, index },
      } as DispatchDragObjectTwo<P, Q>;
      dispatchDragState(dispatchObj);
    }
  };

  const onDragLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const shouldDispatch =
      !isInitialValue(identifier) &&
      e.relatedTarget &&
      (e.relatedTarget as Node).nodeName !== undefined &&
      !e.currentTarget.contains(e.relatedTarget as Node);

    if (shouldDispatch) {
      enterRef.current = initialValue(enterRef.current);
      const dispatchObj = {
        type: targetLeave,
        payload: { identifier: enterRef.current, index: NaN },
      } as DispatchDragObjectTwo<P, Q>;
      dispatchDragState(dispatchObj);
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") {
      onDragOver(e as unknown as React.DragEvent<HTMLElement>);
    }
  };

  const onPointerLeave = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") {
      onDragLeave(e as unknown as React.DragEvent<HTMLElement>);
    }
  };

  return { onDragOver, onDragLeave, onPointerMove, onPointerLeave };
}

export function useDragItem<
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
  sourceDragProps: {
    draggable: boolean;
    onDragStart: (e: React.DragEvent<HTMLElement>) => void;
    onDrag: (e: React.DragEvent<HTMLElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLElement>) => void;
    onDragEnd: (e: React.DragEvent<HTMLElement>) => void;
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
    onTouchStart: (e: React.TouchEvent<HTMLElement>) => void;
    onPointerMoveCapture: (e: React.PointerEvent<HTMLElement>) => void;
    onTouchEnd: (e: React.TouchEvent<HTMLElement>) => void;
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
  };
  elementRef: React.RefObject<HTMLElement>;
} {
  const elementRef = useRef<HTMLElement>(null);
  const timeout = useRef<number | null>(null);
  const initialOffset = useRef<{ x: number; y: number } | null>(null);

  const onDragStart = (e: React.DragEvent<HTMLElement>) => {
    if (e.dataTransfer) {
      const img = document.createElement("img");
      img.src =
        "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
      e.dataTransfer.setDragImage(img, 0, 0);
      e.dataTransfer.dropEffect = "copy";
    }
    if (e.type === "pointerdown") {
      document.addEventListener("pointermove", pointerMove);
      document.addEventListener("pointerup", removeEvents);
    }

    setTimeout(() => {
      const dragEl =
        ref !== undefined && !!ref.current
          ? ref.current
          : !!elementRef.current
          ? elementRef.current
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

  function pointerMove(e: PointerEvent) {
    const el = document.getElementById("clone");
    if (initialOffset.current && el) {
      e.preventDefault();
      if (e.pageY - initialOffset.current.y > 0)
        el.style.top = `${e.pageY - initialOffset.current.y}px`;
      if (e.pageX - initialOffset.current.x > 0)
        el.style.left = `${e.pageX - initialOffset.current.x}px`;
    }
  }

  function removeEvents(this: Document) {
    this.removeEventListener("pointerup", removeEvents);
    this.removeEventListener("pointermove", pointerMove);
  }

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
        ref !== undefined && !!ref.current
          ? ref.current
          : !!elementRef.current
          ? elementRef.current
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
    document.removeEventListener("pointermove", pointerMove);

    moveItem(dragState as any, identifier);
    setTimeout(() => {
      document.getElementById("clone")?.remove();
    }, delayMS);
    dispatchDragState({
      type: "drop",
    });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch" && !timeout.current) {
      timeout.current = setTimeout(() => {
        // e.preventDefault();
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        timeout.current = null;

        onDragStart(e as unknown as React.DragEvent<HTMLElement>);
      }, 500);
    }
  };

  const onTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    // e.preventDefault();
  };

  const onPointerMoveCapture = (e: React.PointerEvent<HTMLElement>) => {
    if (
      !dragState.isDragging &&
      timeout.current &&
      (e.movementX > 4 || e.movementY > 4)
    ) {
      clearTimeout(timeout.current);
      timeout.current = null;
      (e.target as HTMLElement).style.touchAction = "auto";
    }
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

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (dragState.isDragging) {
      onDragOver(e as unknown as React.DragEvent<HTMLElement>);
    }
  };

  return {
    sourceDragProps: {
      draggable: true,
      onDragStart,
      onDrag,
      onDragOver,
      onDragEnd,
      onPointerDown,
      onTouchStart,
      onPointerMoveCapture,
      onTouchEnd,
      onPointerMove,
    },
    elementRef,
  };
}

type NoS = number | string;

type ElementObject = {
  element: HTMLElement;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
};

type DragObjIdentifier<T extends NoS> = {
  identifier: T;
  index: number;
};

type DragObjIdentifierWithPos<T extends NoS> = {
  position: "before" | "after" | "";
} & DragObjIdentifier<T>;

export type DragStateOne<P extends NoS> = {
  sourceItem: DragObjIdentifier<P>;
  targetItem: DragObjIdentifierWithPos<P>;
  lastTargetItem: DragObjIdentifierWithPos<P>;
  element: ElementObject;
  isDragging: boolean;
  droppedItem?: { el: HTMLElement; identifier: P };
};

export interface DragStateTwo<P extends NoS, Q extends NoS>
  extends DragStateOne<P> {
  target1: DragObjIdentifier<Q>;
  lastTarget1: DragObjIdentifier<Q>;
}

export interface DragStateThree<P extends NoS, Q extends NoS, R extends NoS>
  extends DragStateTwo<P, Q> {
  target2: DragObjIdentifier<R>;
  lastTarget2: DragObjIdentifier<R>;
}

export type DragState<
  P extends "number" | "string",
  Q extends "number" | "string" | undefined,
  R extends "number" | "string" | undefined
> = Q extends "number" | "string"
  ? R extends "number" | "string"
    ? DragStateThree<
        P extends "number" ? number : string,
        Q extends "number" ? number : string,
        R extends "number" ? number : string
      >
    : DragStateTwo<
        P extends "number" ? number : string,
        Q extends "number" ? number : string
      >
  : DragStateOne<P extends "number" ? number : string>;

type DragActionsTwo = "target1Enter" | "target1Leave";

type DragActionsThree = "target2Enter" | "target2Leave";

interface PayloadSource<P extends NoS> {
  identifier: P;
  index: number;
  element: ElementObject;
}

interface PayloadTarget<P extends NoS> {
  identifier: P;
  index: number;
  position: "before" | "after";
}

interface PayloadContainer<Q extends NoS> {
  identifier: Q;
  index: number;
}

interface DispatchDragObjectDrop {
  type: "drop";
}

interface DispatchDragObjectSource<P extends NoS> {
  type: "sourceItem";
  payload: PayloadSource<P>;
}

function isSourceDispatchObj<P extends NoS, Q extends NoS, R extends NoS>(
  obj:
    | DispatchDragObjectOne<P>
    | DispatchDragObjectTwo<P, Q>
    | DispatchDragObjectThree<P, Q, R>
): obj is DispatchDragObjectSource<P> {
  return obj.type === "sourceItem";
}

interface DispatchDragObjectTarget<P extends NoS> {
  type: "overItem";
  payload: PayloadTarget<P>;
}

function isTargetDispatchObj<P extends NoS, Q extends NoS, R extends NoS>(
  obj:
    | DispatchDragObjectOne<P>
    | DispatchDragObjectTwo<P, Q>
    | DispatchDragObjectThree<P, Q, R>
): obj is DispatchDragObjectTarget<P> {
  return obj.type === "overItem";
}

export interface DispatchDragObjectOneContainer<P extends NoS> {
  type: DragActionsTwo;
  payload: PayloadContainer<P>;
}

function isOneContainerDispatchObj<P extends NoS, Q extends NoS, R extends NoS>(
  obj:
    | DispatchDragObjectOne<P>
    | DispatchDragObjectTwo<P, Q>
    | DispatchDragObjectThree<P, Q, R>
): obj is DispatchDragObjectOneContainer<Q> {
  return obj.type === "target1Enter" || obj.type === "target1Leave";
}

type DispatchDragObjectTwoContainers<
  P extends NoS,
  Q extends NoS,
  R extends DragActionsTwo | DragActionsThree
> = R extends DragActionsTwo
  ? DispatchDragObjectOneContainer<P>
  : {
      type: DragActionsThree;
      payload: PayloadContainer<Q>;
    };

function isTwoContainersDispatchObj<
  P extends NoS,
  Q extends NoS,
  R extends NoS
>(
  obj:
    | DispatchDragObjectOne<P>
    | DispatchDragObjectTwo<P, Q>
    | DispatchDragObjectThree<P, Q, R>
): obj is DispatchDragObjectTwoContainers<
  Q,
  R,
  DragActionsTwo | DragActionsThree
> {
  return obj.type === "target2Enter" || obj.type === "target2Leave";
}

export type DispatchDragObjectOne<P extends NoS> =
  | DispatchDragObjectDrop
  | DispatchDragObjectSource<P>
  | DispatchDragObjectTarget<P>;

export type DispatchDragObjectTwo<P extends NoS, Q extends NoS> =
  | DispatchDragObjectDrop
  | DispatchDragObjectSource<P>
  | DispatchDragObjectTarget<P>
  | DispatchDragObjectOneContainer<Q>;

export type DispatchDragObjectThree<
  P extends NoS,
  Q extends NoS,
  R extends NoS
> =
  | DispatchDragObjectDrop
  | DispatchDragObjectSource<P>
  | DispatchDragObjectTarget<P>
  | DispatchDragObjectOneContainer<Q>
  | DispatchDragObjectTwoContainers<Q, R, DragActionsTwo | DragActionsThree>;

const emptyElement: ElementObject = {
  element: document.createElement("span"),
  x: 0,
  y: 0,
  offsetX: 0,
  offsetY: 0,
};

const defaultParam = <T extends NoS>(n: T): T => {
  return (typeof n === "number" ? NaN : ("" as string)) as T;
};

const defaultParamFromTypeName = <T extends "number" | "string">(
  n: T
): T extends "number" ? number : string => {
  return (
    n === "number" ? defaultParam(1) : defaultParam("")
  ) as T extends "number" ? number : string;
};

export const initialDragState = <
  P extends "number" | "string",
  Q extends "number" | "string" | undefined,
  R extends "number" | "string" | undefined
>(
  l: P,
  m?: Q,
  n?: R
): DragState<P, Q, R> => {
  const initialL = defaultParamFromTypeName(l);
  if (m === undefined && n === undefined) {
    const initialState: DragStateOne<typeof initialL> = {
      sourceItem: {
        identifier: initialL,
        index: NaN,
      },
      targetItem: {
        identifier: initialL,
        index: NaN,
        position: "",
      },
      lastTargetItem: {
        identifier: initialL,
        index: NaN,
        position: "",
      },
      element: emptyElement,
      isDragging: false,
    };
    return initialState as DragState<P, Q, R>;
  }
  if (m && n === undefined) {
    const initialM = defaultParamFromTypeName(m);
    const initialState: DragState<P, Q, R> = {
      ...initialDragState(l),
      target1: {
        identifier: initialM,
        index: NaN,
      },
      lastTarget1: {
        identifier: initialM,
        index: NaN,
      },
    };
    return initialState;
  }
  const initialN = defaultParamFromTypeName(n!);
  const initialState: DragState<P, Q, R> = {
    ...initialDragState(l, m),
    target2: {
      identifier: initialN,
      index: NaN,
    },
    lastTarget2: {
      identifier: initialN,
      index: NaN,
    },
  };
  return initialState;
};

const initialValue = <T extends NoS>(value: T): T => {
  return typeof value === "number" ? (NaN as T) : ("" as T);
};

const isInitialValue = <T extends NoS>(value: T): boolean => {
  return value === initialValue(value);
};
