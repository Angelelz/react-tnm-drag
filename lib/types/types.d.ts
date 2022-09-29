export declare type NoS = number | string;
export declare type ElementObject = {
    element: HTMLElement;
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
};
export declare type DragObjIdentifier<T extends NoS> = {
    identifier: T;
    index: number;
};
export declare type DragObjIdentifierWithPos<T extends NoS> = {
    position: "before" | "after" | "";
} & DragObjIdentifier<T>;
export declare type DragStateOne<P extends NoS> = {
    sourceItem: DragObjIdentifier<P>;
    targetItem: DragObjIdentifierWithPos<P>;
    lastTargetItem: DragObjIdentifierWithPos<P>;
    element: ElementObject;
    isDragging: boolean;
    droppedItem?: {
        el: HTMLElement;
        identifier: P;
    };
};
export interface DragStateTwo<P extends NoS, Q extends NoS> extends DragStateOne<P> {
    target1: DragObjIdentifier<Q>;
    lastTarget1: DragObjIdentifier<Q>;
}
export interface DragStateThree<P extends NoS, Q extends NoS, R extends NoS> extends DragStateTwo<P, Q> {
    target2: DragObjIdentifier<R>;
    lastTarget2: DragObjIdentifier<R>;
}
export declare type DragState<P extends "number" | "string", Q extends "number" | "string" | undefined, R extends "number" | "string" | undefined> = Q extends "number" | "string" ? R extends "number" | "string" ? DragStateThree<P extends "number" ? number : string, Q extends "number" ? number : string, R extends "number" ? number : string> : DragStateTwo<P extends "number" ? number : string, Q extends "number" ? number : string> : DragStateOne<P extends "number" ? number : string>;
export declare type DragActionsTwo = "target1Enter" | "target1Leave";
export declare type DragActionsThree = "target2Enter" | "target2Leave";
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
export declare type DispatchDragObjectTwoContainers<P extends NoS, Q extends NoS, R extends DragActionsTwo | DragActionsThree> = R extends DragActionsTwo ? DispatchDragObjectOneContainer<P> : {
    type: DragActionsThree;
    payload: PayloadContainer<Q>;
};
export declare type DispatchDragObjectOne<P extends NoS> = DispatchDragObjectDrop | DispatchDragObjectSource<P> | DispatchDragObjectTarget<P>;
export declare type DispatchDragObjectTwo<P extends NoS, Q extends NoS> = DispatchDragObjectDrop | DispatchDragObjectSource<P> | DispatchDragObjectTarget<P> | DispatchDragObjectOneContainer<Q>;
export declare type DispatchDragObjectThree<P extends NoS, Q extends NoS, R extends NoS> = DispatchDragObjectDrop | DispatchDragObjectSource<P> | DispatchDragObjectTarget<P> | DispatchDragObjectOneContainer<Q> | DispatchDragObjectTwoContainers<Q, R, DragActionsTwo | DragActionsThree>;
export interface DragStateLike<T extends NoS> {
    isDragging: boolean;
    targetItem: DragObjIdentifierWithPos<T>;
    element: ElementObject;
}
export interface EventLike {
    pageX: number;
    pageY: number;
    clientX: number;
    clientY: number;
    target: EventTarget | null;
    nativeEvent?: {
        offsetX: number;
        offsetY: number;
    };
    type: string;
    preventDefault: () => void;
}
//# sourceMappingURL=types.d.ts.map