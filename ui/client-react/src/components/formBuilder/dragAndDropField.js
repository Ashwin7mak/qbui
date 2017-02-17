import React from 'react';
import _ from 'lodash';
import DraggableField from './draggableField';
import DroppableFormElement from './droppableFormElement';

/**
 * This HOC is a convenience method to wrap a field in both a drag and drop source.
 * @param FieldComponent
 * @returns {*}
 */
export default (FieldComponent) => {
    let component = props => {
        let key = (_.has(props, 'element.id') ? props.element.id : _.uniqueId());
        return (
            <div key={`dragDropField-${key}`} className="dragAndDropField">
                <FieldComponent {...props} />
            </div>
        );
    };

    return _.flow([
        DraggableField,
        DroppableFormElement
    ])(component);
};
