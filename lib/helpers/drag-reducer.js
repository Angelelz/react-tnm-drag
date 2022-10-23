"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const dragReducer = (options) => {
    return (dragState, dragObject) => {
        if ((0, helpers_1.isSourceDispatchObj)(dragObject)) {
            return Object.assign(Object.assign({}, dragState), { droppedItem: undefined, sourceItem: {
                    id: dragObject.payload.id,
                    index: dragObject.payload.index,
                }, element: dragObject.payload.element, isDragging: true });
        }
        if ((0, helpers_1.isTargetDispatchObj)(dragObject)) {
            return Object.assign(Object.assign({}, dragState), { sourceItem: {
                    id: dragState.sourceItem.id,
                    index: dragObject.payload.newSourceIndex
                }, lastTargetItem: dragState.targetItem, targetItem: {
                    id: dragObject.payload.id,
                    index: dragObject.payload.index,
                } });
        }
        if ((0, helpers_1.isPrimaryContainerDispatchObj)(dragObject)) {
            const draggState = dragState;
            switch (dragObject.type) {
                case "primaryContainerEnter":
                    return Object.assign(Object.assign({}, dragState), { lastPrimaryContainer: draggState.primaryContainer, primaryContainer: {
                            id: dragObject.payload.id,
                            index: dragObject.payload.index,
                        } });
                case "primaryContainerLeave":
                    return Object.assign(Object.assign({}, dragState), { lastPrimaryContainer: draggState.primaryContainer, lastTargetItem: dragState.targetItem, primaryContainer: {
                            id: null,
                            index: null,
                        }, targetItem: {
                            id: null,
                            index: null,
                            // position: null,
                        } });
            }
        }
        if ((0, helpers_1.isSecondaryContainerDispatchObj)(dragObject)) {
            const draggState = dragState;
            switch (dragObject.type) {
                case "secondaryContainerEnter":
                    return (0, helpers_1.isDragStateTwoContainers)(dragState)
                        ? Object.assign(Object.assign({}, dragState), { lastSecondaryContainer: draggState.secondaryContainer, secondaryContainer: {
                                id: dragObject.payload.id,
                                index: dragObject.payload.index,
                            } }) : (0, helpers_1.initialDragState)(options);
                case "secondaryContainerLeave":
                    return (0, helpers_1.isDragStateTwoContainers)(dragState)
                        ? Object.assign(Object.assign({}, dragState), { lastSecondaryContainer: draggState.secondaryContainer, secondaryContainer: {
                                id: null,
                                index: null,
                            }, targetItem: {
                                id: null,
                                index: null,
                            } }) : (0, helpers_1.initialDragState)(options);
            }
        }
        return Object.assign(Object.assign({}, (0, helpers_1.initialDragState)(options)), { droppedItem: {
                el: document.getElementById("clone"),
                id: dragState.sourceItem.id,
            } });
    };
};
exports.default = dragReducer;
//# sourceMappingURL=drag-reducer.js.map