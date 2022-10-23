import React from "react";
import { Direction, DragElementHook, NoS } from "../types/types";
declare const createDragElementHook: <El>(elementArray: El[], GlobalDragStore: {
    AnimationSync: {
        Animate: (source: number, target: number, direction: Direction, delay: number) => void;
        Register: <R extends HTMLElement>(index: number, element: React.RefObject<R>) => () => void;
        SetTimeout: (callback: () => void, delay: number) => void;
        SetTarget: (id: NoS, index: number) => void;
        IsDifferentTarget: (id: NoS, index: number) => boolean;
    };
    dragState: React.MutableRefObject<import("../types/types").DragStateOneContainer<NoS, NoS> | import("../types/types").DragStateTwoContainers<NoS, NoS, NoS> | import("../types/types").DragStateSimple<NoS>>;
    dragDispatch: (dragObject: import("../types/types").DispatchDragObjectDrop | import("../types/types").DispatchDragObjectPrimaryContainerLeave | import("../types/types").DispatchDragObjectSource<NoS> | import("../types/types").DispatchDragObjectTarget<NoS> | import("../types/types").DispatchDragObjectPrimaryContainerEnter<NoS> | import("../types/types").DispatchDragObjectSecondaryContainerLeave | import("../types/types").DispatchDragObjectSecondaryContainerEnter<NoS>) => void;
    reRender: () => void;
}) => DragElementHook;
export default createDragElementHook;
//# sourceMappingURL=createDragElementHook.d.ts.map