import React from 'react';
import _ from 'lodash';
import DraggableField from './draggableField';
import DroppableFormElement from './droppableFormElement';


export default (FieldComponent) => {
    let component = props => {
        return (
            <div className="dragDropField">
                <FieldComponent {...props} />
            </div>
        );
    };

    return _.flow(
        DraggableField,
        DroppableFormElement
    )(component);
};
