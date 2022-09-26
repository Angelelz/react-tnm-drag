import React from "react";
export declare function useDragReducer<P extends "number" | "string">(sourceType: P): {
    dragState: DragStateOne<P extends "number" ? number : string>;
    dragDispatch: React.Dispatch<DispatchDragObjectOne<P extends "number" ? number : string>>;
};
export declare function useDragReducer<P extends "number" | "string", Q extends "number" | "string">(sourceType: P, firstTargetType: Q): {
    dragState: DragStateOne<P extends "number" ? number : string>;
    dragDispatch: React.Dispatch<DispatchDragObjectTwo<P extends "number" ? number : string, Q extends "number" ? number : string>>;
};
export declare function useDragReducer<P extends "number" | "string", Q extends "number" | "string", R extends "number" | "string">(sourceType: P, firstTargetType: Q, secondTargetType: R): {
    dragState: DragStateThree<P extends "number" ? number : string, Q extends "number" ? number : string, R extends "number" ? number : string>;
    dragDispatch: React.Dispatch<DispatchDragObjectThree<P extends "number" ? number : string, Q extends "number" ? number : string, R extends "number" ? number : string>>;
};
export declare function useDragContainer<T extends "oneContainer" | "firstContainer" | "secondContainer", P extends NoS, Q extends NoS, R extends NoS>(which: T, dragState: T extends "oneContainer" ? DragStateTwo<P, Q> : DragStateThree<P, Q, R>, dispatchDragState: React.Dispatch<T extends "oneContainer" ? DispatchDragObjectTwo<P, Q> : DispatchDragObjectThree<P, Q, R>>, identifier: T extends "secondContainer" ? R : Q, index: number): {
    onDragOver: (e: React.MouseEvent<HTMLElement>) => void;
    onDragLeave: (e: React.MouseEvent<HTMLElement>) => void;
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
    onPointerLeave: (e: React.PointerEvent<HTMLElement>) => void;
};
export declare function useDragItem<T extends DragStateOne<NoS> | DragStateTwo<NoS, NoS> | DragStateThree<NoS, NoS, NoS>>(dragState: T, dispatchDragState: T extends DragStateOne<infer P> ? React.Dispatch<DispatchDragObjectOne<P>> : T extends DragStateTwo<infer P, infer Q> ? React.Dispatch<DispatchDragObjectTwo<P, Q>> : T extends DragStateThree<infer P, infer Q, infer R> ? React.Dispatch<DispatchDragObjectThree<P, Q, R>> : never, identifier: T extends DragStateOne<infer P> ? P : T extends DragStateTwo<NoS, infer Q> ? Q : T extends DragStateThree<NoS, NoS, infer R> ? R : never, index: number, moveItem: T extends DragStateOne<infer P> ? (DS: any, identifier: P) => void : T extends DragStateTwo<infer P, NoS> ? (DS: any, identifier: P) => void : T extends DragStateThree<infer P, NoS, NoS> ? (DS: any, identifier: P) => void : never, direction?: "vertical" | "horizontal", delayMS?: number, ref?: React.RefObject<HTMLElement>): {
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
};
declare type NoS = number | string;
declare type ElementObject = {
    element: HTMLElement;
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
};
declare type DragObjIdentifier<T extends NoS> = {
    identifier: T;
    index: number;
};
declare type DragObjIdentifierWithPos<T extends NoS> = {
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
declare type DragActionsTwo = "target1Enter" | "target1Leave";
declare type DragActionsThree = "target2Enter" | "target2Leave";
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
interface DispatchDragObjectTarget<P extends NoS> {
    type: "overItem";
    payload: PayloadTarget<P>;
}
export interface DispatchDragObjectOneContainer<P extends NoS> {
    type: DragActionsTwo;
    payload: PayloadContainer<P>;
}
declare type DispatchDragObjectTwoContainers<P extends NoS, Q extends NoS, R extends DragActionsTwo | DragActionsThree> = R extends DragActionsTwo ? DispatchDragObjectOneContainer<P> : {
    type: DragActionsThree;
    payload: PayloadContainer<Q>;
};
export declare type DispatchDragObjectOne<P extends NoS> = DispatchDragObjectDrop | DispatchDragObjectSource<P> | DispatchDragObjectTarget<P>;
export declare type DispatchDragObjectTwo<P extends NoS, Q extends NoS> = DispatchDragObjectDrop | DispatchDragObjectSource<P> | DispatchDragObjectTarget<P> | DispatchDragObjectOneContainer<Q>;
export declare type DispatchDragObjectThree<P extends NoS, Q extends NoS, R extends NoS> = DispatchDragObjectDrop | DispatchDragObjectSource<P> | DispatchDragObjectTarget<P> | DispatchDragObjectOneContainer<Q> | DispatchDragObjectTwoContainers<Q, R, DragActionsTwo | DragActionsThree>;
export declare const initialDragState: <P extends "string" | "number", Q extends "string" | "number" | undefined, R extends "string" | "number" | undefined>(l: P, m?: Q | undefined, n?: R | undefined) => DragState<P, Q, R>;
export {};
//# sourceMappingURL=index.d.ts.map