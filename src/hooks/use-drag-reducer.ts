import { useReducer } from "react";
import {
  DispatchDragObjectOne,
  DispatchDragObjectThree,
  DispatchDragObjectTwo,
  DragState,
  DragStateOne,
  DragStateThree,
  DragStateTwo,
} from "../types/types";
import {
  defaultParamFromTypeName,
  emptyElement,
  initialDragState,
  isOneContainerDispatchObj,
  isSourceDispatchObj,
  isTargetDispatchObj,
  isTwoContainersDispatchObj,
} from "../helpers/helpers";

export function useDragReducer<P extends "number" | "string">(
  sourceType: P
): {
  dragState: DragStateOne<P extends "number" ? number : string>;
  dragDispatch: React.Dispatch<
    DispatchDragObjectOne<P extends "number" ? number : string>
  >;
};
export function useDragReducer<
  P extends "number" | "string",
  Q extends "number" | "string"
>(
  sourceType: P,
  firstTargetType: Q
): {
  dragState: DragStateOne<P extends "number" ? number : string>;
  dragDispatch: React.Dispatch<
    DispatchDragObjectTwo<
      P extends "number" ? number : string,
      Q extends "number" ? number : string
    >
  >;
};
export function useDragReducer<
  P extends "number" | "string",
  Q extends "number" | "string",
  R extends "number" | "string"
>(
  sourceType: P,
  firstTargetType: Q,
  secondTargetType: R
): {
  dragState: DragStateThree<
    P extends "number" ? number : string,
    Q extends "number" ? number : string,
    R extends "number" ? number : string
  >;
  dragDispatch: React.Dispatch<
    DispatchDragObjectThree<
      P extends "number" ? number : string,
      Q extends "number" ? number : string,
      R extends "number" ? number : string
    >
  >;
};
export function useDragReducer<
  P extends "number" | "string",
  Q extends "number" | "string" | undefined,
  R extends "number" | "string" | undefined
>(sourceType: P, firstTargetType?: Q, secondTargetType?: R) {
  const dragReducer = (
    dragState: DragState<P, Q, R>,
    dragObject:
      | DispatchDragObjectOne<P extends "number" ? number : string>
      | DispatchDragObjectTwo<
          P extends "number" ? number : string,
          Q extends "number" ? number : string
        >
      | DispatchDragObjectThree<
          P extends "number" ? number : string,
          Q extends "number" ? number : string,
          R extends "number" ? number : string
        >
  ): DragState<P, Q, R> => {
    if (isSourceDispatchObj(dragObject)) {
      return {
        ...dragState,
        droppedItem: { el: emptyElement, identifier: NaN },
        sourceItem: {
          identifier: dragObject.payload.identifier,
          index: dragObject.payload.index,
        },
        element: dragObject.payload.element,
        isDragging: true,
      };
    }
    if (isTargetDispatchObj(dragObject)) {
      return {
        ...dragState,
        lastTargetItem: dragState.targetItem,
        targetItem: {
          identifier: dragObject.payload.identifier,
          index: dragObject.payload.index,
          position: dragObject.payload.position,
        },
      };
    }
    if (isOneContainerDispatchObj(dragObject)) {
      const draggState = dragState as DragStateTwo<
        P extends "number" ? number : string,
        Q extends "number" ? number : string
      >;
      switch (dragObject.type) {
        case "target1Enter":
          return {
            ...dragState,
            lastTarget1: draggState.target1,
            target1: {
              identifier: dragObject.payload.identifier,
              index: dragObject.payload.index,
            },
          };
        case "target1Leave":
          return {
            ...dragState,
            lastTarget1: draggState.target1,
            lastTargetItem: dragState.targetItem,
            target1: {
              identifier: defaultParamFromTypeName(firstTargetType!),
              index: NaN,
            },
            targetItem: {
              identifier: defaultParamFromTypeName(sourceType),
              index: NaN,
              position: undefined,
            },
          };
      }
    }
    if (isTwoContainersDispatchObj(dragObject)) {
      const draggState = dragState as DragStateThree<
        P extends "number" ? number : string,
        Q extends "number" ? number : string,
        R extends "number" ? number : string
      >;
      switch (dragObject.type) {
        case "target2Enter":
          return {
            ...dragState,
            lastTarget2: draggState.target2,
            target2: {
              identifier: dragObject.payload.identifier,
              index: dragObject.payload.index,
            },
          };
        case "target2Leave":
          return {
            ...dragState,
            lastTarget2: draggState.target2,
            target2: {
              identifier: defaultParamFromTypeName(secondTargetType!),
              index: NaN,
            },
            targetItem: {
              identifier: defaultParamFromTypeName(sourceType),
              index: NaN,
              position: undefined,
            },
          };
      }
    }
    return dragObject.type === "drop"
      ? {
          ...initialDragState(sourceType, firstTargetType, secondTargetType),
          droppedItem: {
            el: document.getElementById("clone"),
            identifier: dragState.sourceItem.identifier,
          },
        }
      : initialDragState(sourceType, firstTargetType, secondTargetType);
  };
  const [dragState, dragDispatch] = useReducer(
    dragReducer,
    initialDragState(sourceType, firstTargetType, secondTargetType)
  );
  return {
    dragState,
    dragDispatch,
  };
}
