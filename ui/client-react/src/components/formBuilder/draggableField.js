import React, {PropTypes, Component} from 'react';
import {DragSource} from 'react-dnd';
import DraggableItemTypes from './draggableItemTypes';

const fieldDragSource = {
    beginDrag(props) {
        return {
            element: props.element,
            orderIndex: props.element.orderIndex,
        };
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

export default (FieldComponent) => {
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
