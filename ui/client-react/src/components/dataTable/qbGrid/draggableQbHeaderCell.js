import React, {PropTypes, Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import QbHeaderCell from './qbHeaderCell';
import shallowCompare from 'react-addons-shallow-compare';
import {draggingColumnStart, draggingColumnEnd} from '../../../actions/qbGridActions';
import DragAndDropElement from '../../../../../reuse/client/src/components/dragAndDrop/dragAndDropElement';

export const DraggableHeaderCell = DragAndDropElement(QbHeaderCell);

/**
 * A draggable header cell component to be used in the QbGrid
 */
export class DraggableQbHeaderCell extends Component {
    beginDrag = (props) => {
        this.props.draggingColumnStart(props.label);

        let {label, relatedField} = this.props;

        let values;
        if (this.props.beginDrag) {
            values = this.props.beginDrag(props);
        }
        return {
            ...values,
            label,
            relatedField
        };
    };

    checkIsDragging = (item) => {
        let isDragging = this.props.label === item.label;
        return isDragging;
    };

    endDrag = (props) => {
        this.props.draggingColumnEnd();

        if (this.props.endDrag) {
            this.props.endDrag(props);
        }
    };

    /**
     * Using shallow compare to reduce the change this simple component re-renders
     * @param nextProps
     */
    shouldComponentUpdate(nextProps) {
        return shallowCompare(this, nextProps);
    }

    render() {
        let classes = [...this.props.classes, 'qbHeaderCell', 'isDraggable'];

        if (this.props.isStickyCell) {
            classes.push(['stickyCell']);
        }
        if (this.props.isPlaceholderCell || this.props.label === this.props.labelBeingDragged) {
            classes.push('placeholderCell');
        }

        return (
            <th>
                <DraggableHeaderCell
                    {...this.props}
                    classes={classes}
                    beginDrag={this.beginDrag}
                    checkIsDragging={this.checkIsDragging}
                    onHover={this.props.onHover}
                    endDrag={this.endDrag}
                />
            </th>);
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
    isPlaceholderCell: React.PropTypes.bool,
    /**
     * The label of this header cell
     */
    label: React.PropTypes.string,

    beginDrag: React.PropTypes.func,

    onHover: React.PropTypes.func,

    endDrag: React.PropTypes.func
};

// Provide default val
DraggableQbHeaderCell.defaultProps = {
    classes: []
};

const mapStateToProps = (state) => {
    return {
        labelBeingDragged: _.get(state.qbGrid, 'labelBeingDragged', '')
    };
};

const mapDispatchToProps = {
    draggingColumnStart,
    draggingColumnEnd
};

export default connect(mapStateToProps, mapDispatchToProps)(DraggableQbHeaderCell);
