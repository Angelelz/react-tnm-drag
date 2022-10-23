/// <reference types="react" />
import { Direction, NoS } from "../types/types";
export default function useAnimationSync(): {
    Animate: (source: number, target: number, direction: Direction, delay: number) => void;
    Register: <R extends HTMLElement>(index: number, element: import("react").RefObject<R>) => () => void;
    SetTimeout: (callback: () => void, delay: number) => void;
    SetTarget: (id: NoS, index: number) => void;
    IsDifferentTarget: (id: NoS, index: number) => boolean;
    timeout: number | null;
    RunAfterTimer: Set<() => void>;
};
//# sourceMappingURL=use-animation-sync.d.ts.map