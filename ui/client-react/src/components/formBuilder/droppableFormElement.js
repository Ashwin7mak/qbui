import React, {PropTypes, Component} from 'react';
import DraggableItemTypes from './draggableItemTypes';
import {DropTarget} from 'react-dnd';

/**
 * Describes what happens during drop events. The drop function returns an object that can be accessed in the EndDrag
 * function.
 * Recommended: Don't call actions that may mutate the DOM in the drop function. Instead, return any parameters you
 * might need as an object and call the action in the endDrag function on the draggable component.
 * @type {{drop: ((props, monitor))}}
 */
const formTarget = {
    drop(props) {
        return {
            location: props.location
        };
    },

    canDrop(props, monitor) {
        let draggableProps = monitor.getItem();

        // Make sure a component isn't being dropped on itself
        return props.location !== draggableProps.location;
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
        canDrop: monitor.canDrop()
    };
}

/**
 * A higher order component that will return a droppable version of the element passed in.
 * @param FieldComponent
 * @returns {*}
 * @constructor
 */
const DroppableElement = FieldComponent => {
    let component = (props) => {
        const {connectDropTarget, isOver, canDrop} = props;

        let classNames = ['droppableField'];
        classNames.push((isOver && canDrop) ? 'dropHovering' : 'notDropHovering');

        return connectDropTarget(
            <div className={classNames.join(' ')}>
                <FieldComponent {...props} />
            </div>
        );
    };

    component.propTypes = {
        location: PropTypes.object.isRequired
    };

    // The first argument could be an array of draggable types (e.g., could add tabs and sections here)
    return DropTarget(DraggableItemTypes.FIELD, formTarget, collect)(component);
};

export default DroppableElement;
