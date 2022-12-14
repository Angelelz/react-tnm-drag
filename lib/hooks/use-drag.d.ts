import React from "react";
import { DispatchDragObjectOne, DispatchDragObjectThree, DispatchDragObjectTwo, DragStateOne, DragStateThree, DragStateTwo, NoS } from "../types/types";
declare function useDrag<T extends DragStateOne<NoS> | DragStateTwo<NoS, NoS> | DragStateThree<NoS, NoS, NoS>>(dragState: T, dispatchDragState: T extends DragStateOne<infer P> ? React.Dispatch<DispatchDragObjectOne<P>> : T extends DragStateTwo<infer P, infer Q> ? React.Dispatch<DispatchDragObjectTwo<P, Q>> : T extends DragStateThree<infer P, infer Q, infer R> ? React.Dispatch<DispatchDragObjectThree<P, Q, R>> : never, identifier: T extends DragStateOne<infer P> ? P : T extends DragStateTwo<NoS, infer Q> ? Q : T extends DragStateThree<NoS, NoS, infer R> ? R : never, index: number, moveItem: T extends DragStateOne<infer P> ? (DS: DragStateOne<P>, identifier: P) => void : T extends DragStateTwo<infer P, NoS> ? (DS: DragStateTwo<P, NoS>, identifier: P) => void : T extends DragStateThree<infer P, NoS, NoS> ? (DS: DragStateThree<P, NoS, NoS>, identifier: P) => void : never, direction?: "vertical" | "horizontal", delayMS?: number, ref?: React.RefObject<HTMLElement>): {
    draggable: boolean;
    onDragStart: (e: React.DragEvent<HTMLElement>) => void;
    onDrag: (e: React.DragEvent<HTMLElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLElement>) => void;
    onDragEnd: (e: React.DragEvent<HTMLElement>) => void;
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
    onPointerUp: (e: React.PointerEvent<HTMLElement>) => void;
    onTouchEnd: (e: React.TouchEvent<HTMLElement>) => void;
    ref: React.RefObject<HTMLElement>;
};
export default useDrag;
//# sourceMappingURL=use-drag.d.ts.map