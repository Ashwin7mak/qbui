import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import ReportSaveOrCancelFooter from '../reportBuilder/reportSaveOrCancelFooter';
import {exitBuilderMode, closeFieldSelectMenu} from '../../actions/reportBuilderActions';

export class ReportBuilderContainer extends Component {
    constructor(props) {
        super(props);
    }

    getSaveOrCancelFooter() {
        let {appId, tblId} = this.props.match.params;
        return <ReportSaveOrCancelFooter appId={appId} tblId={tblId}/>;
    }

    render() {
        return (
            <div className="reportBuilderContainer">
                {this.getSaveOrCancelFooter()}
            </div>
        );
    }
}

ReportBuilderContainer.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            /**
             * the app id */
            appId: PropTypes.string,

            /**
             * the table id */
            tblId: PropTypes.string
        })
    }),

    /**
     * A route that will be redirected to after a save/cancel action. Currently passed through mapState. */
    redirectRoute: PropTypes.string,

    /**
     * Controls the open state of the left tool panel */
    isOpen: PropTypes.bool,

    /**
     * Controls the collapsed state of the left tool panel */
    isCollapsed: PropTypes.bool
};

const mapStateToProps = (state) => {
    return {
        reportBuilder: state.reportBuilder
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        exitBuilderMode: (context) => dispatch(exitBuilderMode(context)),

        closeFieldSelectMenu: (context) => dispatch(closeFieldSelectMenu(context))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportBuilderContainer);
