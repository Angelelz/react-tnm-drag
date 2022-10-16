import { Direction, DispatchDragObject, DragOptions, DragProps, DragState, ElementCallback, NoS } from "../types/types";
declare const createDragElementHook: (dragState: DragState<DragOptions>, dragDispatch: React.Dispatch<DispatchDragObject<DragOptions>>) => <T extends NoS>(identifier: T, index: number, rearrangeCallback: ElementCallback, direction?: Direction, delayMS?: number, ref?: React.RefObject<HTMLElement>) => DragProps;
export default createDragElementHook;
//# sourceMappingURL=use-drag-element.d.ts.map