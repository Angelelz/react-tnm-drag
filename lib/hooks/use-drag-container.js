"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const helpers_1 = require("../helpers/helpers");
function useDragContainer(which, dragState, dispatchDragState, identifier, index) {
    const isSecondContainer = (dr) => {
        return which === "secondContainer";
    };
    const targetIdentifier = isSecondContainer(dragState)
        ? dragState.target2.identifier
        : dragState.target1.identifier;
    const targetEnter = which === "secondContainer" ? "target2Enter" : "target1Enter";
    const targetLeave = which === "secondContainer" ? "target2Leave" : "target1Leave";
    const enterRef = (0, react_1.useRef)(targetIdentifier);
    if (!dragState.isDragging)
        enterRef.current = (0, helpers_1.initialValue)(targetIdentifier);
    const onDragOver = (e) => {
        e.preventDefault();
        const shouldChange = dragState.isDragging && enterRef.current !== identifier;
        if (shouldChange) {
            enterRef.current = identifier;
            const dispatchObj = {
                type: targetEnter,
                payload: { identifier, index },
            };
            dispatchDragState(dispatchObj);
        }
    };
    const onDragLeave = (e) => {
        e.preventDefault();
        const shouldDispatch = !(0, helpers_1.initialValue)(identifier) &&
            e.relatedTarget &&
            e.relatedTarget.nodeName !== undefined &&
            !e.currentTarget.contains(e.relatedTarget);
        if (shouldDispatch) {
            enterRef.current = (0, helpers_1.initialValue)(enterRef.current);
            const dispatchObj = {
                type: targetLeave,
                payload: { identifier: enterRef.current, index: NaN },
            };
            dispatchDragState(dispatchObj);
        }
    };
    const onPointerMove = (e) => {
        if (e.pointerType === "touch") {
            onDragOver(e);
        }
    };
    const onPointerLeave = (e) => {
        if (e.pointerType === "touch") {
            onDragLeave(e);
        }
    };
    return { onDragOver, onDragLeave, onPointerMove, onPointerLeave };
}
exports.default = useDragContainer;
//# sourceMappingURL=use-drag-container.js.map