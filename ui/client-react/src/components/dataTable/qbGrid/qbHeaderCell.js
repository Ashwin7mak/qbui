import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

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
        let classes = ['qbHeaderCell'];
        if (this.props.isStickyCell) {
            classes.push(['stickyCell']);
        }

        return <th className={classes.join(' ')} {...this.props} />;
    }
});

export default QbHeaderCell;
