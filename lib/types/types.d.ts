/// <reference types="react" />
import useAnimationSync from "../hooks/use-animation-sync";
import useAnotherDrag from "../hooks/use-drag";
export declare type NoS = number | string;
export declare type Direction = "vertical" | "horizontal";
export declare type ElementObject = {
    element: HTMLElement;
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
};
export declare type DragObjIdentifier<T extends NoS> = {
    id: T | null;
    index: number | null;
};
export declare type DragStateSimple<P extends NoS> = {
    sourceItem: DragObjIdentifier<P>;
    targetItem: DragObjIdentifier<P>;
    lastTargetItem: DragObjIdentifier<P>;
    element: ElementObject;
    isDragging: boolean;
    droppedItem?: {
        el: HTMLElement;
        id: P;
    };
};
export interface DragStateOneContainer<P extends NoS, Q extends NoS> extends DragStateSimple<P> {
    containerNumber: 1;
    primaryContainer: DragObjIdentifier<Q>;
    lastPrimaryContainer: DragObjIdentifier<Q>;
}
export interface DragStateTwoContainers<P extends NoS, Q extends NoS, R extends NoS> extends Omit<DragStateOneContainer<P, Q>, "containerNumber"> {
    containerNumber: 2;
    secondaryContainer: DragObjIdentifier<R>;
    lastSecondaryContainer: DragObjIdentifier<R>;
}
export declare type DragState<T extends DragOptions<any>> = T extends DragOptionsOneContainer<any> ? DragStateOneContainer<NoS, NoS> : T extends DragOptionsTwoContainers<any> ? DragStateTwoContainers<NoS, NoS, NoS> : T extends DragOptionsNoContainer<any> ? DragStateSimple<NoS> : never;
export declare type DragActionPrimaryContainerEnter = "primaryContainerEnter";
export declare type DragActionPrimaryContainerLeave = "primaryContainerLeave";
export declare type DragActionSecondaryContainerEnter = "secondaryContainerEnter";
export declare type DragActionSecondaryContainerLeave = "secondaryContainerLeave";
export declare type DragActionsThree = "secondaryContainerEnter" | "secondaryContainerLeave";
export interface PayloadSource<P extends NoS> {
    id: P;
    index: number;
    element: ElementObject;
}
export interface PayloadTarget<P extends NoS> {
    id: P;
    index: number;
    newSourceIndex: number;
}
export interface PayloadContainer<Q extends NoS> {
    id: Q;
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
export interface DispatchDragObjectPrimaryContainerEnter<P extends NoS> {
    type: DragActionPrimaryContainerEnter;
    payload: PayloadContainer<P>;
}
export interface DispatchDragObjectSecondaryContainerEnter<P extends NoS> {
    type: DragActionSecondaryContainerEnter;
    payload: PayloadContainer<P>;
}
export interface DispatchDragObjectPrimaryContainerLeave {
    type: DragActionPrimaryContainerLeave;
}
export interface DispatchDragObjectSecondaryContainerLeave {
    type: DragActionSecondaryContainerLeave;
}
export declare type DispatchDragObjectPrimaryContainer<P extends NoS> = DispatchDragObjectPrimaryContainerEnter<P> | DispatchDragObjectPrimaryContainerLeave;
export declare type DispatchDragObjectSecondaryContainer<P extends NoS> = DispatchDragObjectSecondaryContainerEnter<P> | DispatchDragObjectSecondaryContainerLeave;
export declare type DispatchDragObjectSimple<P extends NoS> = DispatchDragObjectDrop | DispatchDragObjectSource<P> | DispatchDragObjectTarget<P>;
export declare type DispatchDragObjectOneContainer<P extends NoS, Q extends NoS> = DispatchDragObjectSimple<P> | DispatchDragObjectPrimaryContainer<Q>;
export declare type DispatchDragObjectTwoContainers<P extends NoS, Q extends NoS, R extends NoS> = DispatchDragObjectOneContainer<P, Q> | DispatchDragObjectSecondaryContainer<R>;
export declare type DispatchDragObject<T extends DragOptions<any>> = T extends DragOptionsOneContainer<any> ? DispatchDragObjectOneContainer<NoS, NoS> : T extends DragOptionsTwoContainers<any> ? DispatchDragObjectTwoContainers<NoS, NoS, NoS> : T extends DragOptionsNoContainer<any> ? DispatchDragObjectSimple<NoS> : never;
export interface DragStateLike<T extends NoS> {
    isDragging: boolean;
    targetItem: DragObjIdentifier<T>;
    sourceItem: DragObjIdentifier<T>;
    element: ElementObject;
}
export interface EventLike {
    pageX: number;
    pageY: number;
    clientX: number;
    clientY: number;
    screenX: number;
    screenY: number;
    target: EventTarget | null;
    nativeEvent?: {
        offsetX: number;
        offsetY: number;
    };
    type: string;
    preventDefault: () => void;
}
export declare type DragOptionsNoContainer<El> = {
    elementArray: El[];
};
export declare type DragOptionsOneContainer<El> = DragOptionsNoContainer<El> & {
    containerNumber: 1;
};
export declare type DragOptionsTwoContainers<El> = DragOptionsNoContainer<El> & {
    containerNumber: 2;
};
export declare type DragOptions<El> = DragOptionsTwoContainers<El> | DragOptionsOneContainer<El> | DragOptionsNoContainer<El>;
export declare type DragElementHook = <T extends NoS, R extends HTMLElement>(id: T, index: number, arrayCallback: ArrayCallback<any>, direction?: Direction, delayMS?: number, ref?: React.RefObject<R>) => DragProps<R>;
export declare type DragProps<R extends HTMLElement> = {
    draggable: boolean;
    onDragStart: (e: React.DragEvent<HTMLElement>) => void;
    onDrag: (e: React.DragEvent<HTMLElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLElement>) => void;
    onDragEnd: (e: React.DragEvent<HTMLElement>) => void;
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
    onPointerUp: (e: React.PointerEvent<HTMLElement>) => void;
    onTouchEnd: (e: React.TouchEvent<HTMLElement>) => void;
    ref: React.RefObject<R>;
};
export declare type UseDrag = ReturnType<typeof useAnotherDrag>;
export declare type ArrayCallback<El> = (elementArray: El[]) => void;
export declare type InternalRef = {
    touchTimeout: number | null;
    scrollTimeout: number | null;
    mousePosition: MousePosition | null;
    pointerId: number | null;
    initialStyle: InitialStyle | null;
    index: number;
    id: NoS;
};
export declare type MousePosition = {
    x: number;
    y: number;
};
export declare type InitialStyle = {
    transition: string;
    translate: string;
    opacity: string;
};
export declare type ScheduledState = {
    timeout: number;
    sourceIndex: number;
    targetIndex: number;
};
export declare type GlobalDragStore = ReturnType<typeof useAnimationSync>;
//# sourceMappingURL=types.d.ts.map