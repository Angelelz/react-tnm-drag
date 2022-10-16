"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const helpers_1 = require("../helpers/helpers");
const createDragElementHook = (dragState, dragDispatch) => {
    return (identifier, index, rearrangeCallback, direction = "vertical", delayMS = 0, ref) => {
        const elementRef = (0, react_1.useRef)(null);
        const touchTimeout = (0, react_1.useRef)(null);
        const scrollTimeout = (0, react_1.useRef)(null);
        const dragStateRef = (0, react_1.useRef)(dragState);
        const mousePosition = (0, react_1.useRef)(null);
        const pointerId = (0, react_1.useRef)(null);
        dragStateRef.current = dragState;
        const workingRef = ref !== null && ref !== void 0 ? ref : elementRef;
        if (dragState.isDragging &&
            identifier === dragState.sourceItem.identifier &&
            workingRef.current) {
            workingRef.current.style.pointerEvents = "none";
            workingRef.current.style.opacity = "0";
        }
        else if (workingRef.current) {
            workingRef.current.style.pointerEvents = "";
        }
        const onDragStart = (e) => {
            if (e.dataTransfer) {
                e.dataTransfer.setDragImage(helpers_1.emptyElement.element, 0, 0);
                e.dataTransfer.dropEffect = "copy";
            }
            setTimeout(() => {
                (0, helpers_1.startDrag)(workingRef, e, direction, dragDispatch, identifier, index);
            }, 0);
        };
        const onDrag = (e) => {
            (0, helpers_1.followPointer)(dragState, (0, helpers_1.createEventLike)(e));
        };
        const onDragOver = (e) => {
            if (e.type !== "touchmove")
                e.preventDefault();
            (0, helpers_1.draggingOver)(dragState, workingRef, e, direction, identifier, dragDispatch, index, rearrangeCallback);
        };
        const onDragEnd = (e) => {
            e.preventDefault();
            // rearrangeCallback(dragState, identifier);
            (0, helpers_1.completeDrag)(delayMS, workingRef);
            dragDispatch({
                type: "drop",
            });
        };
        const onPointerDown = (e) => {
            pointerId.current = e.pointerId;
        };
        function onPointerMove(e) {
            if (dragStateRef.current && dragStateRef.current.isDragging) {
                (0, helpers_1.draggingOver)(dragStateRef.current, workingRef, (0, helpers_1.createEventLike)(e), direction, identifier, dragDispatch, index, rearrangeCallback);
            }
        }
        const onPointerUp = (e) => {
            pointerId.current = null;
        };
        const onTouchStart = (e) => {
            touchTimeout.current = setTimeout(() => {
                var _a;
                touchTimeout.current = null;
                if (dragStateRef.current && !!onDragStart && pointerId.current) {
                    e.preventDefault();
                    e.target.releasePointerCapture(pointerId.current);
                    (0, helpers_1.startDrag)(workingRef, (0, helpers_1.createEventLike)(e), direction, dragDispatch, identifier, index);
                }
                mousePosition.current = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY,
                };
                if (scrollTimeout.current === null) {
                    scrollTimeout.current = setInterval(() => (0, helpers_1.doScroll)(mousePosition.current), 150);
                }
                (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
            }, 500);
        };
        const onTouchMove = (e) => {
            var _a;
            if (touchTimeout.current) {
                clearTimeout(touchTimeout.current);
                touchTimeout.current = null;
            }
            else if (e.cancelable && dragStateRef.current) {
                e.preventDefault();
                (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
                mousePosition.current = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY,
                };
                (0, helpers_1.followPointer)(dragStateRef.current, (0, helpers_1.createEventLike)(e));
                clearInterval(scrollTimeout.current ? scrollTimeout.current - 1 : 0); // in Development mode the timeout is created twice
            }
        };
        const onTouchEnd = (e) => {
            var _a;
            if (e.cancelable)
                e.preventDefault();
            if (scrollTimeout.current) {
                clearInterval(scrollTimeout.current);
                clearInterval(scrollTimeout.current - 1); // in Development mode the timeout is created twice
                scrollTimeout.current = null;
            }
            if (touchTimeout.current) {
                clearTimeout(touchTimeout.current);
                touchTimeout.current = null;
                const clickEvent = new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    detail: 1,
                });
                (_a = e.target) === null || _a === void 0 ? void 0 : _a.dispatchEvent(clickEvent);
            }
            if (dragStateRef.current && dragStateRef.current.isDragging) {
                // rearrangeCallback(dragStateRef.current, identifier);
                (0, helpers_1.completeDrag)(delayMS, workingRef);
                mousePosition.current = null;
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
//# sourceMappingURL=use-drag-element.js.map