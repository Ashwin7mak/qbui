import React from 'react';

import Logger from '../../utils/logger';
let logger = new Logger();
import ReportActions from '../actions/reportActions';
import ReportToolbar from './reportToolbar';
import ReportContent from './dataTable/reportContent';
import QBicon from '../qbIcon/qbIcon';
import IconActions from '../actions/iconActions';
import Fluxxor from 'fluxxor';
import simpleStringify from '../../../../common/src/simpleStringify';
import _ from 'lodash';
import FacetSelections from '../facet/facetSelections';
import './report.scss';
import FilterUtils from '../../utils/filterUtils';
import * as query from '../../constants/query';
import ReportUtils from '../../utils/reportUtils';

let FluxMixin = Fluxxor.FluxMixin(React);

let AddRecordButton = React.createClass({
    render() {
        return (
            <a href="#" className="addNewRecord"><QBicon icon="add" /></a>
        );
    }
});

/* The container for report and its toolbar */
let ReportToolsAndContent = React.createClass({
    mixins: [FluxMixin],
    facetFields : {},
    debounceInputMillis: 700, // a key send delay
    nameForRecords: "Records",  // get from table meta data
    propTypes: {
        appId: React.PropTypes.string,
        tblId: React.PropTypes.string,
        rptId: React.PropTypes.string,
        reportData: React.PropTypes.object,
        pageActions: React.PropTypes.element,
        callbacks :  React.PropTypes.object,
        selectedRows: React.PropTypes.array
    },
    getDefaultProps() {
        return {
            selections:null,
        };
    },
    componentWillMount() {
        // Create a debounced function that delays invoking filterReport func
        // until after debounceInputMillis milliseconds have elapsed since the
        // last time the debouncedFilterReport was invoked.
        this.debouncedFilterReport = _.debounce(this.filterReport, this.debounceInputMillis);
        // note the facets by id
        this.mapFacetFields();
    },
    componentWillReceiveProps() {
        this.mapFacetFields();
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
    filterOnSearch(newSearch) {
        this.debouncedFilterReport(newSearch, this.props.reportData.selections);
    },
    filterReport(searchString, selections) {
        let flux = this.getFlux();

        const filter = FilterUtils.getFilter(searchString, selections, this.facetFields);

        logger.debug('Sending filter action with:' + searchString);

        let queryParams = {};
        queryParams[query.SORT_LIST_PARAM] = ReportUtils.getGListString(this.props.reportData.data.sortFids, this.props.reportData.data.groupEls);
        flux.actions.getFilteredRecords(this.props.selectedAppId,
            this.props.routeParams.tblId,
            typeof this.props.rptId !== "undefined" ? this.props.rptId : this.props.routeParams.rptId, {format:true}, filter, queryParams);
    },
    searchTheString(searchTxt) {
        this.getFlux().actions.filterSearchPending(searchTxt);
        this.filterOnSearch(searchTxt);
    },
    filterOnSelections(newSelections) {
        this.getFlux().actions.filterSelectionsPending(newSelections);
        this.debouncedFilterReport(this.props.searchStringForFiltering, newSelections);
    },
    clearSearchString() {
        this.getFlux().actions.filterSearchPending('');
        this.filterOnSearch('');
    },
    clearAllFilters() {
        let noSelections = new FacetSelections();
        this.getFlux().actions.filterSelectionsPending(noSelections);
        this.getFlux().actions.filterSearchPending('');
        this.debouncedFilterReport('', noSelections);
    },
    getReportToolbar() {
        let {appId, tblId, rptId,
            reportData:{selections, ...otherReportData}} = this.props;

        return <ReportToolbar appId={this.props.params.appId}
                              tblId={this.props.params.tblId}
                              rptId={typeof this.props.rptId !== "undefined" ? this.props.rptId : this.props.params.rptId}
                              reportData={this.props.reportData}
                              selections={this.props.reportData.selections}
                              searchStringForFiltering={this.props.reportData.searchStringForFiltering}
                              pageActions={this.getPageActions(0)}
                              nameForRecords={this.nameForRecords}
                              fields={this.props.fields}
                              searchTheString={this.searchTheString}
                              filterOnSelections={this.filterOnSelections}
                              clearSearchString={this.clearSearchString}
                              clearAllFilters={this.clearAllFilters}/>;
    },
    getSelectionActions() {
        return (<ReportActions selection={this.props.selectedRows} />);
    },
    getTableActions() {
        const selectedRows = this.props.selectedRows;
        const hasSelection = !!(selectedRows && selectedRows.length > 1);

        let classes = "tableActionsContainer secondaryBar";

        if (hasSelection) {
            classes += " selectionActionsOpen";
        }

        return (<div className={classes}>
            {hasSelection ? this.getSelectionActions() : this.getReportToolbar()}
        </div>);
    },
    render() {

        let classes = "reportToolsAndContentContainer";
        if (this.props.selectedRows) {
            if (this.props.selectedRows.length > 0) {
                classes += " activeSelection";
            }
            if (this.props.selectedRows.length === 1) {
                classes += " singleSelection";
            }
        }

        let {appId, tblId, rptId, reportData:{selections, ...otherReportData}} = this.props;

        if (_.isUndefined(this.props.params) ||
            _.isUndefined(this.props.params.appId) ||
            _.isUndefined(this.props.params.tblId) ||
            (_.isUndefined(this.props.params.rptId) && _.isUndefined(this.props.rptId))
        ) {
            logger.info("the necessary params were not specified to reportRoute render params=" + simpleStringify(this.props.params));
            return null;
        } else {
            let toolbar = <ReportToolbar appId={this.props.params.appId}
                                         tblId={this.props.params.tblId}
                                         rptId={typeof this.props.rptId !== "undefined" ? this.props.rptId : this.props.params.rptId}
                                         reportData={this.props.reportData}
                                         selections={this.props.reportData.selections}
                                         searchStringForFiltering={this.props.reportData.searchStringForFiltering}
                                         pageActions={this.getPageActions(0)}
                                         nameForRecords={this.nameForRecords}
                                         fields={this.props.fields}
                                         searchTheString={this.searchTheString}
                                         filterOnSelections={this.filterOnSelections}
                                         clearSearchString={this.clearSearchString}
                                         clearAllFilters={this.clearAllFilters}/>;

            return (
                <div className={classes}>
                    {this.getTableActions()}
                    <ReportContent  appId={this.props.params.appId}
                                    tblId={this.props.params.tblId}
                                    rptId={typeof this.props.rptId !== "undefined" ? this.props.rptId : this.props.params.rptId}
                                    reportData={this.props.reportData}
                                    reportHeader={toolbar}
                                    uniqueIdentifier="Record ID#"
                                    flux={this.getFlux()}
                        {...this.props} />

                    {!this.props.scrollingReport && <AddRecordButton />}
                </div>
            );
        }
    }
});

export default ReportToolsAndContent;
