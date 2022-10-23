import { useReducer } from "react";
import dragReducer from "../helpers/drag-reducer";
import { initialDragState } from "../helpers/helpers";
import { DragOptions, UseDrag } from "../types/types";
import createDragElementHook from "../helpers/createDragElementHook";
import useAnimationSync from "./use-animation-sync";

function useAnotherDrag<El>(options: DragOptions<El>): UseDrag<El> {
  const [dragState, dragDispatch] = useReducer(
    dragReducer(options),
    initialDragState(options)
  );
  // console.table(options.elementArray)

  const animationSync = useAnimationSync();

  const useDragElement = createDragElementHook(
    dragState,
    dragDispatch,
    options.elementArray,
    animationSync
  );

  return {
    dragState,
    dragDispatch,
    useDragElement,
  };
}

export default useAnotherDrag;
