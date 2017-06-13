## Drag & Drop in QBUI

Qbui uses the powerful [React DnD](https://react-dnd.github.io/react-dnd/) library to create drag and drop functionality in the UI. 
Familiarizing yourself with the API may be helpful if you need to add additional functionality to the DnD features or modify
the behavior of one of the base components.

A useful article that outlines the basics philosophy of React DnD is available at https://medium.com/@dan_abramov/the-future-of-drag-and-drop-apis-249dfea7a15f

### Recommendations (Learning from past mistakes)

Initially, when doing our first feature with Drag & Drop (Form Builder), we started with a top-level component that
was connected to a redux store and passed props down to the draggable components. These props included methods that
handled the drag and drop behavior. This pattern followed many of the available examples, but overall it caused problems.

1. The methods that handled drag and drop had many arguments to account for the various states a component might be in while dragging.
2. The entire chain of components, from the top level down to the draggable component, had a lot of knowledge about the data types
and structure for the draggable items. This was necessary to pass the correct props back up to the top-level parent component.
3. It was difficult to make modifications to the behavior without touching every component in the change. Extending or modifying
behavior was difficult.
4. Creating special cases was almost impossible without odd hacks. If one item in a list needed to be different, it was hard to intercept
the methods in time to redirect the behavior.
5. Testing was difficult and required extensive mocking.
6. QbForm was very tied to FormBuilder functionality as many props were passed through QbForm to the draggable elements.

Due to the problems outlined above, we refactored the drag and drop functionality to allow draggable elements to be connected to the store.
This way, the behavior of a draggable element was defined close to the implementation of that element. This approach solved many of 
the problems outlined above.

Therefore, we recommend following a pattern in which there are a few layers of composable components that create a draggable or
droppable element.

- A base component that only contains the visual display of the element. It may have props that could modify those visuals when dragging 
over hovering over a drop element.
- A middle component that uses the React DnD higher order components to create a draggable or droppable element. This middle
 component can expose the appropriate drag and drop events as props. This middle layer is needed because the higher order component will
 not have access to all the props or state during drag and drop. If those props are instead passed from a higher component, then it works.
- A top component that is connected to the redux store that can pass actions (or potentially state) to the lower level components. If actions
and state are at this level, it is trivial to pass things to the draggable or droppable elements.

The elements in the reusable library consist of base and middle layers; although developers are encouraged to create base or 
middle layers that meet the unique needs of their features if these elements do not have the required functionality.

### Setting up Drag & Drop for a new feature

> A top level draggable component is a component that is, typically, connected to the store. More importantly it has methods
that defined the behavior (actions/state changes) that occur during dragging, hovering, and dropping. See "Recommendations"
above for more info.

1. Create a top level component that includes all areas where elements will be dragged and dropped. (Example: FormBuilderContainer)
    - `import {DragDropContext} from 'react-dnd';` and `import TouchBackend from 'react-dnd-touch-backend';` at the top of the file
    - Export the React element as a DragDropContext: `DragDropContext(TouchBackend({enableMouseEvents: true, delay: 30}))(YourReactElement);`
    - Be sure to use the TouchBackend as we need to support touch devices (not necessarily small breakpoint, e.g., Surface Pro)
    - If you want tokens to be displayed during dragging, use the `<BuilderCustomDragLayer />` inside your component.
        - You may need to extend the types in the `renderItem` method to determine the icon and text of the field token.

2. The current XD specs have a left panel with a list of elements that can be dragged onto the main area. (Example: NewFieldsMenu)
    - Create a <ListOFElements> that will hold all of the elements
    - Pass in your top level draggable component as the `renderer` (prop)
    - In the array of elements, you can specify an `alternateRenderer` on the child elements if a particular item
    has different behavior than other elements in the list. This `alternateRenderer` should also be a top level draggable component.
    - Reusable tokens that match XD specs have been placed in the `dragAndDrop/elementToken` directory. See #4 below.
    
3. In many cases, the items in the main area will be both draggable and drop targets. You can use the `DragAndDropElement` HOC to 
quickly build elements that have both drag and drop behavior. You should pass your top-level drag or drop component into this HOC.

4. The `elementToken` directory contains base level tokens that can be used for dragging or in menus.
    - The `ElementToken` is the base level component with only visual styling for the token.
    - The `TokenInMenu` uses `ElementToken`, but adds some additional styles and props for use as a token in a menu.
    - The `DraggableTokenInMenu` is a middle-level draggable component (see description under "Recommendations"). It exposes the 
    appropriate methods and props for a token that will be dragged from the menu onto the main area. You will need to create a 
    top-level draggable token that contains the correct actions/state based on the behavior required for your implementation.

### Common Methods for Drag/Drop Components

These methods are defined as PropTypes on `DraggableElement` and `DroppableElement`.

- `beginDrag` - Method called as soon as the element starts dragging.

- `endDrag` - Method called when the element is dropped. Recommend to use this method rather than the React DnD `drop` method especially
for methods that will cause state changes.

- `checkIsDragging` - Method that determines whether an element is in a 'dragging' state. Allows you to add styles to an element
that is dragging. The method should return a boolean value. Alternatively, you can pass through an `id` prop. If you do not specify
a `checkIsDragging` method, but do specify an `id`, then the `DraggableElement` will consider an element to be dragging if its `id` matches
the `id` of the item currently being dragged.

- `onHover` - Method that is called whenever a draggable item hovers over a droppable target. This can be defined on either the 
`DraggableElement` or `DroppableElement`. The method receives two arguments, the props of the current droppable target (first argument) and
the props of the currently dragging element (second argument). Beware! The draggable elements props are those at the time the element started 
dragging and does not reflect changes since that time. Another reason we use a top level draggable component is so the methods on that component 
have access to the most up to date props through `this.props`.

