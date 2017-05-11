import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {} from '../../actions/reportBuilderActions';

export class ReportBuilderContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="reportBuilderContainer">

            </div>
        );
    }
}

ReportBuilderContainer.propTypes = {

};

const mapStateToProps = (state) => {
    return {
        reportBuilder: state.reportBuilder
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportBuilderContainer);
