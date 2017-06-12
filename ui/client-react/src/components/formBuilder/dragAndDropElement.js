import React, {Component} from 'react';
import _ from 'lodash';
import DraggableElement from './draggableElement';
import DroppableFormElement from './droppableElement';

/**
 * This HOC is a convenience method to wrap a field in both a drag and drop source.
 * @param FieldComponent
 * @returns {*}
 */
export default (FieldComponent) => {
    // This must be a component that could have state to work with drag/drop animations.
    // It cannot be a stateless component built with a function.
    class DragDropFieldComponent extends Component {
        render() {
            return (
                <div className="dragAndDropElement">
                    <FieldComponent {...this.props} />
                </div>
            );
        }
    }

    return _.flow([
        DraggableElement,
        DroppableFormElement
    ])(DragDropFieldComponent);
};
