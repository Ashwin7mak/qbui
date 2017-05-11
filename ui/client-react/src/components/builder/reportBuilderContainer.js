import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

export class ReportBuilderContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div />
        );
    }
}

export default connect()(ReportBuilderContainer);
