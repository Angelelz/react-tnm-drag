import {
  DispatchDragObject,
  DragOptions,
  DragState,
  DragStateOneContainer,
  DragStateTwoContainers,
  NoS,
} from "../types/types";

import {
  initialDragState,
  isDragStateTwoContainers,
  isPrimaryContainerDispatchObj,
  isSecondaryContainerDispatchObj,
  isSourceDispatchObj,
  isTargetDispatchObj,
} from "./helpers";

const dragReducer = <El>(options: DragOptions<El>) => {
  return (
    dragState: DragState<typeof options>,
    dragObject: DispatchDragObject<typeof options>
  ): DragState<typeof options> => {
    if (isSourceDispatchObj(dragObject)) {
      return {
        ...dragState,
        droppedItem: undefined,
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
        sourceItem: {
          identifier: dragState.sourceItem.identifier,
          index: dragObject.payload.newSourceIndex
        },
        lastTargetItem: dragState.targetItem,
        targetItem: {
          identifier: dragObject.payload.identifier,
          index: dragObject.payload.index,
        },
      };
    }
    if (isPrimaryContainerDispatchObj(dragObject)) {
      const draggState = dragState as DragStateOneContainer<NoS, NoS>;
      switch (dragObject.type) {
        case "primaryContainerEnter":
          return {
            ...dragState,
            lastPrimaryContainer: draggState.primaryContainer,
            primaryContainer: {
              identifier: dragObject.payload.identifier,
              index: dragObject.payload.index,
            },
          };
        case "primaryContainerLeave":
          return {
            ...dragState,
            lastPrimaryContainer: draggState.primaryContainer,
            lastTargetItem: dragState.targetItem,
            primaryContainer: {
              identifier: null,
              index: null,
            },
            targetItem: {
              identifier: null,
              index: null,
              // position: null,
            },
          };
      }
    }
    if (isSecondaryContainerDispatchObj(dragObject)) {
      const draggState = dragState as DragStateTwoContainers<NoS, NoS, NoS>;
      switch (dragObject.type) {
        case "secondaryContainerEnter":
          return isDragStateTwoContainers(dragState)
            ? {
                ...dragState,
                lastSecondaryContainer: draggState.secondaryContainer,
                secondaryContainer: {
                  identifier: dragObject.payload.identifier,
                  index: dragObject.payload.index,
                },
              }
            : initialDragState(options);
        case "secondaryContainerLeave":
          return isDragStateTwoContainers(dragState)
            ? {
                ...dragState,
                lastSecondaryContainer: draggState.secondaryContainer,
                secondaryContainer: {
                  identifier: null,
                  index: null,
                },
                targetItem: {
                  identifier: null,
                  index: null,
                  // position: null,
                },
              }
            : initialDragState(options);
      }
    }
    
    return {
      ...initialDragState(options),
      droppedItem: {
        el: document.getElementById("clone")!,
        identifier: dragState.sourceItem.identifier!,
      }
    };
  };
};

export default dragReducer;
