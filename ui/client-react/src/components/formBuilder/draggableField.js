import React, {PropTypes, Component} from 'react';
import ReactDom from 'react-dom';
import {DragSource} from 'react-dnd';
import DraggableItemTypes from './draggableItemTypes';
import {getEmptyImage} from 'react-dnd-html5-backend';
import FieldEditingTools from './fieldEditingTools/fieldEditingTools';
/**
 * Specifies event handlers and props that are available during dragging events
 * Recommended: Call any actions that will modify the DOM in "endDrag" (instead of drop [on drop target]), because
 * in some cases the draggable DOM element might get deleted and endDrag might not be called.
 * @type {{beginDrag: ((props)), endDrag: ((props, monitor))}}
 */
const fieldDragSource = {
    beginDrag(props) {
        return {
            element: props.element,
            relatedField: props.relatedField,
            tabIndex: props.tabIndex,
            sectionIndex: props.sectionIndex,
            orderIndex: props.orderIndex,
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
        connectDragPreview: connect.dragPreview(),
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

    const component = React.createClass({
        componentDidMount() {
            // Use empty image as a drag preview so browsers don't draw it
            // and we can draw whatever we want on the custom drag layer instead.
            this.props.connectDragPreview(getEmptyImage());
            this.setPositionOfFieldEditingTools();
        },

        render() {
            const {connectDragSource, isDragging} = this.props;

            let classNames = ['draggableField'];
            classNames.push(isDragging ? 'dragging' : 'notDragging');

            return connectDragSource(
                <div className={classNames.join(' ')}>
                    <FieldEditingTools/>
                    <FieldComponent {...this.props}/>
                </div>
            );
        }
    });

    return DragSource(DraggableItemTypes.FIELD, fieldDragSource, collect)(component);
};

export default DraggableFieldHoc;
