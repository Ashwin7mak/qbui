import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import shallowCompare from 'react-addons-shallow-compare';

/**
 * The basic cell component used in the QbGrid
 */
export class QbCell extends Component {
    /**
     * Using shallow compare to reduce the change this simple component re-renders
     * @param nextProps
     * @returns {*}
     */
    shouldComponentUpdate(nextProps) {
        return shallowCompare(this, nextProps);
    }

    render() {
        let classes = [...this.props.classes, 'qbCell'];
        if (this.props.isStickyCell) {
            classes.push('stickyCell');
        }
        if (this.props.isPlaceholderCell || (this.props.label === this.props.labelBeingDragged)) {
            classes.push('placeholderCell');
        }
        // this is a tad bit hacky, remove when EmbeddedReportToolsAndContent supports editing
        if (_.get(this, 'props.children.props.phase1')) {
            classes.push('phase1');
        }

        return <td className={classes.join(' ')} {...this.props} />;
    }
}

QbCell.propTypes = {
    classes: React.PropTypes.array,
    isStickyCell: React.PropTypes.bool,
    /**
     * This prop is for styling of a placeholder cell.
     * Use it to indicate that a column with actual data can/should be placed there. */
    isPlaceholderCell: React.PropTypes.bool
};

// Provide default val
QbCell.defaultProps = {
    classes: []
};

const mapStateToProps = (state) => {
    return {
        labelBeingDragged: _.get(state.qbGrid, 'labelBeingDragged', '')
    };
};

export default connect(mapStateToProps)(QbCell);
