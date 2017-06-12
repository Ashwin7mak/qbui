import React, {Component} from 'react';
import _ from 'lodash';
import DraggableElement from './draggableElement';
import DroppableElement from './droppableElement';

/**
 * This HOC is a convenience method to wrap a field in both a drag and drop source.
 * @returns {*}
 * @param ReactComponent
 */
export default (ReactComponent) => {
    // This must be a component that could have state to work with drag/drop animations.
    // It cannot be a stateless component built with a function.
    class DragDropReactComponent extends Component {
        render() {
            return (
                <div className="dragAndDropElement">
                    <ReactComponent {...this.props} />
                </div>
            );
        }
    }

    return _.flow([
        DraggableElement,
        DroppableElement
    ])(DragDropReactComponent);
};
