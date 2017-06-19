import React, {PropTypes, Component} from 'react';
import {getEmptyImage} from 'react-dnd-html5-backend';
import {DragSource, DropTarget} from 'react-dnd';
import shallowCompare from 'react-addons-shallow-compare';
import DraggableItemTypes from '../../formBuilder/draggableItemTypes';
import {CONTEXT} from '../../../actions/context';

const headerSource = {
    beginDrag(props) {
        let {label, relatedField} = props;
        if (props.onDragStart) {
            props.onDragStart(label);
        }
        return {label, relatedField};
    },

    isDragging(sourceProps, monitor) {
        return sourceProps.label === monitor.getItem().label;
    },

    endDrag(props) {
        if (props.onDragEnd) {
            props.onDragEnd();
        }
    }
};

const headerTarget = {
    hover(targetProps, monitor) {
        const sourceProps = monitor.getItem();
        if ((sourceProps.label !== targetProps.label) && targetProps.onHover) {
            targetProps.onHover(CONTEXT.REPORT.NAV, sourceProps.label, targetProps.label);
        }
    }
};

/**
 * A draggable header cell component to be used in the QbGrid
 */
class DraggableQbHeaderCell extends Component {
    /**
     * Using shallow compare to reduce the change this simple component re-renders
     * @param nextProps
     */
    shouldComponentUpdate(nextProps) {
        return shallowCompare(this, nextProps);
    };

    componentDidMount() {
        this.props.connectDragPreview(getEmptyImage());
    }

    render() {
        const {connectDragSource, connectDropTarget, isDragging} = this.props;

        let classes = [...this.props.classes, 'qbHeaderCell', 'isDraggable'];
        if (this.props.isStickyCell) {
            classes.push(['stickyCell']);
        }
        if (this.props.isPlaceholderCell || isDragging) {
            classes.push('placeholderCell');
        }
        return connectDragSource(connectDropTarget(<th className={classes.join(' ')} {...this.props} />));
    }
}

DraggableQbHeaderCell.propTypes = {
    /**
     * Include any additional classes. */
    classes: React.PropTypes.array,
    /**
     * This props is to indicate a sticky cell. */
    isStickyCell: React.PropTypes.bool,
    /**
     * This prop is for styling of a placeholder cell.
     * Use it to indicate that a column with actual data can/should be placed there. */
    isPlaceholderCell: React.PropTypes.bool
};

// Provide default val
DraggableQbHeaderCell.defaultProps = {
    classes: []
};

const dragSource = DragSource(
    DraggableItemTypes.FIELD, headerSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    })
);

const dropTarget = DropTarget(
    DraggableItemTypes.FIELD, headerTarget, connect => ({
        connectDropTarget: connect.dropTarget()
    })
);

export default dragSource(dropTarget(DraggableQbHeaderCell));
