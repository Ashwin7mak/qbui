import React, {PropTypes, Component} from 'react';
import DroppableFormElement from './droppableFormElement';

const MobileDropTarget = props => (
    <div className="mobileDropTarget">
        <div className="mobileDropTargetVisibleLine"></div>
    </div>
);

MobileDropTarget.propTypes = {
    containingElement: PropTypes.shape({
        id: PropTypes.any.isRequired
    }).isRequired,

    location: PropTypes.object.isRequired,

    handleFormReorder: PropTypes.func.isRequired,
};

export default DroppableFormElement(MobileDropTarget);