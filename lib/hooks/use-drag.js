"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDrag = void 0;
const react_1 = require("react");
const helpers_1 = require("../helpers/helpers");
function useDrag(dragState, dispatchDragState, identifier, index, moveItem, direction = "vertical", delayMS = 0, ref) {
    const elementRef = (0, react_1.useRef)(null);
    const touchTimeout = (0, react_1.useRef)(null);
    const dragStateRef = (0, react_1.useRef)(dragState);
    const pointerId = (0, react_1.useRef)(null);
    dragStateRef.current = dragState;
    const workingRef = ref !== null && ref !== void 0 ? ref : elementRef;
    const onDragStart = (e) => {
        if (e.dataTransfer) {
            e.dataTransfer.setDragImage(helpers_1.emptyElement.element, 0, 0);
            e.dataTransfer.dropEffect = "copy";
        }
        setTimeout(() => {
            startDrag(workingRef, e, direction, dispatchDragState, identifier, index);
        }, 0);
    };
    const onDrag = (e) => {
        followPointer(dragState, e);
    };
    const onDragOver = (e) => {
        if (e.type !== "touchmove")
            e.preventDefault();
        draggingOver(dragState, workingRef, e, direction, identifier, dispatchDragState, index);
    };
    const onDragEnd = (e) => {
        e.preventDefault();
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
        pointerId.current = e.pointerId;
    };
    function onPointerMove(e) {
        if (dragStateRef.current && dragStateRef.current.isDragging) {
            draggingOver(dragStateRef.current, workingRef, createEventLike(e), direction, identifier, dispatchDragState, index);
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
                startDrag(workingRef, createEventLike(e), direction, dispatchDragState, identifier, index);
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
            followPointer(dragStateRef.current, createEventLike(e));
        }
    };
    const onTouchEnd = (e) => {
        var _a;
        if (e.cancelable)
            e.preventDefault();
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
            moveItem(dragStateRef.current, identifier);
            setTimeout(() => {
                var _a;
                (_a = document.getElementById("clone")) === null || _a === void 0 ? void 0 : _a.remove();
            }, delayMS);
            dispatchDragState({ type: "drop" });
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
}
exports.useDrag = useDrag;
function draggingOver(dragState, workingRef, e, direction, identifier, dispatchDragState, index) {
    if (dragState.isDragging) {
        const dragEl = workingRef !== undefined && !!workingRef.current
            ? workingRef.current
            : e.target;
        const hoverBoundingRect = dragEl.getBoundingClientRect();
        const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
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
}
function followPointer(dragState, e) {
    const el = document.getElementById("clone");
    if (el && dragState && dragState.element.offsetY !== 0) {
        if (e.type !== "touchmove")
            e.preventDefault();
        if (e.pageY - dragState.element.offsetY > 0)
            el.style.top = `${e.pageY - dragState.element.offsetY}px`;
        if (e.pageX - dragState.element.offsetX > 0)
            el.style.left = `${e.pageX - dragState.element.offsetX}px`;
    }
    // if (e.clientX > window.innerWidth - 80) window.scrollTo({left: window.screenLeft + 30, top: window.screenTop, behavior: "auto"});
}
function startDrag(workingRef, e, direction, dispatchDragState, identifier, index) {
    const dragEl = workingRef !== undefined && !!workingRef.current
        ? workingRef.current
        : e.target;
    const boundingRect = dragEl.getBoundingClientRect();
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
                offsetX: !!e.nativeEvent
                    ? e.nativeEvent.offsetX
                    : (boundingRect.right - boundingRect.left) / 2,
                offsetY: !!e.nativeEvent
                    ? e.nativeEvent.offsetY
                    : (boundingRect.bottom - boundingRect.top) / 2,
            },
        },
    });
}
function createEventLike(e) {
    const ev = {
        clientX: (0, helpers_1.isTouchEv)(e) ? e.touches[0].clientX : e.clientX,
        clientY: (0, helpers_1.isTouchEv)(e) ? e.touches[0].clientY : e.clientY,
        nativeEvent: (0, helpers_1.isReactEv)(e) ? e.nativeEvent : undefined,
        pageX: (0, helpers_1.isTouchEv)(e) ? e.touches[0].pageX : e.pageX,
        pageY: (0, helpers_1.isTouchEv)(e) ? e.touches[0].pageY : e.pageY,
        preventDefault: e.preventDefault,
        target: e.target,
        type: e.type,
    };
    return ev;
}
//# sourceMappingURL=use-drag.js.map