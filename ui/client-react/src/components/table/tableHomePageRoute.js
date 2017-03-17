import React from 'react';
import Stage from '../stage/stage';
import ReportStage from '../report/reportStage';
import ReportHeader from '../report/reportHeader';
import TableIcon from '../qbTableIcon/qbTableIcon';
import IconActions from '../actions/iconActions';
import ReportToolsAndContent from '../report/reportToolsAndContent';
import Fluxxor from 'fluxxor';
import {I18nMessage} from "../../utils/i18nMessage";
import Constants from '../../../../common/src/constants';
import {connect} from 'react-redux';
import {editNewRecord} from '../../actions/formActions';
import * as SearchActions from '../../actions/searchActions';
import * as TableActions from '../../actions/tableActions';
import * as FieldsActions from '../../actions/fieldsActions';
import {CONTEXT} from '../../actions/context';
import WindowLocationUtils from '../../utils/windowLocationUtils';
import {EDIT_RECORD_KEY, NEW_RECORD_VALUE} from '../../constants/urlConstants';

let FluxMixin = Fluxxor.FluxMixin(React);
import './tableHomePage.scss';
import '../report/report.scss';

/**
 * table homepage route
 *
 * Note: this component has been partially migrated to Redux
 */
export const TableHomePageRoute = React.createClass({
    mixins: [FluxMixin],
    nameForRecords: "Records",

    getHeader() {
        return (
            <ReportHeader nameForRecords={this.nameForRecords}
                          rptId={this.props.reportData ? this.props.reportData.rptId : null} {...this.props}
            />);
    },

    loadTableHomePageReportFromParams(appId, tblId, offset, numRows) {
        const flux = this.getFlux();
        flux.actions.selectTableId(tblId);

        this.props.clearSearchInput();

        //flux.actions.loadFields(appId, tblId);
        this.props.loadFields(appId, tblId);

        this.props.loadTableHomePage(CONTEXT.REPORT.NAV, appId, tblId, offset, numRows);
    },
    loadHomePageForParams(params) {
        let appId = params.appId;
        let tblId = params.tblId;

        if (appId && tblId) {
            //  Always fetch page 1 as this is called only when loading the home page for the first
            //  time.  Paging will always call report paging after initial load as the client will not
            //  (and shouldnt) know that the report is default table report and not a saved report.
            let offset = Constants.PAGE.DEFAULT_OFFSET;
            let numRows = Constants.PAGE.DEFAULT_NUM_ROWS;
            this.loadTableHomePageReportFromParams(appId, tblId, offset, numRows);
        }
    },
    componentDidMount() {
        const flux = this.getFlux();
        flux.actions.hideTopNav();

        if (this.props.params) {
            this.loadHomePageForParams(this.props.params);
        }
    },

    /**
     * Add a new record in trowser
     */
    editNewRecord() {
        WindowLocationUtils.pushWithQuery(EDIT_RECORD_KEY, NEW_RECORD_VALUE);
    },

    getPageActions(maxButtonsBeforeMenu) {
        const actions = [
            {msg: 'pageActions.addRecord', icon:'add', className:'addRecord', onClick: this.editNewRecord},
            {msg: 'unimplemented.makeFavorite', icon:'star', disabled: true},
            {msg: 'unimplemented.print', icon:'print', disabled: true}
        ];
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={maxButtonsBeforeMenu}/>);
    },

    getStageHeadline() {
        let reportName = this.props.reportData && this.props.reportData.data && this.props.reportData.data.name;

        return (
            <div className="tableHomepageStageHeadline">
                <div className="navLinks">
                    {this.props.selectedTable && this.props.selectedTable.icon && <TableIcon icon={this.props.selectedTable.icon}/> }
                    <span>{this.props.selectedTable && this.props.selectedTable.name}&nbsp;<I18nMessage message={'nav.home'}/></span>
                </div>
            </div>);
    },

    render() {
        //  ensure there is a rptId property otherwise the report not found page is rendered in ReportToolsAndContent
        let homePageParams = _.assign(this.props.params, {rptId: null});

        let fields = [];
        if (_.has(this.props, 'params')) {
            //  get fields from redux store
            let fieldsContainer = _.find(this.props.fields, field => field.appId === this.props.params.appId && field.tblId === this.props.params.tblId);
            fields = fieldsContainer ? fieldsContainer.fields : [];
        }

        return (<div className="reportContainer">
            <Stage stageHeadline={this.getStageHeadline()} pageActions={this.getPageActions(5)}>
                <ReportStage reportData={this.props.reportData} />
            </Stage>

            {this.getHeader()}

            <ReportToolsAndContent
                params={homePageParams}
                reportData={this.props.reportData}
                appUsers={this.props.appUsers}
                routeParams={this.props.routeParams}
                selectedAppId={this.props.selectedAppId}
                fields={fields}
                searchStringForFiltering={this.props.reportData.searchStringForFiltering}
                selectedRows={this.props.reportData.selectedRows}
                scrollingReport={this.props.scrollingReport}
                rptId={this.props.reportData ? this.props.reportData.rptId : null}
                nameForRecords={this.nameForRecords}
                pendEdits={this.props.pendEdits} />
        </div>);
    }
});

// similarly, abstract out the Redux dispatcher from the presentational component
// (another bit of boilerplate to keep the component free of Redux dependencies)
const mapStateToProps = (state) => {
    return {
        fields: state.fields,
        report: state.report
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        clearSearchInput:  () => {
            dispatch(SearchActions.clearSearchInput());
        },
        loadTableHomePage: (context, appId, tblId, offset, numRows) => {
            dispatch(TableActions.loadTableHomePage(CONTEXT.REPORT.NAV, appId, tblId, offset, numRows));
        },
        loadFields: (appId, tblId) => {
            dispatch(FieldsActions.loadFields(appId, tblId));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TableHomePageRoute);

