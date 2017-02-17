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
        let classes = ['qbCell'];
        if (this.props.isStickyCell) {
            classes.push('stickyCell');
        }
        if (_.get(this, 'props.children.props.isViewOnly')) {
            classes.push('viewOnly');
        }

        return <td className={classes.join(' ')} {...this.props} />;
    }
});

export default QbCell;
