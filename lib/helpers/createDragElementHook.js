"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const helpers_1 = require("./helpers");
const createDragElementHook = (dragState, dragDispatch, elementArray, animationTimeout) => {
    return (identifier, index, arrayCallback, direction = "vertical", delayMS = 400, ref) => {
        const elementRef = (0, react_1.useRef)(null);
        const internalRef = (0, react_1.useRef)({
            touchTimeout: null,
            scrollTimeout: null,
            dragState: dragState,
            mousePosition: null,
            pointerId: null,
            initialStyle: null,
        });
        internalRef.current.dragState = dragState;
        const workingRef = ref !== null && ref !== void 0 ? ref : elementRef;
        if (internalRef.current.initialStyle === null && workingRef.current) {
            internalRef.current.initialStyle = {
                transition: workingRef.current.style.transition,
                translate: workingRef.current.style.translate,
                opacity: workingRef.current.style.opacity,
            };
        }
        if (dragState.isDragging &&
            identifier === dragState.sourceItem.identifier &&
            workingRef.current) {
            workingRef.current.style.pointerEvents = "none";
            workingRef.current.style.opacity = "0";
        }
        else if (workingRef.current) {
            workingRef.current.style.pointerEvents = "";
        }
        if (internalRef.current.initialStyle !== null &&
            identifier !== dragState.targetItem.identifier) {
            workingRef.current.style.transition =
                internalRef.current.initialStyle.transition;
            workingRef.current.style.translate =
                internalRef.current.initialStyle.translate;
        }
        if (!dragState.isDragging &&
            workingRef.current &&
            dragState.droppedItem &&
            dragState.droppedItem.identifier === identifier) {
            workingRef.current.style.opacity = "0";
            setTimeout(() => {
                workingRef.current.style.opacity =
                    internalRef.current.initialStyle.opacity;
            }, delayMS / 2);
        }
        const onDragStart = (e) => {
            if (e.dataTransfer) {
                e.dataTransfer.setDragImage(helpers_1.emptyElement.element, 0, 0);
                e.dataTransfer.dropEffect = "copy";
            }
            setTimeout(() => {
                (0, helpers_1.createCloneAndStartDrag)(workingRef, e, direction, dragDispatch, identifier, index);
            }, 0);
        };
        const onDrag = (e) => {
            (0, helpers_1.followPointer)(dragState, (0, helpers_1.createEventLike)(e));
        };
        const onDragOver = (e) => {
            if (e.type !== "touchmove")
                e.preventDefault();
            (0, helpers_1.draggingOver)(dragState, workingRef, e, direction, identifier, dragDispatch, index, arrayCallback, elementArray, internalRef.current, animationTimeout);
        };
        const onDragEnd = (e) => {
            e.preventDefault();
            // rearrangeCallback(dragState, identifier);
            (0, helpers_1.removeAndAnimateClone)(delayMS, workingRef);
            dragDispatch({
                type: "drop",
            });
        };
        const onPointerDown = (e) => {
            internalRef.current.pointerId = e.pointerId;
        };
        function onPointerMove(e) {
            if (internalRef.current.dragState &&
                internalRef.current.dragState.isDragging) {
                (0, helpers_1.draggingOver)(internalRef.current.dragState, workingRef, (0, helpers_1.createEventLike)(e), direction, identifier, dragDispatch, index, arrayCallback, elementArray, internalRef.current, animationTimeout);
            }
        }
        const onPointerUp = (e) => {
            internalRef.current.pointerId = null;
        };
        const onTouchStart = (e) => {
            internalRef.current.touchTimeout = setTimeout(() => {
                var _a;
                internalRef.current.touchTimeout = null;
                if (internalRef.current.dragState &&
                    !!onDragStart &&
                    internalRef.current.pointerId) {
                    e.preventDefault();
                    e.target.releasePointerCapture(internalRef.current.pointerId);
                    (0, helpers_1.createCloneAndStartDrag)(workingRef, (0, helpers_1.createEventLike)(e), direction, dragDispatch, identifier, index);
                }
                internalRef.current.mousePosition = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY,
                };
                if (internalRef.current.scrollTimeout === null) {
                    internalRef.current.scrollTimeout = setInterval(() => (0, helpers_1.doScroll)(internalRef.current.mousePosition), 150);
                }
                (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
            }, 500);
        };
        const onTouchMove = (e) => {
            var _a;
            if (internalRef.current.touchTimeout) {
                clearTimeout(internalRef.current.touchTimeout);
                internalRef.current.touchTimeout = null;
            }
            else if (e.cancelable && internalRef.current.dragState) {
                e.preventDefault();
                (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
                internalRef.current.mousePosition = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY,
                };
                (0, helpers_1.followPointer)(internalRef.current.dragState, (0, helpers_1.createEventLike)(e));
                clearInterval(internalRef.current.scrollTimeout
                    ? internalRef.current.scrollTimeout - 1
                    : 0); // in Development mode the timeout is created twice
            }
        };
        const onTouchEnd = (e) => {
            var _a;
            if (e.cancelable)
                e.preventDefault();
            if (internalRef.current.scrollTimeout) {
                clearInterval(internalRef.current.scrollTimeout);
                clearInterval(internalRef.current.scrollTimeout - 1); // in Development mode the timeout is created twice
                internalRef.current.scrollTimeout = null;
            }
            if (internalRef.current.touchTimeout) {
                clearTimeout(internalRef.current.touchTimeout);
                internalRef.current.touchTimeout = null;
                const clickEvent = new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    detail: 1,
                });
                (_a = e.target) === null || _a === void 0 ? void 0 : _a.dispatchEvent(clickEvent);
            }
            if (internalRef.current.dragState &&
                internalRef.current.dragState.isDragging) {
                // rearrangeCallback(internalRef.current.dragStateRef, identifier);
                (0, helpers_1.removeAndAnimateClone)(delayMS, workingRef);
                internalRef.current.mousePosition = null;
                dragDispatch({ type: "drop" });
            }
        };
        (0, react_1.useEffect)(() => {
            if (workingRef.current) {
                workingRef.current.addEventListener("pointermove", onPointerMove);
                workingRef.current.addEventListener("touchstart", onTouchStart, {
                    passive: false,
                });
                workingRef.current.addEventListener("touchmove", onTouchMove, {
                    passive: false,
                });
            }
            return () => {
                if (workingRef.current) {
                    workingRef.current.removeEventListener("pointermove", onPointerMove);
                    workingRef.current.removeEventListener("touchstart", onTouchStart);
                    workingRef.current.removeEventListener("touchmove", onTouchMove);
                }
            };
        }, []);
        return {
            draggable: true,
            onDragStart,
            onDrag,
            onDragOver,
            onDragEnd,
            onPointerDown,
            onPointerUp,
            onTouchEnd,
            ref: workingRef,
        };
    };
};
exports.default = createDragElementHook;
//# sourceMappingURL=createDragElementHook.js.map