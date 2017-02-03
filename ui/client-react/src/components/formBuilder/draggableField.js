import React, {PropTypes, Component} from 'react';
import {DragSource} from 'react-dnd';
import DraggableItemTypes from './draggableItemTypes';

/**
 * Specifies event handlers and props that are available during dragging events
 * Recommended: Call any actions that will modify the DOM in "endDrag" (instead of drop [on drop target]), because
 * in some cases the draggable DOM element might get deleted and endDrag might not be called.
 * @type {{beginDrag: ((props)), endDrag: ((props?, monitor))}}
 */
const fieldDragSource = {
    beginDrag(props) {
        return {
            element: props.element,
            orderIndex: props.element.orderIndex,
        };
    },

    endDrag(props, monitor) {
        if (monitor.didDrop()) {
            let {tabIndex, sectionIndex, orderIndex} = monitor.getDropResult();
            props.handleFormReorder(tabIndex, sectionIndex, orderIndex, props);
        }
    }
};

/**
 * Adds additional properties to the component for dragging events. Includes the `connectDragSource` which allows
 * the component to be draggable.
 * @param connect
 * @param monitor
 * @returns {{connectDragSource: (any|*), isDragging: *}}
 */
function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

/**
 * A higher order component that accepts a field which will become draggable
 * @param FieldComponent
 * @returns {*}
 * @constructor
 */
const DraggableFieldHoc = FieldComponent => {
    let component = (props) => {
        const {connectDragSource, isDragging} = props;

        let classNames = ['draggableField'];
        classNames.push(isDragging ? 'dragging' : 'notDragging');

        return connectDragSource(
            <div className={classNames.join(' ')}>
                <FieldComponent {...props} />
            </div>
        );
    };

    return DragSource(DraggableItemTypes.FIELD, fieldDragSource, collect)(component);
};

export default DraggableFieldHoc;
