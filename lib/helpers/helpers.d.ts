import { DispatchDragObjectOne, DispatchDragObjectOneContainer, DispatchDragObjectSource, DispatchDragObjectTarget, DispatchDragObjectThree, DispatchDragObjectTwo, DispatchDragObjectTwoContainers, DragActionsThree, DragActionsTwo, DragState, ElementObject, NoS } from "../types/types";
export declare function isSourceDispatchObj<P extends NoS, Q extends NoS, R extends NoS>(obj: DispatchDragObjectOne<P> | DispatchDragObjectTwo<P, Q> | DispatchDragObjectThree<P, Q, R>): obj is DispatchDragObjectSource<P>;
export declare function isTargetDispatchObj<P extends NoS, Q extends NoS, R extends NoS>(obj: DispatchDragObjectOne<P> | DispatchDragObjectTwo<P, Q> | DispatchDragObjectThree<P, Q, R>): obj is DispatchDragObjectTarget<P>;
export declare function isOneContainerDispatchObj<P extends NoS, Q extends NoS, R extends NoS>(obj: DispatchDragObjectOne<P> | DispatchDragObjectTwo<P, Q> | DispatchDragObjectThree<P, Q, R>): obj is DispatchDragObjectOneContainer<Q>;
export declare function isTwoContainersDispatchObj<P extends NoS, Q extends NoS, R extends NoS>(obj: DispatchDragObjectOne<P> | DispatchDragObjectTwo<P, Q> | DispatchDragObjectThree<P, Q, R>): obj is DispatchDragObjectTwoContainers<Q, R, DragActionsTwo | DragActionsThree>;
export declare const emptyElement: ElementObject;
export declare const defaultParam: <T extends NoS>(n: T) => T;
export declare const defaultParamFromTypeName: <T extends "string" | "number">(n: T) => T extends "number" ? number : string;
export declare const initialDragState: <P extends "string" | "number", Q extends "string" | "number" | undefined, R extends "string" | "number" | undefined>(l: P, m?: Q | undefined, n?: R | undefined) => DragState<P, Q, R>;
export declare const initialValue: <T extends NoS>(value: T) => T;
export declare const isInitialValue: <T extends NoS>(value: T) => boolean;
//# sourceMappingURL=helpers.d.ts.map