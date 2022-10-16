import React from "react";
import { ArrayCallback, DispatchDragObject, DispatchDragObjectPrimaryContainer, DispatchDragObjectSecondaryContainer, DispatchDragObjectSource, DispatchDragObjectTarget, DragOptions, DragState, DragStateLike, DragStateOneContainer, DragStateSimple, DragStateTwoContainers, ElementObject, EventLike, InitialStyle, InternalRef, NoS } from "../types/types";
export declare function isSourceDispatchObj<P extends NoS>(objA: DispatchDragObject<any>): objA is DispatchDragObjectSource<P>;
export declare function isTargetDispatchObj<P extends NoS>(obj: DispatchDragObject<any>): obj is DispatchDragObjectTarget<P>;
export declare function isPrimaryContainerDispatchObj<P extends NoS, Q extends NoS>(obj: DispatchDragObject<any>): obj is DispatchDragObjectPrimaryContainer<Q>;
export declare function isSecondaryContainerDispatchObj<P extends NoS, Q extends NoS, R extends NoS>(obj: DispatchDragObject<any>): obj is DispatchDragObjectSecondaryContainer<R>;
export declare function isDragStateOneContainer(obj: DragState<any>): obj is DragStateOneContainer<NoS, NoS>;
export declare function isDragStateTwoContainers(obj: DragState<any>): obj is DragStateTwoContainers<NoS, NoS, NoS>;
export declare const emptyElement: ElementObject;
export declare const initialDragState: (options: DragOptions<any>) => DragStateOneContainer<NoS, NoS> | DragStateTwoContainers<NoS, NoS, NoS> | DragStateSimple<NoS>;
export declare const isTouchEv: (e: any) => e is React.TouchEvent<HTMLElement> | TouchEvent;
export declare const isReactEv: (e: any) => e is React.DragEvent<HTMLElement>;
export declare function removeAndAnimateClone(ms: number, ref?: React.RefObject<HTMLElement>): void;
export declare function draggingOver<T extends NoS, El>(dragState: DragStateLike<T>, workingRef: React.RefObject<HTMLElement>, e: EventLike, direction: "vertical" | "horizontal", identifier: T, dispatchDragState: React.Dispatch<DispatchDragObject<any>>, index: number, setArray: ArrayCallback<El>, array: El[], internalRef: InternalRef<El>, animationTimeout: React.MutableRefObject<number | null>): void;
export declare function followPointer(dragState: DragStateLike<NoS>, e: EventLike): void;
export declare function doScroll(mousePosition: {
    x: number;
    y: number;
} | null): void;
export declare function scroller(direction: "up" | "down" | "left" | "right"): void;
export declare function createCloneAndStartDrag<T extends NoS>(workingRef: React.RefObject<HTMLElement>, e: EventLike, direction: "vertical" | "horizontal", dispatchDragState: React.Dispatch<DispatchDragObject<any>>, identifier: T, index: number): void;
export declare function createEventLike(e: React.TouchEvent<HTMLElement> | React.DragEvent<HTMLElement> | React.PointerEvent<HTMLElement> | TouchEvent | PointerEvent): EventLike;
export declare function animateTranslateForward<R extends HTMLElement>(el: R, direction: string, ms: number): void;
export declare function animateTranslateBackwards<R extends HTMLElement>(el: R, direction: string, ms: number): void;
export declare function resetStyles<R extends HTMLElement>(el: R, initialStyle: InitialStyle): void;
export declare function getTotalHeight<R extends HTMLElement>(el: R): number;
export declare function getTotalWidth<R extends HTMLElement>(el: R): number;
//# sourceMappingURL=helpers.d.ts.map