import React, {PropTypes, Component} from 'react';
import shallowCompare from 'react-addons-shallow-compare';

/**
 * A non-draggable header cell component to be used in the QbGrid
 */
class QbHeaderCell extends Component {
    /**
     * Using shallow compare to reduce the change this simple component re-renders
     * @param nextProps
     */
    shouldComponentUpdate(nextProps) {
        return shallowCompare(this, nextProps);
    }

    render() {
        let classes = [...this.props.classes, 'qbHeaderCell'];
        if (this.props.isStickyCell) {
            classes.push(['stickyCell']);
        }
        if (this.props.isPlaceholderCell) {
            classes.push('placeholderCell');
        }
        return <th className={classes.join(' ')} {...this.props} />;
    }
}

QbHeaderCell.propTypes = {
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
QbHeaderCell.defaultProps = {
    classes: []
};

export default QbHeaderCell;
