"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const helpers_1 = require("../helpers/helpers");
function useDragReducer(sourceType, firstContainerType, secondContainerType) {
    const dragReducer = (dragState, dragObject) => {
        if ((0, helpers_1.isSourceDispatchObj)(dragObject)) {
            return Object.assign(Object.assign({}, dragState), { droppedItem: { el: helpers_1.emptyElement, identifier: NaN }, sourceItem: {
                    identifier: dragObject.payload.identifier,
                    index: dragObject.payload.index,
                }, element: dragObject.payload.element, isDragging: true });
        }
        if ((0, helpers_1.isTargetDispatchObj)(dragObject)) {
            return Object.assign(Object.assign({}, dragState), { lastTargetItem: dragState.targetItem, targetItem: {
                    identifier: dragObject.payload.identifier,
                    index: dragObject.payload.index,
                    position: dragObject.payload.position,
                } });
        }
        if ((0, helpers_1.isOneContainerDispatchObj)(dragObject)) {
            const draggState = dragState;
            switch (dragObject.type) {
                case "target1Enter":
                    return Object.assign(Object.assign({}, dragState), { lastTarget1: draggState.target1, target1: {
                            identifier: dragObject.payload.identifier,
                            index: dragObject.payload.index,
                        } });
                case "target1Leave":
                    return Object.assign(Object.assign({}, dragState), { lastTarget1: draggState.target1, lastTargetItem: dragState.targetItem, target1: {
                            identifier: (0, helpers_1.defaultParamFromTypeName)(firstContainerType),
                            index: NaN,
                        }, targetItem: {
                            identifier: (0, helpers_1.defaultParamFromTypeName)(sourceType),
                            index: NaN,
                            position: undefined,
                        } });
            }
        }
        if ((0, helpers_1.isTwoContainersDispatchObj)(dragObject)) {
            const draggState = dragState;
            switch (dragObject.type) {
                case "target2Enter":
                    return Object.assign(Object.assign({}, dragState), { lastTarget2: draggState.target2, target2: {
                            identifier: dragObject.payload.identifier,
                            index: dragObject.payload.index,
                        } });
                case "target2Leave":
                    return Object.assign(Object.assign({}, dragState), { lastTarget2: draggState.target2, target2: {
                            identifier: (0, helpers_1.defaultParamFromTypeName)(secondContainerType),
                            index: NaN,
                        }, targetItem: {
                            identifier: (0, helpers_1.defaultParamFromTypeName)(sourceType),
                            index: NaN,
                            position: undefined,
                        } });
            }
        }
        return dragObject.type === "drop"
            ? Object.assign(Object.assign({}, (0, helpers_1.initialDragState)(sourceType, firstContainerType, secondContainerType)), { droppedItem: {
                    el: document.getElementById("clone"),
                    identifier: dragState.sourceItem.identifier,
                } }) : (0, helpers_1.initialDragState)(sourceType, firstContainerType, secondContainerType);
    };
    const [dragState, dragDispatch] = (0, react_1.useReducer)(dragReducer, (0, helpers_1.initialDragState)(sourceType, firstContainerType, secondContainerType));
    return {
        dragState,
        dragDispatch,
    };
}
exports.default = useDragReducer;
//# sourceMappingURL=use-drag-reducer.js.map