"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalWidth = exports.getTotalHeight = exports.resetStyles = exports.animateTranslateBackwards = exports.animateTranslateForward = exports.createEventLike = exports.createCloneAndStartDrag = exports.scroller = exports.doScroll = exports.followPointer = exports.draggingOver = exports.removeAndAnimateClone = exports.isReactEv = exports.isTouchEv = exports.initialDragState = exports.emptyElement = exports.isDragStateTwoContainers = exports.isDragStateOneContainer = exports.isSecondaryContainerDispatchObj = exports.isPrimaryContainerDispatchObj = exports.isTargetDispatchObj = exports.isSourceDispatchObj = void 0;
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
function isDragStateOneContainer(obj) {
    return "containerNumber" in obj && obj.containerNumber === 1;
}
exports.isDragStateOneContainer = isDragStateOneContainer;
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
        identifier: null,
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
exports.isTouchEv = isTouchEv;
const isReactEv = (e) => {
    return e.nativeEvent !== undefined;
};
exports.isReactEv = isReactEv;
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
function draggingOver(dragState, workingRef, e, direction, identifier, dispatchDragState, index, setArray, array, internalRef, animationTimeout) {
    if (dragState.isDragging) {
        const mms = 100;
        const shouldBeLess = dragState.sourceItem.index < index;
        if (index !== dragState.sourceItem.index &&
            animationTimeout.current === null) {
            const element = array.splice(dragState.sourceItem.index, 1)[0];
            array.splice(index, 0, element);
            shouldBeLess
                ? animateTranslateBackwards(workingRef.current, direction, mms)
                : animateTranslateForward(workingRef.current, direction, mms);
            animationTimeout.current = setTimeout(() => {
                animationTimeout.current = null;
                dispatchDragState({
                    type: "overItem",
                    payload: {
                        identifier,
                        index: shouldBeLess ? index - 1 : index + 1,
                        newSourceIndex: index,
                    },
                });
                setArray(array);
                resetStyles(workingRef.current, internalRef.initialStyle);
            }, mms - 20);
        }
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
exports.scroller = scroller;
function createCloneAndStartDrag(workingRef, e, direction, dispatchDragState, identifier, index) {
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
exports.createCloneAndStartDrag = createCloneAndStartDrag;
function createEventLike(e) {
    const ev = {
        clientX: (0, exports.isTouchEv)(e) ? e.touches[0].clientX : e.clientX,
        clientY: (0, exports.isTouchEv)(e) ? e.touches[0].clientY : e.clientY,
        nativeEvent: (0, exports.isReactEv)(e) ? e.nativeEvent : undefined,
        pageX: (0, exports.isTouchEv)(e) ? e.touches[0].pageX : e.pageX,
        pageY: (0, exports.isTouchEv)(e) ? e.touches[0].pageY : e.pageY,
        screenX: (0, exports.isTouchEv)(e) ? e.touches[0].screenX : e.screenX,
        screenY: (0, exports.isTouchEv)(e) ? e.touches[0].screenY : e.screenY,
        preventDefault: e.preventDefault,
        target: e.target,
        type: e.type,
    };
    return ev;
}
exports.createEventLike = createEventLike;
function animateTranslateForward(el, direction, ms) {
    const translationPixels = direction === "vertical"
        ? `0px ${getTotalHeight(el)}px`
        : `${getTotalWidth(el)}px`;
    el.style.transition = "translate " + ms / 1000 + "s linear";
    el.style.translate = translationPixels;
}
exports.animateTranslateForward = animateTranslateForward;
function animateTranslateBackwards(el, direction, ms) {
    const translationPixels = direction === "vertical"
        ? `0px ${-getTotalHeight(el)}px`
        : `${-getTotalWidth(el)}px`;
    el.style.transition = "translate " + ms / 1000 + "s linear";
    el.style.translate = translationPixels;
}
exports.animateTranslateBackwards = animateTranslateBackwards;
function resetStyles(el, initialStyle) {
    el.style.transition = initialStyle.transition;
    el.style.translate = initialStyle.translate;
    el.style.opacity = initialStyle.opacity;
}
exports.resetStyles = resetStyles;
function getTotalHeight(el) {
    const elStyle = window.getComputedStyle(el);
    const marginHeight = parseFloat(elStyle.marginTop) + parseFloat(elStyle.marginBottom);
    return el.getBoundingClientRect().height + marginHeight;
}
exports.getTotalHeight = getTotalHeight;
function getTotalWidth(el) {
    const elStyle = window.getComputedStyle(el);
    const marginWidth = parseFloat(elStyle.marginLeft) + parseFloat(elStyle.marginRight);
    return el.getBoundingClientRect().width + marginWidth;
}
exports.getTotalWidth = getTotalWidth;
//# sourceMappingURL=helpers.js.map