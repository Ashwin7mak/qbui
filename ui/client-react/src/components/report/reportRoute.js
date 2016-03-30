import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import Stage from '../stage/stage';
import QBicon from '../qbIcon/qbIcon';
import ReportStage from './reportStage';
import ReportHeader from './reportHeader';
import IconActions from '../actions/iconActions';
import {Link} from 'react-router';
import Logger from '../../utils/logger';
import ReportToolsAndContent from './reportToolsAndContent';
import EmailReportLink from '../actions/emailReportLink';
import simpleStringify from '../../../../common/src/simpleStringify';
import Fluxxor from 'fluxxor';
import _ from 'lodash';
import './report.scss';
import FilterUtils from '../../utils/filterUtils';
import FacetSelections from '../facet/facetSelections';

let logger = new Logger();
let FluxMixin = Fluxxor.FluxMixin(React);

var ReportRoute = React.createClass({
    mixins: [FluxMixin],
    fields : {},
    debounceInputMillis: 500, // a 1/2 second delay
    nameForRecords: "Records",  // get from table meta data
    searchReportStringForFiltering:'',

    loadReport(appId, tblId, rptId) {
        const flux = this.getFlux();
        flux.actions.loadReport(appId, tblId, rptId, true);
    },

    loadReportFromParams(params) {
        let appId = params.appId;
        let tblId = params.tblId;
        let rptId = params.rptId;

        if (appId && tblId && rptId) {
            //logger.debug('Loading report. AppId:' + appId + ' ;tblId:' + tblId + ' ;rptId:' + rptId);
            this.loadReport(appId, tblId, rptId);
        }
    },

    componentWillMount() {
        this.filterReport = _.debounce(this.filterReport, this.debounceInputMillis); // debounce the filter action
        this.mapFields();
    },

    componentDidMount() {
        const flux = this.getFlux();
        flux.actions.hideTopNav();

        if (this.props.params) {
            this.loadReportFromParams(this.props.params);
        }
    },

    componentWillReceiveProps() {
        this.mapFields();
    },

    getHeader() {
        return (
            <ReportHeader reportData={this.props.reportData}
                          searchInput={this.state.searchReportInputPending}
                          nameForRecords={this.nameForRecords}
                          searchTheString={this.searchTheString}
            />);
    },

    getPageActions(maxButtonsBeforeMenu) {
        const actions = [
            {msg: 'pageActions.addRecord', icon:'add'},
            {msg: 'pageActions.favorite', icon:'star'},
            {msg: 'pageActions.gridEdit', icon:'report-grid-edit'},
            {msg: 'pageActions.email', icon:'mail'},
            {msg: 'pageActions.print', icon:'print'},
            {msg: 'pageActions.customizeReport', icon:'settings-hollow'},
        ];
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={maxButtonsBeforeMenu} {...this.props}/>);
    },

    getBreadcrumbs() {
        let reportName = this.props.reportData && this.props.reportData.data && this.props.reportData.data.name;

        return (this.props.selectedTable && <h3 className="breadCrumbs">
            <Link to={this.props.selectedTable.link}>{this.props.selectedTable.name}</Link> | {reportName}
            </h3>);
    },

    getStageHeadline() {
        return (
            <div className="stageHeadline">
                <QBicon icon="report-table"/>

                {this.getBreadcrumbs()}
            </div>
        );
    },

    getInitialState() {
        return {
            searchReportInputPending: '',
        };
    },

    mapFields() {
        this.fields = {};
        if (this.props.reportData && this.props.reportData.data &&
            this.props.reportData.data.facets) {
            this.props.reportData.data.facets.map((facet) => {
                // a fields id ->facet lookup
                this.fields[facet.id] = facet;
            });
        }
    },

    executeSearchString(result) {
        this.filterOnSearch(result);
    },

    searchTheString(searchTxt) {
        this.executeSearchString(searchTxt);
        this.setState({
            searchReportInputPending: searchTxt
        });
    },

    filterReport(searchString, selections) {
        let flux = this.getFlux();

        const filter = FilterUtils.getFilter(searchString,
            selections,
            this.fields);

        flux.actions.filterReport(this.props.selectedAppId,
                                    this.props.routeParams.tblId,
                                    this.props.routeParams.rptId, true, filter);
        this.searchReportStringForFiltering = searchString;
    },

    filterOnSelections(newSelections) {
        this.getFlux().actions.filterSelectionsPending(newSelections);
        this.filterReport(this.props.searchStringForFiltering, newSelections);
    },
    filterOnSearch(newSearch) {
        this.filterReport(newSearch, this.props.reportData.selections);
    },

    clearAllFilters() {
        var noSelections = new FacetSelections();
        this.getFlux().actions.filterSelectionsPending(noSelections);
        this.filterReport('', noSelections);
        this.setState({
            searchReportInputPending: ''
        });
    },

    render() {
        if (_.isUndefined(this.props.params) ||
            _.isUndefined(this.props.params.appId) ||
            _.isUndefined(this.props.params.tblId) ||
            _.isUndefined(this.props.params.rptId)) {
            logger.info("the necessary params were not specified to reportRoute render params=" + simpleStringify(this.props.params));
            return null;
        } else {

            return (<div className="reportContainer">
                <Stage stageHeadline={this.getStageHeadline()}
                       pageActions={this.getPageActions(5)}>

                    <ReportStage reportData={this.props.reportData} />
                </Stage>

                {this.getHeader()}

                <ReportToolsAndContent reportData={this.props.reportData}
                                       appId={this.props.params.appId}
                                       tblId={this.props.params.tblId}
                                       rptId={this.props.params.rptId}
                                       pageActions={this.getPageActions(0)}
                                       nameForRecords={this.nameForRecords}
                                       selections={this.props.reportData.selections}
                                       searchInput={this.state.searchReportInputPending}
                                       searchStringForFiltering={this.searchReportStringForFiltering}
                                       callbacks={{
                                           searchTheString: this.searchTheString,
                                           filterOnSelections: this.filterOnSelections,
                                           clearAllFilters : this.clearAllFilters
                                       }}
                />

                {/*
                <div className="addNewRecord">
                    <a href="#" className="addRecordLink"><QBicon icon="add-mini" /></a>
                </div>
                */}
            </div>);
        }
    }
});


export default ReportRoute;
