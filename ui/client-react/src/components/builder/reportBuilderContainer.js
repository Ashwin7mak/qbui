import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {DragDropContext} from 'react-dnd';
import TouchBackend from 'react-dnd-touch-backend';
import ToolPalette from './builderMenus/toolPalette';
import ReportFieldSelectMenu from '../report/reportFieldSelectMenu';
import ReportSaveOrCancelFooter from '../reportBuilder/reportSaveOrCancelFooter';
import {CONTEXT} from '../../actions/context';
import {exitBuilderMode, closeFieldSelectMenu} from '../../actions/reportBuilderActions';

import './reportBuilderContainer.scss';

export class ReportBuilderContainer extends Component {
    constructor(props) {
        super(props);
    }

    getSaveOrCancelFooter = () => {
        let {appId, tblId} = this.props.match.params;
        return <ReportSaveOrCancelFooter appId={appId} tblId={tblId}/>;
    };

    render() {
        let {appId, tblId} = this.props.match.params;
        return (
            <div className="reportBuilderContainer">
                <ReportFieldSelectMenu
                    appId={appId}
                    tblId={tblId}
                    reportData={this.props.reportData}>
                    <h3>Hello!</h3>
                </ReportFieldSelectMenu>
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
        reportBuilder: state.reportBuilder,
        reportData: (_.find(state.report, {'id': CONTEXT.REPORT.NAV}))
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        exitBuilderMode: (context) => dispatch(exitBuilderMode(context)),

        closeFieldSelectMenu: (context) => dispatch(closeFieldSelectMenu(context))
    };
};

export default DragDropContext(TouchBackend({enableMouseEvents: true, delay: 30}))(
    connect(mapStateToProps, mapDispatchToProps)(ReportBuilderContainer));
