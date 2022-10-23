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
          id: dragObject.payload.id,
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
          id: dragState.sourceItem.id,
          index: dragObject.payload.newSourceIndex
        },
        lastTargetItem: dragState.targetItem,
        targetItem: {
          id: dragObject.payload.id,
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
              id: dragObject.payload.id,
              index: dragObject.payload.index,
            },
          };
        case "primaryContainerLeave":
          return {
            ...dragState,
            lastPrimaryContainer: draggState.primaryContainer,
            lastTargetItem: dragState.targetItem,
            primaryContainer: {
              id: null,
              index: null,
            },
            targetItem: {
              id: null,
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
                  id: dragObject.payload.id,
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
                  id: null,
                  index: null,
                },
                targetItem: {
                  id: null,
                  index: null,
                },
              }
            : initialDragState(options);
      }
    }
    
    return {
      ...initialDragState(options),
      droppedItem: {
        el: document.getElementById("clone")!,
        id: dragState.sourceItem.id!,
      }
    };
  };
};

export default dragReducer;
