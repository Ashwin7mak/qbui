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
import * as query from '../../constants/query';
import ReportUtils from '../../utils/reportUtils';


let logger = new Logger();
let FluxMixin = Fluxxor.FluxMixin(React);

const AddRecordButton = React.createClass({
    render() {
        return (
            <a href="#" className="addNewRecord"><QBicon icon="add" /></a>
        );
    }
});

const ReportRoute = React.createClass({
    mixins: [FluxMixin],
    facetFields : {},
    debounceInputMillis: 700, // a key send delay
    nameForRecords: "Records",  // get from table meta data

    loadReport(appId, tblId, rptId) {
        const flux = this.getFlux();
        flux.actions.selectTableId(tblId);

        flux.actions.loadReport(appId, tblId, rptId, true);
    },

    loadReportFromParams(params) {
        let appId = params.appId;
        let tblId = params.tblId;
        let rptId = typeof this.props.rptId !== "undefined" ? this.props.rptId : params.rptId;

        if (appId && tblId && rptId) {
            //logger.debug('Loading report. AppId:' + appId + ' ;tblId:' + tblId + ' ;rptId:' + rptId);
            this.loadReport(appId, tblId, rptId);
        }
    },

    componentWillMount() {
        // Create a debounced function that delays invoking filterReport func
        // until after debounceInputMillis milliseconds have elapsed since the
        // last time the debouncedFilterReport was invoked.
        this.debouncedFilterReport = _.debounce(this.filterReport, this.debounceInputMillis);
        // note the facets by id
        this.mapFacetFields();
    },

    componentDidMount() {
        const flux = this.getFlux();
        flux.actions.hideTopNav();

        if (this.props.params) {
            this.loadReportFromParams(this.props.params);
        }
    },

    componentWillReceiveProps() {
        this.mapFacetFields();
    },

    getHeader() {
        return (
            <ReportHeader reportData={this.props.reportData}
                          nameForRecords={this.nameForRecords}
                          searchTheString={this.searchTheString}
                          clearSearchString={this.clearSearchString}
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
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={maxButtonsBeforeMenu}/>);
    },

    getBreadcrumbs() {
        let reportName = this.props.reportData && this.props.reportData.data && this.props.reportData.data.name;

        return (this.props.selectedTable &&
        <h3 className="breadCrumbs"><QBicon icon="report-table"/>{this.props.selectedTable.name}
            <span className="breadCrumbsSeparator"> | </span>{reportName}</h3>);

    },

    getStageHeadline() {
        return (
            <div className="stageHeadline">
                {this.getBreadcrumbs()}
            </div>
        );
    },

    mapFacetFields() {
        this.facetFields = {};
        if (this.props.reportData && this.props.reportData.data &&
            this.props.reportData.data.facets) {
            this.props.reportData.data.facets.map((facet) => {
                // a fields id ->facet lookup
                this.facetFields[facet.id] = facet;
            });
        }
    },

    searchTheString(searchTxt) {
        this.getFlux().actions.filterSearchPending(searchTxt);
        this.filterOnSearch(searchTxt);
    },

    clearSearchString() {
        this.getFlux().actions.filterSearchPending('');
        this.filterOnSearch('');
    },

    filterReport(searchString, selections) {
        let flux = this.getFlux();

        const filter = FilterUtils.getFilter(searchString,
            selections,
            this.facetFields);

        logger.debug('Sending filter action with:' + searchString);

        let queryParams = {};
        queryParams[query.SORT_LIST_PARAM] = ReportUtils.getGroupListString(this.props.reportData.data.sortFids, this.props.reportData.data.groupFids);
        queryParams[query.GLIST_PARAM] = ReportUtils.getGroupListString(this.props.reportData.data.sortFids, this.props.reportData.data.groupFids);
        flux.actions.getFilteredRecords(this.props.selectedAppId,
                                    this.props.routeParams.tblId,
                                    typeof this.props.rptId !== "undefined" ? this.props.rptId : this.props.routeParams.rptId, {format:true}, filter, queryParams);
    },

    filterOnSelections(newSelections) {
        this.getFlux().actions.filterSelectionsPending(newSelections);
        this.debouncedFilterReport(this.props.searchStringForFiltering, newSelections);
    },

    filterOnSearch(newSearch) {
        this.debouncedFilterReport(newSearch, this.props.reportData.selections);
    },

    clearAllFilters() {
        let noSelections = new FacetSelections();
        this.getFlux().actions.filterSelectionsPending(noSelections);
        this.getFlux().actions.filterSearchPending('');
        this.debouncedFilterReport('', noSelections);
    },

    render() {
        if (_.isUndefined(this.props.params) ||
            _.isUndefined(this.props.params.appId) ||
            _.isUndefined(this.props.params.tblId) ||
            (_.isUndefined(this.props.params.rptId) && _.isUndefined(this.props.rptId))
        ) {
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
                                       rptId={typeof this.props.rptId !== "undefined" ? this.props.rptId : this.props.params.rptId}
                                       pageActions={this.getPageActions(0)}
                                       nameForRecords={this.nameForRecords}
                                       selections={this.props.reportData.selections}
                                       searchStringForFiltering={this.props.reportData.searchStringForFiltering}
                                       callbacks={{
                                           searchTheString: this.searchTheString,
                                           filterOnSelections: this.filterOnSelections,
                                           clearSearchString : this.clearSearchString,
                                           clearAllFilters : this.clearAllFilters
                                       }}
                />

                {!this.props.scrollingReport && <AddRecordButton />}


            </div>);
        }
    }
});


export default ReportRoute;
