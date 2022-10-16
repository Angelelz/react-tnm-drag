import { useReducer, useRef } from "react";
import dragReducer from "../helpers/drag-reducer";
import { initialDragState } from "../helpers/helpers";
import { DragOptions, UseDrag } from "../types/types";
import createDragElementHook from "../helpers/createDragElementHook";

export function useAnotherDrag<El>(options: DragOptions<El>): UseDrag<El> {
  const [dragState, dragDispatch] = useReducer(
    dragReducer(options),
    initialDragState(options)
  );
  const animationTimeout = useRef<number | null>(null);

  const useDragElement = createDragElementHook(dragState, dragDispatch, options.elementArray, animationTimeout);

  return {
    dragState,
    dragDispatch,
    useDragElement,
  };
}

export default useAnotherDrag;
