"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialDragState = exports.useDragItem = exports.useDragContainer = exports.useDragReducer = void 0;
const react_1 = require("react");
function useDragReducer(sourceType, firstTargetType, secondTargetType) {
    // const controller1 = new AbortController();
    // document.addEventListener("touchstart", (e) => e.preventDefault(), {
    //   passive: false,
    //   signal: controller1.signal,
    // });
    // document.addEventListener("touchmove", (e) => e.preventDefault(), {
    //   passive: false,
    // });
    // document.addEventListener("touchend", (e) => e.preventDefault(), {
    //   passive: false,
    // });
    // controller1.abort();
    // console.log("executed");
    const dragReducer = (dragState, dragObject) => {
        if (isSourceDispatchObj(dragObject)) {
            return Object.assign(Object.assign({}, dragState), { droppedItem: { el: emptyElement, identifier: NaN }, sourceItem: {
                    identifier: dragObject.payload.identifier,
                    index: dragObject.payload.index,
                }, element: dragObject.payload.element, isDragging: true });
        }
        if (isTargetDispatchObj(dragObject)) {
            return Object.assign(Object.assign({}, dragState), { lastTargetItem: dragState.targetItem, targetItem: {
                    identifier: dragObject.payload.identifier,
                    index: dragObject.payload.index,
                    position: dragObject.payload.position,
                } });
        }
        if (isOneContainerDispatchObj(dragObject)) {
            const draggState = dragState;
            switch (dragObject.type) {
                case "target1Enter":
                    return Object.assign(Object.assign({}, dragState), { lastTarget1: draggState.target1, target1: {
                            identifier: dragObject.payload.identifier,
                            index: dragObject.payload.index,
                        } });
                case "target1Leave":
                    return Object.assign(Object.assign({}, dragState), { lastTarget1: draggState.target1, lastTargetItem: dragState.targetItem, target1: {
                            identifier: defaultParamFromTypeName(firstTargetType),
                            index: NaN,
                        }, targetItem: {
                            identifier: defaultParamFromTypeName(sourceType),
                            index: NaN,
                            position: undefined,
                        } });
            }
        }
        if (isTwoContainersDispatchObj(dragObject)) {
            const draggState = dragState;
            switch (dragObject.type) {
                case "target2Enter":
                    return Object.assign(Object.assign({}, dragState), { lastTarget2: draggState.target2, target2: {
                            identifier: dragObject.payload.identifier,
                            index: dragObject.payload.index,
                        } });
                case "target2Leave":
                    return Object.assign(Object.assign({}, dragState), { lastTarget2: draggState.target2, target2: {
                            identifier: defaultParamFromTypeName(secondTargetType),
                            index: NaN,
                        }, targetItem: {
                            identifier: defaultParamFromTypeName(sourceType),
                            index: NaN,
                            position: undefined,
                        } });
            }
        }
        return dragObject.type === "drop"
            ? Object.assign(Object.assign({}, (0, exports.initialDragState)(sourceType, firstTargetType, secondTargetType)), { droppedItem: {
                    el: document.getElementById("clone"),
                    identifier: dragState.sourceItem.identifier,
                } }) : (0, exports.initialDragState)(sourceType, firstTargetType, secondTargetType);
    };
    const [dragState, dragDispatch] = (0, react_1.useReducer)(dragReducer, (0, exports.initialDragState)(sourceType, firstTargetType, secondTargetType));
    return {
        dragState,
        dragDispatch,
    };
}
exports.useDragReducer = useDragReducer;
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
        enterRef.current = initialValue(targetIdentifier);
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
        const shouldDispatch = !isInitialValue(identifier) &&
            e.relatedTarget &&
            e.relatedTarget.nodeName !== undefined &&
            !e.currentTarget.contains(e.relatedTarget);
        if (shouldDispatch) {
            enterRef.current = initialValue(enterRef.current);
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
exports.useDragContainer = useDragContainer;
function useDragItem(dragState, dispatchDragState, identifier, index, moveItem, direction = "vertical", delayMS = 0, ref) {
    const elementRef = (0, react_1.useRef)(null);
    const timeout = (0, react_1.useRef)(null);
    const initialOffset = (0, react_1.useRef)(null);
    const onDragStart = (e) => {
        if (e.dataTransfer) {
            const img = document.createElement("img");
            img.src =
                "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
            e.dataTransfer.setDragImage(img, 0, 0);
            e.dataTransfer.dropEffect = "copy";
        }
        if (e.type === "pointerdown") {
            document.addEventListener("pointermove", pointerMove);
            document.addEventListener("pointerup", removeEvents);
        }
        setTimeout(() => {
            var _a, _b, _c, _d;
            const dragEl = ref !== undefined && !!ref.current
                ? ref.current
                : !!elementRef.current
                    ? elementRef.current
                    : e.target;
            const boundingRect = dragEl.getBoundingClientRect();
            initialOffset.current = {
                x: (_a = e.nativeEvent.offsetX) !== null && _a !== void 0 ? _a : (boundingRect.right - boundingRect.left) / 2,
                y: (_b = e.nativeEvent.offsetY) !== null && _b !== void 0 ? _b : (boundingRect.right - boundingRect.left) / 2,
            };
            const size = direction === "vertical" ? boundingRect.height : boundingRect.width;
            document.documentElement.style.setProperty("--pix", size + 4 + "px");
            const clonedEl = dragEl.cloneNode(true);
            clonedEl.id = "clone";
            clonedEl.style.position = "absolute";
            clonedEl.style.top = boundingRect.y + (e.pageY - e.clientY) + "px";
            clonedEl.style.left = boundingRect.x + (e.pageX - e.clientX) + "px";
            clonedEl.style.width = `${boundingRect.width}px`;
            clonedEl.style.zIndex = "2000";
            clonedEl.style.pointerEvents = "none";
            document.body.appendChild(clonedEl);
            dispatchDragState({
                type: "sourceItem",
                payload: {
                    identifier: identifier,
                    index: index,
                    element: {
                        element: clonedEl,
                        x: 2 * boundingRect.x - e.clientX + (e.pageX - e.clientX),
                        y: 2 * boundingRect.y - e.clientY + (e.pageY - e.clientY),
                        offsetX: (_c = e.nativeEvent.offsetX) !== null && _c !== void 0 ? _c : (boundingRect.right - boundingRect.left) / 2,
                        offsetY: (_d = e.nativeEvent.offsetY) !== null && _d !== void 0 ? _d : (boundingRect.right - boundingRect.left) / 2,
                    },
                },
            });
        }, 0);
    };
    function pointerMove(e) {
        const el = document.getElementById("clone");
        if (initialOffset.current && el) {
            e.preventDefault();
            if (e.pageY - initialOffset.current.y > 0)
                el.style.top = `${e.pageY - initialOffset.current.y}px`;
            if (e.pageX - initialOffset.current.x > 0)
                el.style.left = `${e.pageX - initialOffset.current.x}px`;
        }
    }
    function removeEvents() {
        this.removeEventListener("pointerup", removeEvents);
        this.removeEventListener("pointermove", pointerMove);
    }
    const onDrag = (e) => {
        const el = document.getElementById("clone");
        if (initialOffset.current && el) {
            e.preventDefault();
            // e.stopPropagation();
            if (e.pageY - initialOffset.current.y > 0)
                el.style.top = `${e.pageY - initialOffset.current.y}px`;
            if (e.pageX - initialOffset.current.x > 0)
                el.style.left = `${e.pageX - initialOffset.current.x}px`;
        }
    };
    const onDragOver = (e) => {
        if (e.type !== "touchmove")
            e.preventDefault();
        if (dragState === null || dragState === void 0 ? void 0 : dragState.isDragging) {
            const dragEl = ref !== undefined && !!ref.current
                ? ref.current
                : !!elementRef.current
                    ? elementRef.current
                    : e.target;
            const hoverBoundingRect = dragEl.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
            const clientOffsetY = e.clientY;
            const clientOffsetX = e.clientX;
            const hoverClientY = clientOffsetY - hoverBoundingRect.top;
            const hoverClientX = clientOffsetX - hoverBoundingRect.left;
            const position = direction === "vertical"
                ? hoverClientY < hoverMiddleY
                    ? "before"
                    : "after"
                : hoverClientX < hoverMiddleX
                    ? "before"
                    : "after";
            if (dragState.targetItem.position !== position ||
                dragState.targetItem.identifier !== identifier)
                dispatchDragState({
                    type: "overItem",
                    payload: { identifier, index, position },
                });
        }
    };
    const onDragEnd = (e) => {
        e.preventDefault();
        initialOffset.current = null;
        document.removeEventListener("pointermove", pointerMove);
        moveItem(dragState, identifier);
        setTimeout(() => {
            var _a;
            (_a = document.getElementById("clone")) === null || _a === void 0 ? void 0 : _a.remove();
        }, delayMS);
        dispatchDragState({
            type: "drop",
        });
    };
    const onPointerDown = (e) => {
        if (e.pointerType === "touch" && !timeout.current) {
            timeout.current = setTimeout(() => {
                // e.preventDefault();
                e.target.releasePointerCapture(e.pointerId);
                timeout.current = null;
                onDragStart(e);
            }, 500);
        }
    };
    const onTouchStart = (e) => {
        // e.preventDefault();
    };
    const onPointerMoveCapture = (e) => {
        if (!dragState.isDragging &&
            timeout.current &&
            (e.movementX > 4 || e.movementY > 4)) {
            clearTimeout(timeout.current);
            timeout.current = null;
            e.target.style.touchAction = "auto";
        }
    };
    const onTouchEnd = (e) => {
        if (timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = null;
            // console.log("test")
            // const clickEvent = new MouseEvent('click', { button: 0});
            // e.target.dispatchEvent(clickEvent);
        }
        else if (dragState.isDragging) {
            onDragEnd(e);
        }
        if (e.target.style.touchAction === "auto")
            e.target.style.touchAction = "none";
    };
    const onPointerMove = (e) => {
        if (dragState.isDragging) {
            onDragOver(e);
        }
    };
    return {
        sourceDragProps: {
            draggable: true,
            onDragStart,
            onDrag,
            onDragOver,
            onDragEnd,
            onPointerDown,
            onTouchStart,
            onPointerMoveCapture,
            onTouchEnd,
            onPointerMove,
        },
        elementRef,
    };
}
exports.useDragItem = useDragItem;
function isSourceDispatchObj(obj) {
    return obj.type === "sourceItem";
}
function isTargetDispatchObj(obj) {
    return obj.type === "overItem";
}
function isOneContainerDispatchObj(obj) {
    return obj.type === "target1Enter" || obj.type === "target1Leave";
}
function isTwoContainersDispatchObj(obj) {
    return obj.type === "target2Enter" || obj.type === "target2Leave";
}
const emptyElement = {
    element: document.createElement("span"),
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
};
const defaultParam = (n) => {
    return (typeof n === "number" ? NaN : "");
};
const defaultParamFromTypeName = (n) => {
    return (n === "number" ? defaultParam(1) : defaultParam(""));
};
const initialDragState = (l, m, n) => {
    const initialL = defaultParamFromTypeName(l);
    if (m === undefined && n === undefined) {
        const initialState = {
            sourceItem: {
                identifier: initialL,
                index: NaN,
            },
            targetItem: {
                identifier: initialL,
                index: NaN,
                position: "",
            },
            lastTargetItem: {
                identifier: initialL,
                index: NaN,
                position: "",
            },
            element: emptyElement,
            isDragging: false,
        };
        return initialState;
    }
    if (m && n === undefined) {
        const initialM = defaultParamFromTypeName(m);
        const initialState = Object.assign(Object.assign({}, (0, exports.initialDragState)(l)), { target1: {
                identifier: initialM,
                index: NaN,
            }, lastTarget1: {
                identifier: initialM,
                index: NaN,
            } });
        return initialState;
    }
    const initialN = defaultParamFromTypeName(n);
    const initialState = Object.assign(Object.assign({}, (0, exports.initialDragState)(l, m)), { target2: {
            identifier: initialN,
            index: NaN,
        }, lastTarget2: {
            identifier: initialN,
            index: NaN,
        } });
    return initialState;
};
exports.initialDragState = initialDragState;
const initialValue = (value) => {
    return typeof value === "number" ? NaN : "";
};
const isInitialValue = (value) => {
    return value === initialValue(value);
};
//# sourceMappingURL=index.js.map