"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const dragReducer = (options) => {
    return (dragState, dragObject) => {
        if ((0, helpers_1.isSourceDispatchObj)(dragObject)) {
            return Object.assign(Object.assign({}, dragState), { droppedItem: undefined, sourceItem: {
                    identifier: dragObject.payload.identifier,
                    index: dragObject.payload.index,
                }, element: dragObject.payload.element, isDragging: true });
        }
        if ((0, helpers_1.isTargetDispatchObj)(dragObject)) {
            return Object.assign(Object.assign({}, dragState), { sourceItem: {
                    identifier: dragState.sourceItem.identifier,
                    index: dragObject.payload.newSourceIndex
                }, lastTargetItem: dragState.targetItem, targetItem: {
                    identifier: dragObject.payload.identifier,
                    index: dragObject.payload.index,
                } });
        }
        if ((0, helpers_1.isPrimaryContainerDispatchObj)(dragObject)) {
            const draggState = dragState;
            switch (dragObject.type) {
                case "primaryContainerEnter":
                    return Object.assign(Object.assign({}, dragState), { lastPrimaryContainer: draggState.primaryContainer, primaryContainer: {
                            identifier: dragObject.payload.identifier,
                            index: dragObject.payload.index,
                        } });
                case "primaryContainerLeave":
                    return Object.assign(Object.assign({}, dragState), { lastPrimaryContainer: draggState.primaryContainer, lastTargetItem: dragState.targetItem, primaryContainer: {
                            identifier: null,
                            index: null,
                        }, targetItem: {
                            identifier: null,
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
                                identifier: dragObject.payload.identifier,
                                index: dragObject.payload.index,
                            } }) : (0, helpers_1.initialDragState)(options);
                case "secondaryContainerLeave":
                    return (0, helpers_1.isDragStateTwoContainers)(dragState)
                        ? Object.assign(Object.assign({}, dragState), { lastSecondaryContainer: draggState.secondaryContainer, secondaryContainer: {
                                identifier: null,
                                index: null,
                            }, targetItem: {
                                identifier: null,
                                index: null,
                                // position: null,
                            } }) : (0, helpers_1.initialDragState)(options);
            }
        }
        return Object.assign(Object.assign({}, (0, helpers_1.initialDragState)(options)), { droppedItem: {
                el: document.getElementById("clone"),
                identifier: dragState.sourceItem.identifier,
            } });
    };
};
exports.default = dragReducer;
//# sourceMappingURL=drag-reducer.js.map