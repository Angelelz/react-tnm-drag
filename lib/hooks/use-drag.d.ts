import { DragOptions } from "../types/types";
declare function useAnotherDrag<El>(options: DragOptions<El>): {
    dragState: import("../types/types").DragStateOneContainer<import("../types/types").NoS, import("../types/types").NoS> | import("../types/types").DragStateTwoContainers<import("../types/types").NoS, import("../types/types").NoS, import("../types/types").NoS> | import("../types/types").DragStateSimple<import("../types/types").NoS>;
    dragDispatch: (dragObject: import("../types/types").DispatchDragObjectDrop | import("../types/types").DispatchDragObjectPrimaryContainerLeave | import("../types/types").DispatchDragObjectSource<import("../types/types").NoS> | import("../types/types").DispatchDragObjectTarget<import("../types/types").NoS> | import("../types/types").DispatchDragObjectPrimaryContainerEnter<import("../types/types").NoS> | import("../types/types").DispatchDragObjectSecondaryContainerLeave | import("../types/types").DispatchDragObjectSecondaryContainerEnter<import("../types/types").NoS>) => void;
    useDragElement: import("../types/types").DragElementHook;
};
export default useAnotherDrag;
//# sourceMappingURL=use-drag.d.ts.map