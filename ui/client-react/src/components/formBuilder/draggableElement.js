import React, {PropTypes, Component} from 'react';
import {DragSource} from 'react-dnd';
import DraggableItemTypes from './draggableItemTypes';
import {getEmptyImage} from 'react-dnd-html5-backend';
import FieldEditingTools from './fieldEditingTools/fieldEditingTools';
import _ from 'lodash';

/**
 * Specifies event handlers and props that are available during dragging events
 * Recommended: Call any actions that will modify the DOM in "endDrag" (instead of drop [on drop target]), because
 * in some cases the draggable DOM element might get deleted and endDrag might not be called.
 * @type {{beginDrag: ((props)), endDrag: ((props, monitor))}}
 */
const fieldDragSource = {
    /**
     * This function is called once when dragging begins. The props passed to the beginDrag callback are those at
     * the state when the component started dragging. The beginDrag callback can optionally return an object that will be available
     * when the component hovers or is dropped.
     * @param props
     * @returns {*|{rowId}|{label}|{containingElement, location, relatedField, onHover}}
     */
    beginDrag(props) {
        return props.beginDrag(props);
    },

    /**
     * Identifies which element should be considered in a dragging state. The DOM element isn't actually moved until
     * the drop event, so we use this to apply CSS styles to hide or dim the element while a token version of that element is being dragged.
     * @param props - The props of the current instance of this component
     * @param monitor - monitor.getItem() returns the data representations of the element currently being dragged
     */
    isDragging(props, monitor) {
        let item = monitor.getItem();

        // If a custom isDragging function is passed in, used that first.
        if (props.checkIsDragging) {
            return props.checkIsDragging(item);
        }

        // Otherwise, if the dev provided ids for all the elements, we can use that to determine dragging state
        if (_.has(props, 'id') && _.has(item, 'id')) {
            return props.id === item.id;
        }

        // Default to false as this is the likely case.
        return false;
    },

    /**
     * Calls this function once dragging has stopped.
     * @param props
     * @param monitor
     */
    endDrag(props, monitor) {
        if (props.endDrag) {
            props.endDrag(props);
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
 * @param ReactComponent
 * @param showFieldEditingTools
 * @param itemType The type of draggable element. Can only be dropped on targets that accept the same type.
 * @returns {*}
 * @constructor
 */
const DraggableElementHoc = (ReactComponent, showFieldEditingTools = true, itemType = DraggableItemTypes.FIELD) => {

    class DraggableElement extends Component {
        static propTypes = {
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            beginDrag: PropTypes.func,
            checkIsDragging: PropTypes.func,
            endDrag: PropTypes.func
        };

        componentDidMount() {
            // Use empty image as a drag preview so browsers don't draw it
            // and we can draw whatever we want on the custom drag layer instead.
            this.props.connectDragPreview(getEmptyImage());
        }

        render() {
            const {connectDragSource, isDragging, location, formBuilderContainerContentElement} = this.props;

            let classNames = ['draggableField'];
            let draggableFieldWrapper = ['draggableFieldWrapper'];
            if (isDragging) {
                classNames.push('dragging');
            } else {
                classNames.push('notDragging');
            }

            return connectDragSource(
                <div className={classNames.join(' ')}>
                    <div className={draggableFieldWrapper.join(' ')}>
                        {showFieldEditingTools && <FieldEditingTools location={location} isDragging={isDragging} formBuilderContainerContentElement={formBuilderContainerContentElement}/>}
                        <ReactComponent {...this.props} />
                    </div>
                </div>
            );
        }
    }

    return DragSource(itemType, fieldDragSource, collect)(DraggableElement);
};

export default DraggableElementHoc;