import React, {PropTypes, Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import QbHeaderCell from './qbHeaderCell';
import shallowCompare from 'react-addons-shallow-compare';
import {draggingColumnStart, draggingColumnEnd} from '../../../actions/qbGridActions';
import DragAndDropElement from '../../../../../reuse/client/src/components/dragAndDrop/dragAndDropElement';

export const DraggableHeaderCell = DragAndDropElement(QbHeaderCell);

/**
 * This is a base component that can be composed into custom implementations for dragging specific headers on grids.
 *
 * See DraggableReportHeaderCell for the most common implementation for dragging header cells.
 *
 * A component which allows the header cell to be dragged. XD approved style is included in this implementation.
 */
export class DraggableQbHeaderCell extends Component {
    /**
     * Called when the drag begins. Switches the column style to the style of a moving column for you.
     * @param props
     */
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

    /**
     * Called when the drag ends. Removes the style of a moving column for you.
     * @param props
     */
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
            <th className={classes}>
                <DraggableHeaderCell
                    {...this.props}
                    classes={classes}
                    beginDrag={this.beginDrag}
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

    /**
     * Callback that is fired when the header cell is first picked up for dragging.
     * It receives the element props as the first and only argument.
     * It should return an object which will be available in onHover. */
    beginDrag: React.PropTypes.func,

    /**
     * Callback that is fired anytime the header cell is dragged over a valid droppable area.
     * It receives the drop target props as the first argument and the dragItem props as the second.
     * Note: Only the object returned from 'beginDrag' are available as props. */
    onHover: React.PropTypes.func,

    /**
     * Callback that is fired when the header cell is dropped.
     * It receives the element props as the first and only argument. */
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
