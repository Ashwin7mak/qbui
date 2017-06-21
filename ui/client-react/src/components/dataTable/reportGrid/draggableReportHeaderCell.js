import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import DraggableHeaderCell from '../qbGrid/draggableQbHeaderCell';
import {moveColumn} from '../../../actions/reportBuilderActions';
import {CONTEXT} from '../../../actions/context';

/**
 * A draggable header cell component to be used in the QbGrid
 */
export class DraggableReportHeaderCell extends Component {
    onHover = (dropTargetProps, dragItemProps) => {
        if (dragItemProps.label !== dropTargetProps.label) {
            this.props.moveColumn(CONTEXT.REPORT.NAV, dragItemProps.label, dropTargetProps.label);
        }
    };

    render() {
        return (
            <DraggableHeaderCell
                {...this.props}
                onHover={this.onHover}
            />);
    }
}

DraggableReportHeaderCell.propTypes = {
    /**
     * Include any additional classes. */
    classes: React.PropTypes.array,
    /**
     * This props is to indicate a sticky cell. */
    isStickyCell: React.PropTypes.bool,
    /**
     * This prop is for styling of a placeholder cell.
     * Use it to indicate that a column with actual data can/should be placed there. */
    isPlaceholderCell: React.PropTypes.bool,
    /**
     * The label of this header cell
     */
    label: React.PropTypes.string
};

// Provide default val
DraggableReportHeaderCell.defaultProps = {
    classes: []
};

const mapDispatchToProps = {
    moveColumn
};

export default connect(null, mapDispatchToProps)(DraggableReportHeaderCell);
