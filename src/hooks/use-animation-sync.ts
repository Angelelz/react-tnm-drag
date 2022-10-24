import { useCallback, useRef, useState } from "react";
import dragReducer from "../helpers/drag-reducer";
import {
  animateAndRemoveClone,
  animateTranslation,
  initialDragState,
} from "../helpers/helpers";
import {
  Direction,
  DispatchDragObject,
  DragOptions,
  DragState,
  NoS,
} from "../types/types";

export default function useAnimationSync<El>(options: DragOptions<El>) {
  const internalState = useRef<{
    timeout: number | null;
    animatedTarget: {
      id: NoS;
      index: number;
    } | null;
    elements: Set<{
      index: number;
      element: React.RefObject<HTMLElement>;
    }>;
    dragState: React.MutableRefObject<DragState<typeof options>>;
  }>({
    timeout: null,
    animatedTarget: null,
    elements: new Set<{
      index: number;
      element: React.RefObject<HTMLElement>;
    }>(),
    dragState: useRef<DragState<typeof options>>(initialDragState(options)),
  });

  const [, render] = useState(false);

  const reRender = useCallback(() => render((r) => !r), []);

  const RunAfterTimer = new Set<() => void>();

  const DragReducer = useCallback(dragReducer(options), []);

  const Animate = useCallback(
    (source: number, target: number, direction: Direction, delay: number) => {
      internalState.current.elements.forEach((element) => {
        const shouldAnimate =
          element.index <= Math.max(source, target) &&
          element.index >= Math.min(source, target);

        if (shouldAnimate) {
          const forward = element.index <= source;
          animateTranslation(
            element.element.current!,
            direction,
            delay,
            forward
          );
        }
      });
    },
    []
  );
  const Register = useCallback(
    <R extends HTMLElement>(index: number, element: React.RefObject<R>) => {
      const el = {
        index,
        element,
      };
      internalState.current.elements.add(el);
      return () => {
        internalState.current.elements.delete(el);
      };
    },
    []
  );

  const SetTimeout = useCallback((callback: () => void, delay: number) => {
    if (internalState.current.timeout !== null) {
      clearTimeout(internalState.current.timeout);
    }
    internalState.current.timeout = setTimeout(() => {
      callback();
      internalState.current.timeout = null;
      internalState.current.animatedTarget = null;
      setTimeout(() => {
        RunAfterTimer.forEach((func) => {
          func();
          RunAfterTimer.delete(func);
        });
      });
    }, delay);
  }, []);

  const SetTarget = useCallback((id: NoS, index: number) => {
    internalState.current.animatedTarget = { id, index };
  }, []);

  const IsDifferentTarget = useCallback((id: NoS, index: number) => {
    return (
      id !== internalState.current.animatedTarget?.id &&
      index !== internalState.current.animatedTarget?.index
    );
  }, []);

  const dragDispatch = useCallback(
    (
      dragObject: DispatchDragObject<typeof options>,
      delay?: number,
      ref?: React.RefObject<HTMLElement>
    ) => {
      const callback = () => {
        if (dragObject.type === "drop") animateAndRemoveClone(delay!, ref);
        internalState.current.dragState.current = DragReducer(
          internalState.current.dragState.current,
          dragObject
        );
        reRender();
      };
      if (dragObject.type === "drop" && internalState.current.timeout) {
        RunAfterTimer.add(callback);
      } else {
        callback();
      }
    },
    []
  );

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
  };
}
