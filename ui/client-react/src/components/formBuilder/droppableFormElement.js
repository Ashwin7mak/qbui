import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import DraggableItemTypes from './draggableItemTypes';
import {DropTarget} from 'react-dnd';

/**
 * State is connected directly to this dragDrop component to improve performance of drag and drop animations.
 * If the animation state is passed from above, the whole screen re-renders on every reorder animation. This way, only
 * the affected DOM nodes are re-rendered.
 * @param state
 * @returns {{isAnimating: (boolean|*)}}
 */
const mapStateToProps = state => {
    return {
        isAnimating: state.animation.isFormAnimating
    };
};

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
        if (dropTargetProps.isAnimating) {
            return;
        }

        let dragItemProps = monitor.getItem();

        // Don't allow dropping an element on itself (determined by the unique id attached to each element)
        if (dragItemProps.containingElement.id !== dropTargetProps.containingElement.id) {
            dropTargetProps.handleFormReorder(dropTargetProps.location, dragItemProps);
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
 * @param FieldComponent
 * @param connected Whether or not to connect this component to the redux state. Pass in false to help with unit testing.
 * @returns {*}
 * @constructor
 */
const DroppableElement = (FieldComponent, connected = true) => {
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

    let wrappedComponent = DropTarget(DraggableItemTypes.FIELD, formTarget, collect)(component);

    if (connected) {
        // The first argument could be an array of draggable types (e.g., could add tabs and sections here)
        return connect(mapStateToProps)(wrappedComponent);
    }

    return wrappedComponent;
};

export default DroppableElement;
