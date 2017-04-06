import React, {Component, PropTypes} from 'react';

class StandardGrid extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="gridContainer">
                {this.props.children}
            </div>
        );
    }
}

export default StandardGrid;
