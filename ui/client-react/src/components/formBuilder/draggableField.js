import React, {Component} from 'react';
import {DragSource} from 'react-dnd';
import DraggableItemTypes from './draggableItemTypes';
import {getEmptyImage} from 'react-dnd-html5-backend';
import FieldEditingTools from './fieldEditingTools/fieldEditingTools';
import _ from "lodash";

/**
 * Specifies event handlers and props that are available during dragging events
 * Recommended: Call any actions that will modify the DOM in "endDrag" (instead of drop [on drop target]), because
 * in some cases the draggable DOM element might get deleted and endDrag might not be called.
 * @type {{beginDrag: ((props)), endDrag: ((props, monitor))}}
 */
const fieldDragSource = {
    beginDrag(props, monitor, component) {
        if (props.beginDrag) {
            props.beginDrag(props);
        }

        if (props.isInDraggingState) {
            props.isInDraggingState(props.formId);
        }

        return {
            containingElement: props.containingElement,
            location: props.location,
            relatedField: props.relatedField,

            // If there is an onHover callback, we need to pass it through here so it is available
            // when the dropTarget initiates this event
            onHover: props.onHover
        };
    },

    /**
     * Identifies which element should be considered in a dragging state. The DOM element isn't actually moved until
     * the drop event, so we use this to apply CSS styles to hide or dim the element while a token version of that element is being dragged.
     * @param props - The props of the current instance of this component
     * @param monitor - monitor.getItem() returns the data representations of the element currently being dragged
     */
    isDragging(props, monitor) {
        let item = monitor.getItem();

        if (props.isDragging) {
            return props.isDragging(item);
        }

        if (props.containingElement && item.containingElement) {
            return props.containingElement.id === item.containingElement.id;
        }

        // Default to true as this is the likely case.
        return true;
    },

    /**
     * Calls this function once dragging has stopped.
     * @param props
     * @param monitor
     */
    endDrag(props, monitor) {
        if (props.endDrag) {
            props.endDrag();
        }

        if (props.endDraggingState) {
            props.endDraggingState(props.formId);
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
 * @param showFieldEditingTools
 * @returns {*}
 * @constructor
 */
const DraggableFieldHoc = (FieldComponent, showFieldEditingTools = true) => {

    class DraggableField extends Component {
        componentDidMount() {
            // Use empty image as a drag preview so browsers don't draw it
            // and we can draw whatever we want on the custom drag layer instead.
            this.props.connectDragPreview(getEmptyImage());
        }

        render() {
            const {connectDragSource, isDragging, isTokenInMenuDragging, location, formBuilderContainerContentElement, selectedField} = this.props;

            let classNames = ['draggableField'];
            let draggableFieldWrapper = ['draggableFieldWrapper'];
            if (isDragging || (_.isEqual(location, selectedField) && isTokenInMenuDragging)) {
                classNames.push('dragging');
            } else {
                classNames.push('notDragging');
            }

            return connectDragSource(
                <div className={classNames.join(' ')}>
                    <div className={draggableFieldWrapper.join(' ')}>
                        {showFieldEditingTools &&
                        <FieldEditingTools
                            location={location}
                            isDragging={isDragging}
                            formBuilderContainerContentElement={formBuilderContainerContentElement}
                            relatedField={this.props.relatedField}
                            app={this.props.app}
                            tblId={this.props.tblId}
                            fieldId={this.props.fieldId}
                        />
                        }
                        <FieldComponent {...this.props} />
                    </div>
                </div>
            );
        }
    }

    return DragSource(DraggableItemTypes.FIELD, fieldDragSource, collect)(DraggableField);
};

export default DraggableFieldHoc;
