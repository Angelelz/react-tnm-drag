import useAnimationSync from "../hooks/use-animation-sync";

export type NoS = number | string;

export type Direction = "vertical" | "horizontal";

export type ElementObject = {
  element: HTMLElement;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
};

export type DragObjIdentifier<T extends NoS> = {
  id: T | null;
  index: number | null;
};

export type DragStateSimple<P extends NoS> = {
  sourceItem: DragObjIdentifier<P>;
  targetItem: DragObjIdentifier<P>;
  lastTargetItem: DragObjIdentifier<P>;
  element: ElementObject;
  isDragging: boolean;
  droppedItem?: { el: HTMLElement; id: P };
};

export interface DragStateOneContainer<P extends NoS, Q extends NoS>
  extends DragStateSimple<P> {
  containerNumber: 1;
  primaryContainer: DragObjIdentifier<Q>;
  lastPrimaryContainer: DragObjIdentifier<Q>;
}

export interface DragStateTwoContainers<
  P extends NoS,
  Q extends NoS,
  R extends NoS
> extends Omit<DragStateOneContainer<P, Q>, "containerNumber"> {
  containerNumber: 2;
  secondaryContainer: DragObjIdentifier<R>;
  lastSecondaryContainer: DragObjIdentifier<R>;
}

export type DragState<
  T extends DragOptions<any>
> = T extends DragOptionsOneContainer<any>
  ? DragStateOneContainer<NoS, NoS>
  : T extends DragOptionsTwoContainers<any>
  ? DragStateTwoContainers<NoS, NoS, NoS>
  : T extends DragOptionsNoContainer<any>
  ? DragStateSimple<NoS>
  : never;

export type DragActionPrimaryContainerEnter = "primaryContainerEnter";
export type DragActionPrimaryContainerLeave = "primaryContainerLeave";
export type DragActionSecondaryContainerEnter = "secondaryContainerEnter";
export type DragActionSecondaryContainerLeave = "secondaryContainerLeave";

export type DragActionsThree =
  | "secondaryContainerEnter"
  | "secondaryContainerLeave";

export interface PayloadSource<P extends NoS> {
  id: P;
  index: number;
  element: ElementObject;
}

export interface PayloadTarget<P extends NoS> {
  id: P;
  index: number;
  newSourceIndex: number;
}

export interface PayloadContainer<Q extends NoS> {
  id: Q;
  index: number;
}

export interface DispatchDragObjectDrop {
  type: "drop";
}

export interface DispatchDragObjectSource<P extends NoS> {
  type: "sourceItem";
  payload: PayloadSource<P>;
}

export interface DispatchDragObjectTarget<P extends NoS> {
  type: "overItem";
  payload: PayloadTarget<P>;
}

export interface DispatchDragObjectPrimaryContainerEnter<P extends NoS> {
  type: DragActionPrimaryContainerEnter;
  payload: PayloadContainer<P>;
}

export interface DispatchDragObjectSecondaryContainerEnter<P extends NoS> {
  type: DragActionSecondaryContainerEnter;
  payload: PayloadContainer<P>;
}

export interface DispatchDragObjectPrimaryContainerLeave {
  type: DragActionPrimaryContainerLeave;
}

export interface DispatchDragObjectSecondaryContainerLeave {
  type: DragActionSecondaryContainerLeave;
}

export type DispatchDragObjectPrimaryContainer<P extends NoS> =
  | DispatchDragObjectPrimaryContainerEnter<P>
  | DispatchDragObjectPrimaryContainerLeave;

export type DispatchDragObjectSecondaryContainer<P extends NoS> =
  | DispatchDragObjectSecondaryContainerEnter<P>
  | DispatchDragObjectSecondaryContainerLeave;

export type DispatchDragObjectSimple<P extends NoS> =
  | DispatchDragObjectDrop
  | DispatchDragObjectSource<P>
  | DispatchDragObjectTarget<P>;

export type DispatchDragObjectOneContainer<P extends NoS, Q extends NoS> =
  | DispatchDragObjectSimple<P>
  | DispatchDragObjectPrimaryContainer<Q>;

export type DispatchDragObjectTwoContainers<
  P extends NoS,
  Q extends NoS,
  R extends NoS
> =
  | DispatchDragObjectOneContainer<P, Q>
  | DispatchDragObjectSecondaryContainer<R>;

export type DispatchDragObject<
  T extends DragOptions<any>
> = T extends DragOptionsOneContainer<any>
  ? DispatchDragObjectOneContainer<NoS, NoS>
  : T extends DragOptionsTwoContainers<any>
  ? DispatchDragObjectTwoContainers<NoS, NoS, NoS>
  : T extends DragOptionsNoContainer<any>
  ? DispatchDragObjectSimple<NoS>
  : never;

export interface DragStateLike<T extends NoS> {
  isDragging: boolean;
  targetItem: DragObjIdentifier<T>;
  sourceItem: DragObjIdentifier<T>;
  element: ElementObject;
}

export interface EventLike {
  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;
  screenX: number;
  screenY: number;
  target: EventTarget | null;
  nativeEvent?: { offsetX: number; offsetY: number };
  type: string;
  preventDefault: () => void;
}

export type DragOptionsNoContainer<El> = { elementArray: El[] }

export type DragOptionsOneContainer<El> = DragOptionsNoContainer<El> & { containerNumber: 1 }

export type DragOptionsTwoContainers<El> = DragOptionsNoContainer<El> & { containerNumber: 2 }

export type DragOptions<El> = DragOptionsTwoContainers<El> | DragOptionsOneContainer<El> | DragOptionsNoContainer<El>

export type DragElementHook = <T extends NoS, R extends HTMLElement>(
  id: T,
  index: number,
  arrayCallback: ArrayCallback<any>,
  direction?: Direction,
  delayMS?: number,
  ref?: React.RefObject<R>
) => DragProps<R>;

export type DragProps<R extends HTMLElement> = {
  draggable: boolean;
  onDragStart: (e: React.DragEvent<HTMLElement>) => void;
  onDrag: (e: React.DragEvent<HTMLElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLElement>) => void;
  onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLElement>) => void;
  onTouchEnd: (e: React.TouchEvent<HTMLElement>) => void;
  ref: React.RefObject<R>;
}

export type UseDrag<El> = {
  dragState: DragState<DragOptions<El>>;
  dragDispatch: React.Dispatch<DispatchDragObject<DragOptions<El>>>;
  useDragElement: DragElementHook;
}

export type ArrayCallback<El> = (elementArray: El[]) => void

export type InternalRef<El> = {
  touchTimeout: number | null;
  scrollTimeout: number | null;
  dragState: DragState<DragOptions<El>>;
  mousePosition: MousePosition | null;
  pointerId: number | null;
  initialStyle: InitialStyle | null;
  index: number;
  id: NoS
}

export type MousePosition = {
  x: number;
  y: number;
}

export type InitialStyle = {
  transition: string,
  translate: string,
  opacity: string,
}

export type ScheduledState = {
  timeout: number,
  sourceIndex: number,
  targetIndex: number,
}

export type AnimationSync = ReturnType<typeof useAnimationSync>