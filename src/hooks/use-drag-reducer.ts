// import { useReducer } from "react";
// import {
//   DispatchDragObjectOne,
//   DispatchDragObjectThree,
//   DispatchDragObjectTwo,
//   DragState,
//   DragStateOne,
//   DragStateThree,
//   DragStateTwo,
// } from "../types/types";
// import {
//   defaultParamFromTypeName,
//   emptyElement,
//   initialDragState,
//   isOneContainerDispatchObj,
//   isSourceDispatchObj,
//   isTargetDispatchObj,
//   isTwoContainersDispatchObj,
// } from "../helpers/helpers";

// function useDragReducer<P extends "number" | "string">(
//   sourceType: P
// ): {
//   dragState: DragStateOne<P extends "number" ? number : string>;
//   dragDispatch: React.Dispatch<
//     DispatchDragObjectOne<P extends "number" ? number : string>
//   >;
// };
// function useDragReducer<
//   P extends "number" | "string",
//   Q extends "number" | "string"
// >(
//   sourceType: P,
//   firstContainerType: Q
// ): {
//   dragState: DragStateOne<P extends "number" ? number : string>;
//   dragDispatch: React.Dispatch<
//     DispatchDragObjectTwo<
//       P extends "number" ? number : string,
//       Q extends "number" ? number : string
//     >
//   >;
// };
// function useDragReducer<
//   P extends "number" | "string",
//   Q extends "number" | "string",
//   R extends "number" | "string"
// >(
//   sourceType: P,
//   firstContainerType: Q,
//   secondContainerType: R
// ): {
//   dragState: DragStateThree<
//     P extends "number" ? number : string,
//     Q extends "number" ? number : string,
//     R extends "number" ? number : string
//   >;
//   dragDispatch: React.Dispatch<
//     DispatchDragObjectThree<
//       P extends "number" ? number : string,
//       Q extends "number" ? number : string,
//       R extends "number" ? number : string
//     >
//   >;
// };
// function useDragReducer<
//   P extends "number" | "string",
//   Q extends "number" | "string" | undefined,
//   R extends "number" | "string" | undefined
// >(sourceType: P, firstContainerType?: Q, secondContainerType?: R) {
//   const dragReducer = (
//     dragState: DragState<P, Q, R>,
//     dragObject:
//       | DispatchDragObjectOne<P extends "number" ? number : string>
//       | DispatchDragObjectTwo<
//           P extends "number" ? number : string,
//           Q extends "number" ? number : string
//         >
//       | DispatchDragObjectThree<
//           P extends "number" ? number : string,
//           Q extends "number" ? number : string,
//           R extends "number" ? number : string
//         >
//   ): DragState<P, Q, R> => {
//     if (isSourceDispatchObj(dragObject)) {
//       return {
//         ...dragState,
//         droppedItem: { el: emptyElement, identifier: NaN },
//         sourceItem: {
//           identifier: dragObject.payload.identifier,
//           index: dragObject.payload.index,
//         },
//         element: dragObject.payload.element,
//         isDragging: true,
//       };
//     }
//     if (isTargetDispatchObj(dragObject)) {
//       return {
//         ...dragState,
//         lastTargetItem: dragState.targetItem,
//         targetItem: {
//           identifier: dragObject.payload.identifier,
//           index: dragObject.payload.index,
//           position: dragObject.payload.position,
//         },
//       };
//     }
//     if (isOneContainerDispatchObj(dragObject)) {
//       const draggState = dragState as DragStateTwo<
//         P extends "number" ? number : string,
//         Q extends "number" ? number : string
//       >;
//       switch (dragObject.type) {
//         case "target1Enter":
//           return {
//             ...dragState,
//             lastTarget1: draggState.target1,
//             target1: {
//               identifier: dragObject.payload.identifier,
//               index: dragObject.payload.index,
//             },
//           };
//         case "target1Leave":
//           return {
//             ...dragState,
//             lastTarget1: draggState.target1,
//             lastTargetItem: dragState.targetItem,
//             target1: {
//               identifier: defaultParamFromTypeName(firstContainerType!),
//               index: NaN,
//             },
//             targetItem: {
//               identifier: defaultParamFromTypeName(sourceType),
//               index: NaN,
//               position: undefined,
//             },
//           };
//       }
//     }
//     if (isTwoContainersDispatchObj(dragObject)) {
//       const draggState = dragState as DragStateThree<
//         P extends "number" ? number : string,
//         Q extends "number" ? number : string,
//         R extends "number" ? number : string
//       >;
//       switch (dragObject.type) {
//         case "target2Enter":
//           return {
//             ...dragState,
//             lastTarget2: draggState.target2,
//             target2: {
//               identifier: dragObject.payload.identifier,
//               index: dragObject.payload.index,
//             },
//           };
//         case "target2Leave":
//           return {
//             ...dragState,
//             lastTarget2: draggState.target2,
//             target2: {
//               identifier: defaultParamFromTypeName(secondContainerType!),
//               index: NaN,
//             },
//             targetItem: {
//               identifier: defaultParamFromTypeName(sourceType),
//               index: NaN,
//               position: undefined,
//             },
//           };
//       }
//     }
//     return dragObject.type === "drop"
//       ? {
//           ...initialDragState(sourceType, firstContainerType, secondContainerType),
//           droppedItem: {
//             el: document.getElementById("clone"),
//             identifier: dragState.sourceItem.identifier,
//           },
//         }
//       : initialDragState(sourceType, firstContainerType, secondContainerType);
//   };
//   const [dragState, dragDispatch] = useReducer(
//     dragReducer,
//     initialDragState(sourceType, firstContainerType, secondContainerType)
//   );
//   return {
//     dragState,
//     dragDispatch,
//   };
// }

// export default useDragReducer;