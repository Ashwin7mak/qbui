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
import FeatureCheck from '../featureSwitches/featureCheck';

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
            <ReportHeader reportData={this.props.reportData}
                          nameForRecords={this.nameForRecords}
                          rptId={this.props.reportData ? this.props.reportData.rptId : null} {...this.props}
            />);
    },

    loadTableHomePageReportFromParams(appId, tblId, offset, numRows) {
        const flux = this.getFlux();
        flux.actions.selectTableId(tblId);
        flux.actions.loadFields(appId, tblId);
        flux.actions.loadTableHomePage(appId, tblId, offset, numRows);
    },
    loadHomePageForParams(params) {
        let appId = params.appId;
        let tblId = params.tblId;

        //  Always fetch page 1 as this is called only when loading the home page for the first
        //  time.  Paging will always call report paging after initial load as the client will not
        //  (and shouldnt) know that the report is default table report and not a saved report.
        let offset = Constants.PAGE.DEFAULT_OFFSET;
        let numRows = Constants.PAGE.DEFAULT_NUM_ROWS;

        if (appId && tblId) {
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
        // need to dispatch to Fluxxor since report store handles this too...
        const flux = this.getFlux();
        flux.actions.editNewRecord();

        this.props.dispatch(editNewRecord());
    },

    getPageActions(maxButtonsBeforeMenu) {
        const actions = [
            {msg: 'pageActions.addRecord', icon:'add', className:'addRecord', onClick: this.editNewRecord},
            {msg: 'unimplemented.makeFavorite', icon:'star', disabled: true},
            {msg: 'unimplemented.print', icon:'print', disabled: true},
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
        return (<div className="reportContainer">
            <Stage stageHeadline={this.getStageHeadline()} pageActions={this.getPageActions(5)}>
                <ReportStage reportData={this.props.reportData} />
            </Stage>

            <FeatureCheck featureName="demo">
                <h2>Demo feature X is on!</h2>
            </FeatureCheck>

            {this.getHeader()}

            <FeatureCheck featureName="HideTable">
                <h2>Table is off</h2>
            </FeatureCheck>

            <FeatureCheck featureName="HideTable" show={false}>
                <ReportToolsAndContent
                    params={this.props.params}
                    reportData={this.props.reportData}
                    appUsers={this.props.appUsers}
                    routeParams={this.props.routeParams}
                    selectedAppId={this.props.selectedAppId}
                    fields={this.props.fields}
                    searchStringForFiltering={this.props.reportData.searchStringForFiltering}
                    selectedRows={this.props.reportData.selectedRows}
                    scrollingReport={this.props.scrollingReport}
                    rptId={this.props.reportData ? this.props.reportData.rptId : null}
                    nameForRecords={this.nameForRecords}
                    pendEdits={this.props.pendEdits} />

            </FeatureCheck>


        </div>);
    }
});

// injects dispatch()
export default connect()(TableHomePageRoute);
