"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const drag_reducer_1 = __importDefault(require("../helpers/drag-reducer"));
const helpers_1 = require("../helpers/helpers");
function useAnimationSync(options) {
    const internalState = (0, react_1.useRef)({
        timeout: null,
        animatedTarget: null,
        elements: new Set(),
        dragState: (0, react_1.useRef)((0, helpers_1.initialDragState)(options)),
    });
    const [, render] = (0, react_1.useState)(false);
    const reRender = (0, react_1.useCallback)(() => render(r => !r), []);
    // const RunAfterTimer = new Set<() => void>();
    const DragReducer = (0, react_1.useCallback)((0, drag_reducer_1.default)(options), []);
    const Animate = (0, react_1.useCallback)((source, target, direction, delay) => {
        internalState.current.elements.forEach((element) => {
            const shouldAnimate = element.index <= Math.max(source, target) &&
                element.index >= Math.min(source, target);
            if (shouldAnimate) {
                const forward = element.index <= source;
                (0, helpers_1.animateTranslation)(element.element.current, direction, delay, forward);
            }
        });
    }, []);
    const Register = (0, react_1.useCallback)((index, element) => {
        const el = {
            index,
            element,
        };
        internalState.current.elements.add(el);
        return () => {
            internalState.current.elements.delete(el);
        };
    }, []);
    const SetTimeout = (0, react_1.useCallback)((callback, delay) => {
        if (internalState.current.timeout !== null) {
            clearTimeout(internalState.current.timeout);
        }
        internalState.current.timeout = setTimeout(() => {
            callback();
            internalState.current.timeout = null;
            internalState.current.animatedTarget = null;
            // RunAfterTimer.forEach(func => {
            //   func();
            //   console.log(RunAfterTimer);
            //   RunAfterTimer.delete(func);
            //   console.log(RunAfterTimer);
            // })
        }, delay);
    }, []);
    const SetTarget = (0, react_1.useCallback)((id, index) => {
        internalState.current.animatedTarget = { id, index };
    }, []);
    const IsDifferentTarget = (0, react_1.useCallback)((id, index) => {
        var _a, _b;
        return (id !== ((_a = internalState.current.animatedTarget) === null || _a === void 0 ? void 0 : _a.id) &&
            index !== ((_b = internalState.current.animatedTarget) === null || _b === void 0 ? void 0 : _b.index));
    }, []);
    // useEffect(() => {
    //   reRender()
    // }, [])
    const dragDispatch = (0, react_1.useCallback)((dragObject) => {
        const callback = () => {
            internalState.current.dragState.current = DragReducer(internalState.current.dragState.current, dragObject);
            // console.table(internalState.current.dragState.current)
            reRender();
        };
        // if (dragObject.type === "drop" && internalState.current.timeout) {
        //   RunAfterTimer.add(() => {callback})
        // } else {
        callback();
        // }
    }, []);
    return {
        AnimationSync: {
            Animate,
            Register,
            SetTimeout,
            SetTarget,
            IsDifferentTarget,
        },
        dragState: internalState.current.dragState,
        dragDispatch,
        reRender
    };
}
exports.default = useAnimationSync;
//# sourceMappingURL=use-animation-sync.js.map