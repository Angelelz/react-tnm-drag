"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDrag = void 0;
const react_1 = require("react");
const helpers_1 = require("../helpers/helpers");
function useDrag(dragState, dispatchDragState, identifier, index, moveItem, direction = "vertical", delayMS = 0, ref) {
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
    const elementRef = (0, react_1.useRef)(null);
    const timeout = (0, react_1.useRef)(null);
    const initialOffset = (0, react_1.useRef)(null);
    const dragStateRef = (0, react_1.useRef)(dragState);
    dragStateRef.current = dragState;
    const workingRef = ref !== null && ref !== void 0 ? ref : elementRef;
    const onDragStart = (e) => {
        if (e.dataTransfer) {
            e.dataTransfer.setDragImage(helpers_1.emptyElement.element, 0, 0);
            e.dataTransfer.dropEffect = "copy";
        }
        console.log("started dragging");
        // if (e.type === "pointerdown") {
        //   document.addEventListener("pointermove", pointerMove);
        //   document.addEventListener("pointerup", removeEvents);
        // }
        setTimeout(() => {
            var _a, _b, _c, _d;
            const dragEl = workingRef !== undefined && !!workingRef.current
                ? workingRef.current
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
    // function pointerMove(e: PointerEvent) {
    //   const el = document.getElementById("clone");
    //   if (initialOffset.current && el) {
    //     e.preventDefault();
    //     if (e.pageY - initialOffset.current.y > 0)
    //       el.style.top = `${e.pageY - initialOffset.current.y}px`;
    //     if (e.pageX - initialOffset.current.x > 0)
    //       el.style.left = `${e.pageX - initialOffset.current.x}px`;
    //   }
    // }
    // function removeEvents(this: Document) {
    //   this.removeEventListener("pointerup", removeEvents);
    //   this.removeEventListener("pointermove", pointerMove);
    // }
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
            const dragEl = workingRef !== undefined && !!workingRef.current
                ? workingRef.current
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
        // document.removeEventListener("pointermove", pointerMove);
        moveItem(dragState, identifier);
        setTimeout(() => {
            var _a;
            (_a = document.getElementById("clone")) === null || _a === void 0 ? void 0 : _a.remove();
        }, delayMS);
        dispatchDragState({
            type: "drop",
        });
    };
    const pointerDown = (e) => {
        if (e.pointerType === "touch" && !timeout.current && dragStateRef.current) {
            // e.preventDefault()
            timeout.current = setTimeout(() => {
                e.preventDefault();
                // (e.target as HTMLElement).releasePointerCapture(e.pointerId);
                timeout.current = null;
                console.log("should start dragging here");
                console.log(dragStateRef.current);
                console.log(onDragStart);
                // onDragStart(e as unknown as React.DragEvent<HTMLElement>);
            }, 500);
        }
    };
    const pointerUp = (e) => {
        var _a;
        if (timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = null;
            const clickEvent = new MouseEvent('click', { bubbles: true });
            (_a = e.target) === null || _a === void 0 ? void 0 : _a.dispatchEvent(clickEvent);
            // console.log("test")
            // const clickEvent = new MouseEvent('click', { button: 0});
            // e.target.dispatchEvent(clickEvent);
        } // else if (dragState.isDragging) {
        // onDragEnd(e as unknown as React.DragEvent<HTMLElement>);
        // }
    };
    const pointerMove = (e) => {
        if (timeout.current) {
            console.log("should scroll", e.movementX, e.movementY);
            clearTimeout(timeout.current);
            timeout.current = null;
            // window.scroll( e.movementX, e.movementY)
            // document.documentElement.scrollBy(-e.movementX, -e.movementY)
        }
        if (e.pointerType === "touch" && dragStateRef.current && !dragStateRef.current.isDragging) {
            console.log("should scroll here");
            window.scrollBy(-e.movementX * 4, -e.movementY * 4);
        }
    };
    const touchStart = (e) => {
        e.preventDefault();
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
    // const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    //   if (dragState.isDragging) {
    //     onDragOver(e as unknown as React.DragEvent<HTMLElement>);
    //   }
    // };
    (0, react_1.useEffect)(() => {
        if (workingRef.current) {
            console.log("added event");
            workingRef.current.addEventListener('pointerdown', pointerDown, { passive: false });
            workingRef.current.addEventListener('pointerup', pointerUp, { passive: false });
            workingRef.current.addEventListener('pointermove', pointerMove, { passive: false });
            workingRef.current.addEventListener('touchstart', touchStart, { passive: false });
        }
        return () => {
            if (workingRef.current) {
                console.log("removed event");
                workingRef.current.removeEventListener('pointerdown', pointerDown);
                workingRef.current.removeEventListener('pointerup', pointerUp);
                workingRef.current.removeEventListener('pointermove', pointerMove);
                workingRef.current.removeEventListener('touchstart', touchStart);
            }
        };
    }, []);
    return {
        draggable: true,
        onDragStart,
        onDrag,
        onDragOver,
        onDragEnd,
        // onPointerDown,
        // onTouchStart,
        // onPointerMoveCapture,
        // onTouchEnd,
        // onPointerMove,
        ref: workingRef
    };
}
exports.useDrag = useDrag;
//# sourceMappingURL=use-drag.js.map