"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.animateTranslation = exports.createEventLike = exports.createCloneAndStartDrag = exports.doScroll = exports.followPointer = exports.draggingOver = exports.removeAndAnimateClone = exports.initialDragState = exports.emptyElement = exports.isDragStateTwoContainers = exports.isSecondaryContainerDispatchObj = exports.isPrimaryContainerDispatchObj = exports.isTargetDispatchObj = exports.isSourceDispatchObj = void 0;
function isSourceDispatchObj(objA) {
    return objA.type === "sourceItem";
}
exports.isSourceDispatchObj = isSourceDispatchObj;
function isTargetDispatchObj(obj) {
    return obj.type === "overItem";
}
exports.isTargetDispatchObj = isTargetDispatchObj;
function isPrimaryContainerDispatchObj(obj) {
    return (obj.type === "primaryContainerEnter" || obj.type === "primaryContainerLeave");
}
exports.isPrimaryContainerDispatchObj = isPrimaryContainerDispatchObj;
function isSecondaryContainerDispatchObj(obj) {
    return (obj.type === "secondaryContainerEnter" ||
        obj.type === "secondaryContainerLeave");
}
exports.isSecondaryContainerDispatchObj = isSecondaryContainerDispatchObj;
function isDragStateTwoContainers(obj) {
    return "containerNumber" in obj && obj.containerNumber === 2;
}
exports.isDragStateTwoContainers = isDragStateTwoContainers;
exports.emptyElement = typeof document !== "undefined"
    ? {
        element: document.createElement("span"),
        x: 0,
        y: 0,
        offsetX: 0,
        offsetY: 0,
    }
    : {};
