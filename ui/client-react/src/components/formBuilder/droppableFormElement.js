import React, {PropTypes, Component} from 'react';
import DraggableItemTypes from './draggableItemTypes';
import {DropTarget} from 'react-dnd';
import {findFormElementKey} from '../../actions/actionHelpers/transformFormData';

/**
 * Describes what happens during drop events. The drop function returns an object that can be accessed in the EndDrag
 * function.
 * Recommended: Don't call actions that may mutate the DOM in the drop function. Instead, return any parameters you
 * might need as an object and call the action in the endDrag function on the draggable component.
 * @type {{drop: ((props, monitor))}}
 */
const formTarget = {
    // drop(props) {
    //     debugger;
    //     return {
    //         location: props.location
    //     };
    // },

    hover(dropTargetProps, monitor) {
        let dragItemProps = monitor.getItem();

        if (dragItemProps.containingElement.id !== dropTargetProps.containingElement.id) {
            let element = dragItemProps.containingElement[findFormElementKey(dragItemProps.containingElement)];
            dropTargetProps.handleFormReorder(dropTargetProps.location, Object.assign({}, dragItemProps, {element}));
        }
        // let {isOver, canDrop, handleFormReorder, location, draggableItem} = props;
        //
        // if (isOver) {
        //     this.reorderTimeout = setTimeout(() => {
        //         let element = draggableItem.containingElement[findFormElementKey(draggableItem.containingElement)];
        //         let draggedItemProps = Object.assign({}, draggableItem, {element});
        //
        //         if (element) {
        //             console.log('REORDER EVENT:');
        //             console.log('LOCATION:', location);
        //             console.log('draggedItem', draggedItemProps);
        //             handleFormReorder(location, draggedItemProps);
        //         }
        //     }, 1000);
        // }
        // if (!isOver && this.reorderTimeout) {
        //     clearTimeout(this.reorderTimeout);
        //     this.reorderTimeout = null;
        // }
    },

    canDrop(props, monitor) {
        let draggableProps = monitor.getItem();

        // Make sure a component isn't being dropped on itself
        // console.log('canDrop?', props.containingElement.id !== draggableProps.containingElement.id);
        // console.log(props.containingElement.id, draggableProps.containingElement.id);
        // return props.containingElement.id !== draggableProps.containingElement.id;
        return true;
    }
};

/**
 * A function that passes props that can be used on the component. The connectDropTarget prop is required to
 * wrap the component and make it droppable.
 * @param connect
 * @param monitor
 * @returns {{connectDropTarget: *, isOver: *}}
 */
function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
    };
}

/**
 * A higher order component that will return a droppable version of the element passed in.
 * @param FieldComponent
 * @returns {*}
 * @constructor
 */
const DroppableElement = FieldComponent => {
    class component extends Component {
        constructor(props) {
            super(props);

            this.reorderTimeout = null;
        }

        // componentDidUpdate () {
        //     let {isOver, canDrop, handleFormReorder, location, draggableItem} = this.props;
        //
        //     if (isOver) {
        //         this.reorderTimeout = setTimeout(() => {
        //             let element = draggableItem.containingElement[findFormElementKey(draggableItem.containingElement)];
        //             let draggedItemProps = Object.assign({}, draggableItem, {element});
        //
        //             if (element) {
        //                 console.log('REORDER EVENT:');
        //                 console.log('LOCATION:', location);
        //                 console.log('draggedItem', draggedItemProps);
        //                 handleFormReorder(location, draggedItemProps);
        //             }
        //         }, 1000);
        //     }
        //     if (!isOver && this.reorderTimeout) {
        //         clearTimeout(this.reorderTimeout);
        //         this.reorderTimeout = null;
        //     }
        // }

        render () {
            const {connectDropTarget, isOver, canDrop} = this.props;

            let classNames = ['droppableField'];
            classNames.push((isOver && canDrop) ? 'dropHovering' : 'notDropHovering');

            return connectDropTarget(
                <div className={classNames.join(' ')}>
                    <FieldComponent {...this.props} />
                </div>
            );
        }
    }

    component.propTypes = {
        location: PropTypes.object.isRequired
    };

    // The first argument could be an array of draggable types (e.g., could add tabs and sections here)
    return DropTarget(DraggableItemTypes.FIELD, formTarget, collect)(component);
};

export default DroppableElement;
