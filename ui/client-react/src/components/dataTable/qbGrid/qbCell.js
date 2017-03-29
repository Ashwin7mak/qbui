import React from 'react';
import _ from 'lodash';
import shallowCompare from 'react-addons-shallow-compare';

/**
 * The basic cell component used in the QbGrid
 * @type {__React.ClassicComponentClass<P>}
 */
const QbCell = React.createClass({
    /**
     * Using shallow compare to reduce the change this simple component re-renders
     * @param nextProps
     * @returns {*}
     */
    shouldComponentUpdate(nextProps) {
        return shallowCompare(this, nextProps);
    },

    render() {
        let classes = [...this.props.classes, 'qbCell'];
        if (this.props.isStickyCell) {
            classes.push('stickyCell');
        }
        // this is a tad bit hacky, remove when EmbeddedReportToolsAndContent supports editing
        if (_.get(this, 'props.children.props.phase1')) {
            classes.push('phase1');
        }

        return <td className={classes.join(' ')} {...this.props} />;
    }
});

QbCell.propTypes = {
    classes: React.PropTypes.array,
    isStickyCell: React.PropTypes.bool
};

// Provide default val
QbCell.defaultProps = {
    classes: []
};

export default QbCell;
