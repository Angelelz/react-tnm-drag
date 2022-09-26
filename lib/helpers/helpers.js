"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInitialValue = exports.initialValue = exports.initialDragState = exports.defaultParamFromTypeName = exports.defaultParam = exports.emptyElement = exports.isTwoContainersDispatchObj = exports.isOneContainerDispatchObj = exports.isTargetDispatchObj = exports.isSourceDispatchObj = void 0;
function isSourceDispatchObj(obj) {
    return obj.type === "sourceItem";
}
exports.isSourceDispatchObj = isSourceDispatchObj;
function isTargetDispatchObj(obj) {
    return obj.type === "overItem";
}
exports.isTargetDispatchObj = isTargetDispatchObj;
function isOneContainerDispatchObj(obj) {
    return obj.type === "target1Enter" || obj.type === "target1Leave";
}
exports.isOneContainerDispatchObj = isOneContainerDispatchObj;
function isTwoContainersDispatchObj(obj) {
    return obj.type === "target2Enter" || obj.type === "target2Leave";
}
exports.isTwoContainersDispatchObj = isTwoContainersDispatchObj;
exports.emptyElement = {
    element: document.createElement("span"),
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
};
const defaultParam = (n) => {
    return (typeof n === "number" ? NaN : "");
};
exports.defaultParam = defaultParam;
const defaultParamFromTypeName = (n) => {
    return (n === "number" ? (0, exports.defaultParam)(1) : (0, exports.defaultParam)(""));
};
exports.defaultParamFromTypeName = defaultParamFromTypeName;
const initialDragState = (l, m, n) => {
    const initialL = (0, exports.defaultParamFromTypeName)(l);
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
            element: exports.emptyElement,
            isDragging: false,
        };
        return initialState;
    }
    if (m && n === undefined) {
        const initialM = (0, exports.defaultParamFromTypeName)(m);
        const initialState = Object.assign(Object.assign({}, (0, exports.initialDragState)(l)), { target1: {
                identifier: initialM,
                index: NaN,
            }, lastTarget1: {
                identifier: initialM,
                index: NaN,
            } });
        return initialState;
    }
    const initialN = (0, exports.defaultParamFromTypeName)(n);
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
exports.initialValue = initialValue;
const isInitialValue = (value) => {
    return value === (0, exports.initialValue)(value);
};
exports.isInitialValue = isInitialValue;
//# sourceMappingURL=helpers.js.map