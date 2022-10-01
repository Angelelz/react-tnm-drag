/// <reference types="react" />
import { DispatchDragObjectOne, DispatchDragObjectThree, DispatchDragObjectTwo, DragStateOne, DragStateThree } from "../types/types";
declare function useDragReducer<P extends "number" | "string">(sourceType: P): {
    dragState: DragStateOne<P extends "number" ? number : string>;
    dragDispatch: React.Dispatch<DispatchDragObjectOne<P extends "number" ? number : string>>;
};
declare function useDragReducer<P extends "number" | "string", Q extends "number" | "string">(sourceType: P, firstContainerType: Q): {
    dragState: DragStateOne<P extends "number" ? number : string>;
    dragDispatch: React.Dispatch<DispatchDragObjectTwo<P extends "number" ? number : string, Q extends "number" ? number : string>>;
};
declare function useDragReducer<P extends "number" | "string", Q extends "number" | "string", R extends "number" | "string">(sourceType: P, firstContainerType: Q, secondContainerType: R): {
    dragState: DragStateThree<P extends "number" ? number : string, Q extends "number" ? number : string, R extends "number" ? number : string>;
    dragDispatch: React.Dispatch<DispatchDragObjectThree<P extends "number" ? number : string, Q extends "number" ? number : string, R extends "number" ? number : string>>;
};
export default useDragReducer;
//# sourceMappingURL=use-drag-reducer.d.ts.map