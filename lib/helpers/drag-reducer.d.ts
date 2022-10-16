import { DispatchDragObject, DragOptions, DragState, DragStateOneContainer, DragStateTwoContainers, NoS } from "../types/types";
declare const dragReducer: <El>(options: DragOptions<El>) => (dragState: DragStateOneContainer<NoS, NoS> | DragStateTwoContainers<NoS, NoS, NoS> | import("../types/types").DragStateSimple<NoS>, dragObject: import("../types/types").DispatchDragObjectDrop | import("../types/types").DispatchDragObjectPrimaryContainerLeave | import("../types/types").DispatchDragObjectSecondaryContainerLeave | import("../types/types").DispatchDragObjectSource<NoS> | import("../types/types").DispatchDragObjectTarget<NoS> | import("../types/types").DispatchDragObjectPrimaryContainerEnter<NoS> | import("../types/types").DispatchDragObjectSecondaryContainerEnter<NoS>) => DragStateOneContainer<NoS, NoS> | DragStateTwoContainers<NoS, NoS, NoS> | import("../types/types").DragStateSimple<NoS>;
export default dragReducer;
//# sourceMappingURL=drag-reducer.d.ts.map