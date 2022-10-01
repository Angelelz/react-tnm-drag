# React Touch N Mouse Drag

## Package to allow easy drag and drop of React components with full type anotation
[Github page](https://github.com/Angelelz/react-tnm-drag)

### Installation

```
npm install react-tnm-drag
```

### Usage
```typescript
import { useDragReducer, useDrag, useDragContainer } from 'react-tnm-drag'

const { dragState, dragReducer } = useDragReducer(
  "number",         // [Required] string with the item.id type (either "number" or "string")
  "number",         // string with the container identifier type (If there are several arrays)
  "string"          // string with the container of the container identifier type (If there are several arrays of arrays)
)

const propsForDraggableItem = useDrag(
  dragState,        // [Required] Comes from useDragReducer
  dragReducer,      // [Required] Comes from useDragReducer
  item.id,          // [Required] identifier (Should be the type as the first parameter of useDragReducer)
  index,            // [Required] Array index of the item
  performMovement,  // [Required] Function you give to actually move the item in the array probably with some array.splice()
  "horizontal",     // string with the direction of the list (Defaults to "vertical")
  desapearDelay,    // ms after dropping until the dragged item will dissapear (Defaults to 0)
  ref               // React.refObject from the component (Will be created internally if not provided)
)

const propsForContainer = useDragContainer(
  "oneContainer",   // [Required] string stating which container this function is for (either "oneContainer", "firstContainer" or "secondContainer")
  dragState,        // [Required] Comes from useDragReducer
  dragReducer,      // [Required] Comes from useDragReducer
  container.id,     // [Required] identifier (Should be the type as the first parameter of useDragReducer)
  index,            // [Required] Array index of the item
)

```

See the example [react project] for more details (Coming soon)