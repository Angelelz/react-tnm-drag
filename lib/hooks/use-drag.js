"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const drag_reducer_1 = __importDefault(require("../helpers/drag-reducer"));
const helpers_1 = require("../helpers/helpers");
const createDragElementHook_1 = __importDefault(require("../helpers/createDragElementHook"));
const use_animation_sync_1 = __importDefault(require("./use-animation-sync"));
function useAnotherDrag(options) {
    const [dragState, dragDispatch] = (0, react_1.useReducer)((0, drag_reducer_1.default)(options), (0, helpers_1.initialDragState)(options));
    // console.table(options.elementArray)
    const animationSync = (0, use_animation_sync_1.default)();
    const useDragElement = (0, createDragElementHook_1.default)(dragState, dragDispatch, options.elementArray, animationSync);
    return {
        dragState,
        dragDispatch,
        useDragElement,
    };
}
exports.default = useAnotherDrag;
//# sourceMappingURL=use-drag.js.map