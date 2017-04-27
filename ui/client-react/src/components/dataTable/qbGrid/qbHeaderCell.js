import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
//import {Header} from 'reactabular-dnd';
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

        return <dnd.Header className={classes.join(' ')} {...this.props} />;
    }
});

QbHeaderCell.propTypes = {
    classes: React.PropTypes.array,
    isStickyCell: React.PropTypes.bool
};

// Provide default val
QbHeaderCell.defaultProps = {
    classes: []
};

export default QbHeaderCell;