const initialDragState = (options) => {
    const nullItem = {
        id: null,
        index: null,
    };
    const dragStateSimple = {
        element: exports.emptyElement,
        isDragging: false,
        lastTargetItem: nullItem,
        sourceItem: nullItem,
        targetItem: nullItem,
    };
    if (!("containerNumber" in options)) {
        return dragStateSimple;
    }
    const dragStateOneContainer = Object.assign(Object.assign({}, dragStateSimple), { containerNumber: 1, primaryContainer: nullItem, lastPrimaryContainer: nullItem });
    if (options.containerNumber === 1) {
        return dragStateOneContainer;
    }
    return Object.assign(Object.assign({}, dragStateOneContainer), { containerNumber: 2, secondaryContainer: nullItem, lastSecondaryContainer: nullItem });
};
exports.initialDragState = initialDragState;
const isTouchEv = (e) => {
    return e.touches !== undefined;
};
const isReactEv = (e) => {
    return e.nativeEvent !== undefined;
};
function removeAndAnimateClone(ms, ref) {
    const el = document.getElementById("clone");
    if (ref && ref.current && el) {
        ref.current.style.transition = `opacity ${ms / 2000}s linear ${ms / 2000}s`;
        ref.current.style.opacity = "";
        const targetRect = ref.current.getBoundingClientRect();
        const rect = el.getBoundingClientRect();
        const top = targetRect.top + window.scrollY;
        const left = targetRect.left + window.scrollX;
        el.style.transition = `top ${ms / 2000}s ease-in-out, left ${ms / 2000}s ease-in-out, opacity ${ms / 2000}s linear ${ms / 2000}s`;
        el.style.top = `${Math.floor(top)}px`;
        el.style.left = `${Math.floor(left)}px`;
        el.style.opacity = "0";
    }
    setTimeout(() => {
        const elements = document.querySelectorAll("[id='clone']");
        if (ref && ref.current)
            ref.current.style.transition = "";
        if (elements.length > 0) {
            elements.forEach((element) => {
                element.remove();
            });
        }
    }, ms);
}
exports.removeAndAnimateClone = removeAndAnimateClone;
function draggingOver(dragState, workingRef, e, direction, dispatchDragState, setArray, array, internalRef, delayMS, animationSync, id, index) {
    const realIndex = index !== null && index !== void 0 ? index : internalRef.index;
    const realId = id !== null && id !== void 0 ? id : internalRef.id;
    if (dragState.isDragging &&
        dragState.sourceItem.id !== realId &&
        animationSync.IsDifferentTarget(realId, realIndex)) {
        // console.log(internalRef);
        // animationSync.animatedTarget = { id: realId, index: realIndex };
        const shouldBeLess = dragState.sourceItem.index < realIndex;
        // if (animationSync.timeout) {
        //   console.log(animationSync.timeout)
        //   clearTimeout(animationSync.timeout);
        // }
        animationSync.SetTarget(realId, realIndex);
        animationSync.SetTimeout(() => {
            const workingArray = [...array];
            const element = workingArray.splice(dragState.sourceItem.index, 1)[0];
            workingArray.splice(realIndex, 0, element);
            setArray(workingArray);
            dispatchDragState({
                type: "overItem",
                payload: {
                    id: realId,
                    index: shouldBeLess ? realIndex - 1 : realIndex + 1,
                    newSourceIndex: realIndex,
                },
            });
            resetStyles(workingRef.current, internalRef.initialStyle);
        }, delayMS * 1.2);
        animationSync.Animate(dragState.sourceItem.index, realIndex, direction, delayMS);
    }
}
exports.draggingOver = draggingOver;
function followPointer(dragState, e) {
    const el = document.getElementById("clone");
    if (el && dragState && dragState.element.offsetY !== 0) {
        if (e.type !== "touchmove")
            e.preventDefault();
        if (e.pageY - dragState.element.offsetY > 0) {
            el.style.top = `${e.pageY - dragState.element.offsetY}px`;
        }
        if (e.pageX - dragState.element.offsetX > 0) {
            el.style.left = `${e.pageX - dragState.element.offsetX}px`;
        }
    }
}
exports.followPointer = followPointer;
function doScroll(mousePosition) {
    if (mousePosition) {
        if (mousePosition.x > document.documentElement.clientWidth - 40)
            scroller("right");
        if (mousePosition.x < 40)
            scroller("left");
        if (mousePosition.y > document.documentElement.clientHeight - 40)
            scroller("down");
        if (mousePosition.y < 40)
            scroller("up");
    }
}
exports.doScroll = doScroll;
function scroller(direction) {
    switch (direction) {
        case "up":
            if (window.scrollY >= 60) {
                window.scrollBy({ left: 0, top: -60, behavior: "smooth" });
            }
            break;
        case "down":
            if (window.scrollY + document.documentElement.clientHeight <=
                document.body.scrollHeight - 60) {
                window.scrollBy({ left: 0, top: 60, behavior: "smooth" });
            }
            break;
        case "left":
            if (window.scrollX >= 60) {
                window.scrollBy({ left: -60, top: 0, behavior: "smooth" });
            }
            break;
        case "right":
            if (window.scrollX + document.documentElement.clientWidth <=
                document.body.scrollWidth) {
                window.scrollBy({ left: 60, top: 0, behavior: "smooth" });
            }
            break;
    }
}
function createCloneAndStartDrag(workingRef, e, direction, dispatchDragState, id, index) {
    const dragEl = workingRef !== undefined && !!workingRef.current
        ? workingRef.current
        : e.target;
    const boundingRect = dragEl.getBoundingClientRect();
    const size = direction === "vertical" ? getTotalHeight(dragEl) : getTotalWidth(dragEl);
    document.documentElement.style.setProperty("--pix", size + "px");
    const clonedEl = dragEl.cloneNode(true);
    clonedEl.id = "clone";
    clonedEl.style.position = "absolute";
    clonedEl.style.top = boundingRect.y + (e.pageY - e.clientY) + "px";
    clonedEl.style.left = boundingRect.x + (e.pageX - e.clientX) + "px";
    clonedEl.style.width = `${boundingRect.width}px`;
    clonedEl.style.height = `${boundingRect.height}px`;
    clonedEl.style.zIndex = "2000";
    clonedEl.style.pointerEvents = "none";
    clonedEl.style.margin = "0px";
    document.body.appendChild(clonedEl);
    dispatchDragState({
        type: "sourceItem",
        payload: {
            id,
            index,
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
exports.createCloneAndStartDrag = createCloneAndStartDrag;
function createEventLike(e) {
    const ev = {
        clientX: isTouchEv(e) ? e.touches[0].clientX : e.clientX,
        clientY: isTouchEv(e) ? e.touches[0].clientY : e.clientY,
        nativeEvent: isReactEv(e) ? e.nativeEvent : undefined,
        pageX: isTouchEv(e) ? e.touches[0].pageX : e.pageX,
        pageY: isTouchEv(e) ? e.touches[0].pageY : e.pageY,
        screenX: isTouchEv(e) ? e.touches[0].screenX : e.screenX,
        screenY: isTouchEv(e) ? e.touches[0].screenY : e.screenY,
        preventDefault: e.preventDefault,
        target: e.target,
        type: e.type,
    };
    return ev;
}
exports.createEventLike = createEventLike;
function animateTranslation(el, direction, ms, forward) {
    const translationPixels = direction === "vertical"
        ? `0px ${forward ? getTotalHeight(el) : -getTotalHeight(el)}px`
        : `${forward ? getTotalWidth(el) : -getTotalWidth(el)}px`;
    el.style.transition = "translate " + ms / 1000 + "s linear";
    el.style.translate = translationPixels;
}
exports.animateTranslation = animateTranslation;
function resetStyles(el, initialStyle) {
    el.style.transition = initialStyle.transition;
    el.style.translate = initialStyle.translate;
    el.style.opacity = initialStyle.opacity;
}
function getTotalHeight(el) {
    const elStyle = window.getComputedStyle(el);
    const marginHeight = parseFloat(elStyle.marginTop) + parseFloat(elStyle.marginBottom);
    return el.getBoundingClientRect().height + marginHeight;
}
function getTotalWidth(el) {
    const elStyle = window.getComputedStyle(el);
    const marginWidth = parseFloat(elStyle.marginLeft) + parseFloat(elStyle.marginRight);
    return el.getBoundingClientRect().width + marginWidth;
}
//# sourceMappingURL=helpers.js.map