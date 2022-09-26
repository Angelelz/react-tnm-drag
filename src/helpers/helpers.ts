import {
  DispatchDragObjectOne,
  DispatchDragObjectOneContainer,
  DispatchDragObjectSource,
  DispatchDragObjectTarget,
  DispatchDragObjectThree,
  DispatchDragObjectTwo,
  DispatchDragObjectTwoContainers,
  DragActionsThree,
  DragActionsTwo,
  DragState,
  DragStateOne,
  ElementObject,
  NoS,
} from "../types/types";

export function isSourceDispatchObj<
  P extends NoS,
  Q extends NoS,
  R extends NoS
>(
  obj:
    | DispatchDragObjectOne<P>
    | DispatchDragObjectTwo<P, Q>
    | DispatchDragObjectThree<P, Q, R>
): obj is DispatchDragObjectSource<P> {
  return obj.type === "sourceItem";
}

export function isTargetDispatchObj<
  P extends NoS,
  Q extends NoS,
  R extends NoS
>(
  obj:
    | DispatchDragObjectOne<P>
    | DispatchDragObjectTwo<P, Q>
    | DispatchDragObjectThree<P, Q, R>
): obj is DispatchDragObjectTarget<P> {
  return obj.type === "overItem";
}

export function isOneContainerDispatchObj<
  P extends NoS,
  Q extends NoS,
  R extends NoS
>(
  obj:
    | DispatchDragObjectOne<P>
    | DispatchDragObjectTwo<P, Q>
    | DispatchDragObjectThree<P, Q, R>
): obj is DispatchDragObjectOneContainer<Q> {
  return obj.type === "target1Enter" || obj.type === "target1Leave";
}

export function isTwoContainersDispatchObj<
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

export const emptyElement: ElementObject = {
  element: document.createElement("span"),
  x: 0,
  y: 0,
  offsetX: 0,
  offsetY: 0,
};

export const defaultParam = <T extends NoS>(n: T): T => {
  return (typeof n === "number" ? NaN : ("" as string)) as T;
};

export const defaultParamFromTypeName = <T extends "number" | "string">(
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

export const initialValue = <T extends NoS>(value: T): T => {
  return typeof value === "number" ? (NaN as T) : ("" as T);
};

export const isInitialValue = <T extends NoS>(value: T): boolean => {
  return value === initialValue(value);
};
