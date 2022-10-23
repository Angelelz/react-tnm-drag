"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createDragElementHook_1 = __importDefault(require("../helpers/createDragElementHook"));
const use_animation_sync_1 = __importDefault(require("./use-animation-sync"));
function useAnotherDrag(options) {
    // const [dragState, dragDispatch] = useReducer(
    //   dragReducer(options),
    //   initialDragState(options)
    // );
    // console.table(options.elementArray)
    const animationSync = (0, use_animation_sync_1.default)(options);
    const useDragElement = (0, createDragElementHook_1.default)(
    // dragState,
    // dragDispatch,
    options.elementArray, animationSync);
    return {
        dragState: animationSync.dragState.current,
        dragDispatch: animationSync.dragDispatch,
        useDragElement,
    };
}
exports.default = useAnotherDrag;
//# sourceMappingURL=use-drag.js.map