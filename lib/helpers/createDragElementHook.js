"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const helpers_1 = require("./helpers");
const createDragElementHook = (
// dragState: DragState<DragOptions<El>>,
// dragDispatch: React.Dispatch<DispatchDragObject<DragOptions<El>>>,
elementArray, GlobalDragStore) => {
    return (id, index, arrayCallback, direction = "vertical", delayMS = 500, ref) => {
        const elementRef = (0, react_1.useRef)(null);
        const internalRef = (0, react_1.useRef)({
            touchTimeout: null,
            scrollTimeout: null,
            mousePosition: null,
            pointerId: null,
            initialStyle: null,
            index,
            id,
        });
        internalRef.current.index = index;
        internalRef.current.id = id;
        const workingRef = ref !== null && ref !== void 0 ? ref : elementRef;
        // useEffect(() => {
        // if (!workingRef.current) {
        // GlobalDragStore.reRender()
        // }
        // }, [])
        (0, react_1.useEffect)(() => {
            // console.log(internalRef.current.initialStyle, workingRef.current);
            if (internalRef.current.initialStyle === null && workingRef.current) {
                internalRef.current.initialStyle = {
                    transition: workingRef.current.style.transition,
                    translate: workingRef.current.style.translate,
                    opacity: workingRef.current.style.opacity,
                };
            }
        }, []);
        if (GlobalDragStore.dragState.current.isDragging &&
            id === GlobalDragStore.dragState.current.sourceItem.id &&
            workingRef.current) {
            workingRef.current.style.pointerEvents = "none";
            workingRef.current.style.opacity = "0";
        }
        else if (workingRef.current) {
            workingRef.current.style.pointerEvents = "";
        }
        if (internalRef.current.initialStyle !== null &&
            id !== GlobalDragStore.dragState.current.targetItem.id) {
            workingRef.current.style.transition =
                internalRef.current.initialStyle.transition;
            workingRef.current.style.translate =
                internalRef.current.initialStyle.translate;
        }
        if (!GlobalDragStore.dragState.current.isDragging &&
            workingRef.current &&
            GlobalDragStore.dragState.current.droppedItem &&
            GlobalDragStore.dragState.current.droppedItem.id === id) {
            workingRef.current.style.opacity = "0";
            setTimeout(() => {
                workingRef.current.style.opacity =
                    internalRef.current.initialStyle.opacity;
            }, delayMS / 2);
        }
        const onDragStart = (e) => {
            // internalRef.current.index = index
            // console.log(internalRef.current.index)
            if (e.dataTransfer) {
                e.dataTransfer.setDragImage(helpers_1.emptyElement.element, 0, 0);
                e.dataTransfer.dropEffect = "copy";
            }
            setTimeout(() => {
                (0, helpers_1.createCloneAndStartDrag)(workingRef, e, direction, GlobalDragStore.dragDispatch, id, index);
            }, 0);
        };
        const onDrag = (e) => {
            (0, helpers_1.followPointer)(GlobalDragStore.dragState.current, (0, helpers_1.createEventLike)(e));
        };
        const onDragOver = (e) => {
            if (e.type !== "touchmove")
                e.preventDefault();
            (0, helpers_1.draggingOver)(GlobalDragStore.dragState.current, workingRef, e, direction, GlobalDragStore.dragDispatch, arrayCallback, elementArray, internalRef.current, delayMS / 2, GlobalDragStore, id, index);
        };
        const onDragEnd = (e) => {
            e.preventDefault();
            // animateAndRemoveClone(delayMS, workingRef);
            GlobalDragStore.dragDispatch({
                type: "drop",
            }, delayMS, workingRef);
        };
        const onPointerDown = (e) => {
            internalRef.current.pointerId = e.pointerId;
            // internalRef.current.index = index;
            // console.log(internalRef.current.index)
        };
        function onPointerMove(e) {
            if (GlobalDragStore.dragState.current &&
                GlobalDragStore.dragState.current.isDragging) {
                // console.log({id, index, currentIndex: internalRef.current.index})
                (0, helpers_1.draggingOver)(GlobalDragStore.dragState.current, workingRef, (0, helpers_1.createEventLike)(e), direction, GlobalDragStore.dragDispatch, arrayCallback, elementArray, internalRef.current, delayMS / 2, GlobalDragStore);
            }
        }
        const onPointerUp = (e) => {
            internalRef.current.pointerId = null;
        };
        const onTouchStart = (e) => {
            internalRef.current.touchTimeout = setTimeout(() => {
                var _a;
                internalRef.current.touchTimeout = null;
                if (GlobalDragStore.dragState.current &&
                    !!onDragStart &&
                    internalRef.current.pointerId) {
                    e.preventDefault();
                    e.target.releasePointerCapture(internalRef.current.pointerId);
                    (0, helpers_1.createCloneAndStartDrag)(workingRef, (0, helpers_1.createEventLike)(e), direction, GlobalDragStore.dragDispatch, id, internalRef.current.index);
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
            else if (e.cancelable && GlobalDragStore.dragState.current) {
                e.preventDefault();
                (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
                internalRef.current.mousePosition = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY,
                };
                (0, helpers_1.followPointer)(GlobalDragStore.dragState.current, (0, helpers_1.createEventLike)(e));
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
            if (GlobalDragStore.dragState.current &&
                GlobalDragStore.dragState.current.isDragging) {
                // rearrangeCallback(internalRef.current.dragStateRef, identifier);
                // animateAndRemoveClone(delayMS, workingRef);
                internalRef.current.mousePosition = null;
                GlobalDragStore.dragDispatch({ type: "drop" }, delayMS, workingRef);
            }
        };
        (0, react_1.useEffect)(() => {
            const unRegister = GlobalDragStore.AnimationSync.Register(index, workingRef);
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
                unRegister();
                if (workingRef.current) {
                    workingRef.current.removeEventListener("pointermove", onPointerMove);
                    workingRef.current.removeEventListener("touchstart", onTouchStart);
                    workingRef.current.removeEventListener("touchmove", onTouchMove);
                }
            };
        });
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