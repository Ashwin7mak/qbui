import React, {Component} from 'react';
import {DragSource} from 'react-dnd';
import DraggableItemTypes from './draggableItemTypes';
import {getEmptyImage} from 'react-dnd-html5-backend';
import FieldEditingTools from './fieldEditingTools/fieldEditingTools';
import Device from '../../utils/device';

/**
 * Specifies event handlers and props that are available during dragging events
 * Recommended: Call any actions that will modify the DOM in "endDrag" (instead of drop [on drop target]), because
 * in some cases the draggable DOM element might get deleted and endDrag might not be called.
 * @type {{beginDrag: ((props)), endDrag: ((props, monitor))}}
 */
const fieldDragSource = {
    beginDrag(props, monitor, component) {
        props.cacheDragElement(component);
        return {
            containingElement: props.containingElement,
            location: props.location,
            relatedField: props.relatedField,
        };
    },

    /**
     * Identifies which element should be considered in a dragging state. The DOM element isn't actually moved until
     * the drop event, so we use this to apply CSS styles to hide or dim the element while a token version of that element is being dragged.
     * @param props
     * @param monitor
     */
    isDragging(props, monitor) {
        let item = monitor.getItem();
        return props.containingElement.id === item.containingElement.id;
    },

    /**
     * Calls this function once dragging has stopped. If the device is touch, then handle re-ordering of the field.
     * Non-touch devices handle re-ordering during the drag.
     * @param props
     * @param monitor
     */
    endDrag(props, monitor) {
        props.clearDragElementCache();
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
                    <FieldEditingTools location={location} isDragging={isDragging} />
                    <FieldComponent {...this.props} />
                </div>
            );
        }
    }

    return DragSource(DraggableItemTypes.FIELD, fieldDragSource, collect)(DraggableField);
};

export default DraggableFieldHoc;
