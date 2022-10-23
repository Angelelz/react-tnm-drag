"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const helpers_1 = require("../helpers/helpers");
function useAnimationSync() {
    const internalState = (0, react_1.useRef)({
        timeout: null,
        animatedTarget: null,
        elements: new Set()
    });
    const Animate = (0, react_1.useCallback)((source, target, direction, delay) => {
        internalState.current.elements.forEach((element) => {
            const shouldAnimate = element.index <= Math.max(source, target)
                && element.index >= Math.min(source, target);
            if (shouldAnimate) {
                const forward = element.index <= source;
                (0, helpers_1.animateTranslation)(element.element.current, direction, delay, forward);
            }
        });
    }, []);
    const Register = (0, react_1.useCallback)((index, element) => {
        const el = {
            index,
            element
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
        }, delay);
    }, []);
    const SetTarget = (0, react_1.useCallback)((id, index) => {
        internalState.current.animatedTarget = { id, index };
    }, []);
    const IsDifferentTarget = (0, react_1.useCallback)((id, index) => {
        var _a, _b;
        return id !== ((_a = internalState.current.animatedTarget) === null || _a === void 0 ? void 0 : _a.id) && index !== ((_b = internalState.current.animatedTarget) === null || _b === void 0 ? void 0 : _b.index);
    }, []);
    return { Animate, Register, SetTimeout, SetTarget, IsDifferentTarget };
}
exports.default = useAnimationSync;
//# sourceMappingURL=use-animation-sync.js.map