import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

const CellWrapper = React.createClass({
    shouldComponentUpdate(nextProps) {
        return shallowCompare(this, nextProps);
    },

    render() {
        return <td className="qbCell" {...this.props} />;
    }
});

export default CellWrapper;
