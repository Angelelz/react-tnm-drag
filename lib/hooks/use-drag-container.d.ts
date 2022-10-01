/// <reference types="react" />
import { DispatchDragObjectThree, DispatchDragObjectTwo, DragStateThree, DragStateTwo, NoS } from "../types/types";
declare function useDragContainer<T extends "oneContainer" | "firstContainer" | "secondContainer", P extends NoS, Q extends NoS, R extends NoS>(which: T, dragState: T extends "oneContainer" ? DragStateTwo<P, Q> : DragStateThree<P, Q, R>, dispatchDragState: React.Dispatch<T extends "oneContainer" ? DispatchDragObjectTwo<P, Q> : DispatchDragObjectThree<P, Q, R>>, identifier: T extends "secondContainer" ? R : Q, index: number): {
    onDragOver: (e: React.MouseEvent<HTMLElement>) => void;
    onDragLeave: (e: React.MouseEvent<HTMLElement>) => void;
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
    onPointerLeave: (e: React.PointerEvent<HTMLElement>) => void;
};
export default useDragContainer;
//# sourceMappingURL=use-drag-container.d.ts.map