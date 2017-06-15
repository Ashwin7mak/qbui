import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {getEmptyImage} from 'react-dnd-html5-backend';
import {DragSource, DropTarget} from 'react-dnd';
import shallowCompare from 'react-addons-shallow-compare';
import DraggableItemTypes from '../../../../../reuse/client/src/components/dragAndDrop/draggableItemTypes';
import {CONTEXT} from '../../../actions/context';

const headerSource = {
    beginDrag(props) {
        let {label} = props;
        props.onDragStart(label);
        return {label};
    },

    isDragging(sourceProps, monitor) {
        return sourceProps.label === monitor.getItem().label;
    },

    endDrag(props) {
        props.onDragEnd();
    }
};

const headerTarget = {
    hover(targetProps, monitor) {
        const sourceProps = monitor.getItem();
        if (sourceProps.label !== targetProps.label) {
            targetProps.onMove(CONTEXT.REPORT.NAV, sourceProps.label, targetProps.label);
        }
    }
};

/**
 * The header cell component used in the QbGrid
 */
class QbHeaderCell extends Component {
    /**
     * Using shallow compare to reduce the change this simple component re-renders
     * @param nextProps
     * @returns {*}
     */
    shouldComponentUpdate(nextProps) {
        return shallowCompare(this, nextProps);
    };

    componentDidMount() {
        this.props.connectDragPreview(getEmptyImage());
    }

    render() {
        const {connectDragSource, connectDropTarget, isDragging} = this.props;

        let classes = [...this.props.classes, 'qbHeaderCell'];
        if (this.props.isStickyCell) {
            classes.push(['stickyCell']);
        }
        if (this.props.isPlaceholderCell) {
            classes.push('placeholderCell');
        }
        if (this.props.isDraggable) {
            classes.push('isDraggable');
            if (isDragging) {
                classes.push('placeholderCell');
                
            }
            return connectDragSource(connectDropTarget(<th className={classes.join(' ')} {...this.props} />));
        } else {
            return <th className={classes.join(' ')} {...this.props} />;
        }
    }
}

QbHeaderCell.propTypes = {
    classes: React.PropTypes.array,
    isStickyCell: React.PropTypes.bool,
    /**
     * This prop is for styling of a placeholder cell.
     * Use it to indicate that a column with actual data can/should be placed there. */
    isPlaceholderCell: React.PropTypes.bool,
    /**
     * Should this header cell be draggable? */
    isDraggable: React.PropTypes.bool,
};

// Provide default val
QbHeaderCell.defaultProps = {
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

export default dragSource(dropTarget(QbHeaderCell));
