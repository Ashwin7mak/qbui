import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {DragSource, DropTarget} from 'react-dnd';
import shallowCompare from 'react-addons-shallow-compare';
import {CONTEXT} from '../../../actions/context';

const DragTypes = {
    HEADER: 'HEADER'
};

const headerSource = {
    beginDrag({label}) {
        return {label};
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
 * @type {__React.ClassicComponentClass<P>}
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
                classes.push('active');
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
    DragTypes.HEADER, headerSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    })
);

const dropTarget = DropTarget(
    DragTypes.HEADER, headerTarget, connect => ({
        connectDropTarget: connect.dropTarget()
    })
);

export default dragSource(dropTarget(QbHeaderCell));
