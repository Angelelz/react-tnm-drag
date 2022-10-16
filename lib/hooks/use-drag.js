"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnotherDrag = void 0;
const react_1 = require("react");
const drag_reducer_1 = __importDefault(require("../helpers/drag-reducer"));
const helpers_1 = require("../helpers/helpers");
const createDragElementHook_1 = __importDefault(require("../helpers/createDragElementHook"));
function useAnotherDrag(options) {
    const [dragState, dragDispatch] = (0, react_1.useReducer)((0, drag_reducer_1.default)(options), (0, helpers_1.initialDragState)(options));
    const animationTimeout = (0, react_1.useRef)(null);
    const useDragElement = (0, createDragElementHook_1.default)(dragState, dragDispatch, options.elementArray, animationTimeout);
    return {
        dragState,
        dragDispatch,
        useDragElement,
    };
}
exports.useAnotherDrag = useAnotherDrag;
exports.default = useAnotherDrag;
//# sourceMappingURL=use-drag.js.map