import React, {PropTypes} from 'react';
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
            containingElement: props.containingElement,
            location: props.location
        };
    },

    hover(dropTargetProps, monitor) {
        let dragItemProps = monitor.getItem();

        // Don't allow dropping an element on itself (determined by the unique id attached to each element)
        if (dragItemProps.containingElement.id !== dropTargetProps.containingElement.id) {
            dropTargetProps.handleFormReorder(dropTargetProps.location, dragItemProps);
        }
    },
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
    class component extends React.Component {
        render() {
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
        location: PropTypes.object.isRequired,
        containingElement: PropTypes.object.isRequired
    };

    // The first argument could be an array of draggable types (e.g., could add tabs and sections here)
    return DropTarget(DraggableItemTypes.FIELD, formTarget, collect)(component);
};

export default DroppableElement;
