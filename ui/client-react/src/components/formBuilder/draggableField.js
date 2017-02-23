import React, {Component} from 'react';
import {DragSource} from 'react-dnd';
import DraggableItemTypes from './draggableItemTypes';
import {getEmptyImage} from 'react-dnd-html5-backend';
import FieldEditingTools from './fieldEditingTools/fieldEditingTools';
import {findFormElementKey} from '../../actions/actionHelpers/transformFormData';

/**
 * Specifies event handlers and props that are available during dragging events
 * Recommended: Call any actions that will modify the DOM in "endDrag" (instead of drop [on drop target]), because
 * in some cases the draggable DOM element might get deleted and endDrag might not be called.
 * @type {{beginDrag: ((props)), endDrag: ((props, monitor))}}
 */
const fieldDragSource = {
    beginDrag(props) {
        return {
            containingElement: props.containingElement,
            location: props.location,
            relatedField: props.relatedField,
        };
    },

    isDragging(props, monitor) {
        let item = monitor.getItem();
        return props.containingElement.id === item.containingElement.id;
    },

    endDrag(dragItemProps, monitor) {
        if (monitor.didDrop()) {
            let dropTargetProps = monitor.getDropResult();

            if (dragItemProps.containingElement.id !== dropTargetProps.containingElement.id) {
                let element = dragItemProps.containingElement[findFormElementKey(dragItemProps.containingElement)];
                dragItemProps.handleFormReorder(dropTargetProps.location, Object.assign({}, dragItemProps, {element}));
            }
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

    class DraggableField extends Component {
        componentDidMount() {
            // Use empty image as a drag preview so browsers don't draw it
            // and we can draw whatever we want on the custom drag layer instead.
            this.props.connectDragPreview(getEmptyImage());
        }

        render() {
            const {connectDragSource, isDragging, location} = this.props;

            let classNames = ['draggableField'];
            classNames.push(isDragging ? 'dragging' : 'notDragging');

            return connectDragSource(
                <div className={classNames.join(' ')}>
                    <FieldEditingTools location={location} />
                    <FieldComponent {...this.props} />
                </div>
            );
        }
    }

    return DragSource(DraggableItemTypes.FIELD, fieldDragSource, collect)(DraggableField);
};

export default DraggableFieldHoc;
