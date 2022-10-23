import { useCallback, useRef } from "react";
import { animateTranslation } from "../helpers/helpers";
import { Direction, NoS } from "../types/types";


export default function useAnimationSync() {
  const internalState = useRef<{
    timeout: number | null,
    animatedTarget: {
      id: NoS,
      index: number,
    } | null,
    elements: Set<{
      index: number,
      element: React.RefObject<HTMLElement>
    }>,
    
  }>({
    timeout: null,
    animatedTarget: null,
    elements: new Set<{index: number, element: React.RefObject<HTMLElement>}>()
  })
  
  const Animate = useCallback((source: number, target: number, direction: Direction, delay: number) => {
    
    internalState.current.elements.forEach((element) => {
      const shouldAnimate = element.index <= Math.max(source, target)
          && element.index >= Math.min(source, target);
      
      if (shouldAnimate) {
        const forward = element.index <= source;
        animateTranslation(element.element.current!, direction, delay, forward)
      }

    })
  }, []);
  const Register = useCallback(<R extends HTMLElement>(index: number, element: React.RefObject<R>) => {
    const el = {
      index,
      element
    }
    internalState.current.elements.add(el)
    return () => {
      internalState.current.elements.delete(el)
    };
  }, [])

  const SetTimeout = useCallback((callback: () => void, delay: number) => {
    if (internalState.current.timeout !== null) {
      clearTimeout(internalState.current.timeout)
    }
    internalState.current.timeout = setTimeout(() => {
      callback();
      internalState.current.timeout = null;
      internalState.current.animatedTarget = null
    }, delay);
  }, [])

  const SetTarget = useCallback((id: NoS, index: number) => {
    internalState.current.animatedTarget = {id, index}
  }, [])

  const IsDifferentTarget = useCallback((id: NoS, index: number) => {
    return id !== internalState.current.animatedTarget?.id && index !== internalState.current.animatedTarget?.index
  }, [])

  return {Animate, Register, SetTimeout, SetTarget, IsDifferentTarget}
}