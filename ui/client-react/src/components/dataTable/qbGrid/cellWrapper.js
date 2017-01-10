import React from 'react';

const CellWrapper = React.createClass({
    render() {
        return <td className="qbCell" {...this.props} />;
    }
});

export default CellWrapper;
