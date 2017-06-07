import React, {PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import * as dnd from 'reactabular-dnd';

/**
 * The header cell component used in the QbGrid
 * @type {__React.ClassicComponentClass<P>}
 */
const QbHeaderCell = React.createClass({
    /**
     * Using shallow compare to reduce the change this simple component re-renders
     * @param nextProps
     * @returns {*}
     */
    shouldComponentUpdate(nextProps) {
        return shallowCompare(this, nextProps);
    },

    render() {
        let classes = [...this.props.classes, 'qbHeaderCell'];
        if (this.props.isStickyCell) {
            classes.push(['stickyCell']);
        }
        if (this.props.isPlaceholderCell) {
            classes.push('placeholderCell');
        }
        if (this.props.isDraggable) {
            classes.push('isDraggable');
            return <dnd.Header className={classes.join(' ')} {...this.props} />;
        } else {
            return <th className={classes.join(' ')} {...this.props} />;
        }
    }
});

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

export default QbHeaderCell;
