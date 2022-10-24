import { DragOptions, UseDrag } from "../types/types";
import createDragElementHook from "../helpers/createDragElementHook";
import useAnimationSync from "./use-animation-sync";

function useAnotherDrag<El>(options: DragOptions<El>) {
  const animationSync = useAnimationSync(options);

  const useDragElement = createDragElementHook(
    options.elementArray,
    animationSync
  );

  return {
    dragState: animationSync.dragState.current,
    dragDispatch: animationSync.dragDispatch,
    useDragElement,
  };
}

export default useAnotherDrag;
