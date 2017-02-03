import React, {PropTypes, Component} from 'react';
import DraggableItemTypes from './draggableItemTypes';
import {DropTarget} from 'react-dnd';

const formTarget = {
    drop(props, monitor) {
        let draggedItemProps = monitor.getItem();
        props.handleFormReorder(props.tabIndex, props.sectionIndex, props.orderIndex, draggedItemProps);
        return {};
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
    };
}

export default (FieldComponent) => {
    let component = (props) => {
        const {connectDropTarget, isOver} = props;

        let classNames = ['droppableField'];
        classNames.push(isOver ? 'dropHovering' : 'notDropHovering');

        return connectDropTarget(
            <div className={classNames.join(' ')}>
                <FieldComponent {...props} />
            </div>
        );
    };

    component.propTypes = {
        tabIndex: PropTypes.number.isRequired,
        sectionIndex: PropTypes.number.isRequired,
        orderIndex: PropTypes.number.isRequired
    };

    // The first argument could be an array of draggable types
    return DropTarget(DraggableItemTypes.FIELD, formTarget, collect)(component);
};
