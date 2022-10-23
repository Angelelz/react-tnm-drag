/// <reference types="react" />
import { Direction, DispatchDragObject, DragOptions, NoS } from "../types/types";
export default function useAnimationSync<El>(options: DragOptions<El>): {
    AnimationSync: {
        Animate: (source: number, target: number, direction: Direction, delay: number) => void;
        Register: <R extends HTMLElement>(index: number, element: import("react").RefObject<R>) => () => void;
        SetTimeout: (callback: () => void, delay: number) => void;
        SetTarget: (id: NoS, index: number) => void;
        IsDifferentTarget: (id: NoS, index: number) => boolean;
    };
    dragState: import("react").MutableRefObject<import("../types/types").DragStateOneContainer<NoS, NoS> | import("../types/types").DragStateTwoContainers<NoS, NoS, NoS> | import("../types/types").DragStateSimple<NoS>>;
    dragDispatch: (dragObject: DispatchDragObject<typeof options>, delay?: number, ref?: React.RefObject<HTMLElement>) => void;
    reRender: () => void;
};
//# sourceMappingURL=use-animation-sync.d.ts.map