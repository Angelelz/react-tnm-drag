// import { useRef } from "react";
// import { initialValue } from "../helpers/helpers";
// import {
//   DispatchDragObjectThree,
//   DispatchDragObjectTwo,
//   DragStateThree,
//   DragStateTwo,
//   NoS,
// } from "../types/types";

// function useDragContainer<
//   T extends "oneContainer" | "firstContainer" | "secondContainer",
//   P extends NoS,
//   Q extends NoS,
//   R extends NoS
// >(
//   which: T,
//   dragState: T extends "oneContainer"
//     ? DragStateTwo<P, Q>
//     : DragStateThree<P, Q, R>,
//   dispatchDragState: React.Dispatch<
//     T extends "oneContainer"
//       ? DispatchDragObjectTwo<P, Q>
//       : DispatchDragObjectThree<P, Q, R>
//   >,
//   identifier: T extends "secondContainer" ? R : Q,
//   index: number
// ): {
//   onDragOver: (e: React.MouseEvent<HTMLElement>) => void;
//   onDragLeave: (e: React.MouseEvent<HTMLElement>) => void;
//   onPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
//   onPointerLeave: (e: React.PointerEvent<HTMLElement>) => void;
// } {
//   const isSecondContainer = (
//     dr: DragStateTwo<P, Q> | DragStateThree<P, Q, R>
//   ): dr is DragStateThree<P, Q, R> => {
//     return which === "secondContainer";
//   };
//   const targetIdentifier = isSecondContainer(dragState)
//     ? dragState.target2.identifier
//     : dragState.target1.identifier;
//   const targetEnter =
//     which === "secondContainer" ? "target2Enter" : "target1Enter";
//   const targetLeave =
//     which === "secondContainer" ? "target2Leave" : "target1Leave";

//   const enterRef = useRef<typeof targetIdentifier>(targetIdentifier);

//   if (!dragState.isDragging) enterRef.current = initialValue(targetIdentifier);

//   const onDragOver = (e: React.MouseEvent<HTMLElement>) => {
//     e.preventDefault();
//     const shouldChange =
//       dragState.isDragging && enterRef.current !== identifier;

//     if (shouldChange) {
//       enterRef.current = identifier;
//       const dispatchObj = {
//         type: targetEnter,
//         payload: { identifier, index },
//       } as DispatchDragObjectTwo<P, Q>;
//       dispatchDragState(dispatchObj);
//     }
//   };

//   const onDragLeave = (e: React.MouseEvent<HTMLElement>) => {
//     e.preventDefault();
//     const shouldDispatch =
//       !initialValue(identifier) &&
//       e.relatedTarget &&
//       (e.relatedTarget as Node).nodeName !== undefined &&
//       !e.currentTarget.contains(e.relatedTarget as Node);

//     if (shouldDispatch) {
//       enterRef.current = initialValue(enterRef.current);
//       const dispatchObj = {
//         type: targetLeave,
//         payload: { identifier: enterRef.current, index: NaN },
//       } as DispatchDragObjectTwo<P, Q>;
//       dispatchDragState(dispatchObj);
//     }
//   };

//   const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
//     if (e.pointerType === "touch") {
//       onDragOver(e as unknown as React.DragEvent<HTMLElement>);
//     }
//   };

//   const onPointerLeave = (e: React.PointerEvent<HTMLElement>) => {
//     if (e.pointerType === "touch") {
//       onDragLeave(e as unknown as React.DragEvent<HTMLElement>);
//     }
//   };

//   return { onDragOver, onDragLeave, onPointerMove, onPointerLeave };
// }

// export default useDragContainer;