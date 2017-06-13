import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
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
        return props;
    },

    hover(dropTargetProps, monitor) {
        if (dropTargetProps.isAnimating) {
            return;
        }

        let dragItemProps = monitor.getItem();

        if (dropTargetProps.onHover) {
            dropTargetProps.onHover(dropTargetProps, dragItemProps);
        }

        if (dragItemProps.onHover) {
            dragItemProps.onHover(dropTargetProps, dragItemProps);
        }
    }
};

/**
 * A function that passes props that can be used on the component. The connectDropTarget prop is required to
 * wrap the component and make it droppable.
 * @param connectDropSource
 * @param monitor
 * @returns {{connectDropTarget: *, isOver: *}}
 */
function collect(connectDropSource, monitor) {
    return {
        connectDropTarget: connectDropSource.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

/**
 * A higher order component that will return a droppable version of the element passed in.
 * @param ReactComponent
 * @param connected Whether or not to connect this component to the redux state. Pass in false to help with unit testing.
 * @param types The types of elements this droppable field will accept.
 * @returns {*}
 * @constructor
 */
const DroppableElement = (ReactComponent, types = [DraggableItemTypes.FIELD]) => {
    class component extends Component {
        static propTypes = {
            /**
             * onHover will not be called if isAnimating is true. This can be helpful to prevent double onHovers while
             * elments are animating to their new position. */
            isAnimating: PropTypes.bool,

            onHover: PropTypes.func
        };

        render() {
            const {connectDropTarget, isOver, canDrop} = this.props;

            let classNames = ['droppableField'];
            classNames.push((isOver && canDrop) ? 'dropHovering' : 'notDropHovering');

            return connectDropTarget(
                <div className={classNames.join(' ')}>
                    <ReactComponent {...this.props} />
                </div>
            );
        }
    }

    // The first argument could be an array of draggable types (e.g., could add tabs and sections here)
    return DropTarget(types, formTarget, collect)(component);
};

export default DroppableElement;
