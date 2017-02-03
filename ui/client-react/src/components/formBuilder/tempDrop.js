import React, {PropTypes, Component} from 'react';
import DroppableFormElement from './droppableFormElement';

const TempDrop = (props) => {
    return (
        <div className="tempDrop" />
    );
};

export default DroppableFormElement(TempDrop);
