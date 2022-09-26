export type NoS = number | string;

export type ElementObject = {
  element: HTMLElement;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
};

export type DragObjIdentifier<T extends NoS> = {
  identifier: T;
  index: number;
};

export type DragObjIdentifierWithPos<T extends NoS> = {
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

export type DragActionsTwo = "target1Enter" | "target1Leave";

export type DragActionsThree = "target2Enter" | "target2Leave";

export interface PayloadSource<P extends NoS> {
  identifier: P;
  index: number;
  element: ElementObject;
}

export interface PayloadTarget<P extends NoS> {
  identifier: P;
  index: number;
  position: "before" | "after";
}

export interface PayloadContainer<Q extends NoS> {
  identifier: Q;
  index: number;
}

export interface DispatchDragObjectDrop {
  type: "drop";
}

export interface DispatchDragObjectSource<P extends NoS> {
  type: "sourceItem";
  payload: PayloadSource<P>;
}

export interface DispatchDragObjectTarget<P extends NoS> {
  type: "overItem";
  payload: PayloadTarget<P>;
}

export interface DispatchDragObjectOneContainer<P extends NoS> {
  type: DragActionsTwo;
  payload: PayloadContainer<P>;
}

export type DispatchDragObjectTwoContainers<
  P extends NoS,
  Q extends NoS,
  R extends DragActionsTwo | DragActionsThree
> = R extends DragActionsTwo
  ? DispatchDragObjectOneContainer<P>
  : {
      type: DragActionsThree;
      payload: PayloadContainer<Q>;
    };

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
