import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {DragDropContext} from 'react-dnd';
import TouchBackend from 'react-dnd-touch-backend';
import ReportColumnTransformer from '../dataTable/reportGrid/reportColumnTransformer';
import ReportRowTransformer from '../dataTable/reportGrid/reportRowTransformer';
import ReportColumnHeaderMenu from '../dataTable/reportGrid/reportColumnHeaderMenu';
import ReportNameEditor from '../reportBuilder/reportNameEditor';
import ReportFieldSelectMenu from '../reportBuilder/reportFieldSelectMenu';
import ReportSaveOrCancelFooter from '../reportBuilder/reportSaveOrCancelFooter';
import ReportToolsAndContent from '../report/reportToolsAndContent';
import QbGrid from '../dataTable/qbGrid/qbGrid';
import ReportCell from '../dataTable/reportGrid/reportCell';
import Locale from '../../locales/locales';
import {CONTEXT} from '../../actions/context';
import {exitBuilderMode, closeFieldSelectMenu} from '../../actions/reportBuilderActions';
import {loadDynamicReport} from '../../actions/reportActions';

import './reportBuilderContainer.scss';

export class ReportBuilderContainer extends Component {
    constructor(props) {
        super(props);
    }

    getSaveOrCancelFooter = () => {
        let {appId, tblId} = this.props.match.params;
        return <ReportSaveOrCancelFooter appId={appId} tblId={tblId}/>;
    };

    isOnlyOneColumnVisible(columns) {
        return columns.filter(column => {
                return !column.isHidden && !column.isPlaceholder;
            }).length === 1;
    };

    /**
     * Load a report with query parameters.
     */
    loadDynamicReport(appId, tblId, rptId, format, filter, queryParams) {
        this.props.loadDynamicReport(CONTEXT.REPORT.NAV, appId, tblId, rptId, format, filter, queryParams);
    }

    getReportBuilderContent(columns, rows) {
        let {appId, tblId, rptId} = this.props.match.params;
        let sortFids = this.props.reportData.data ? this.props.reportData.data.sortFids : [];
        return (
            <QbGrid
                numberOfColumns={columns.length}
                columns={columns}
                rows={rows}
                isDraggable={true}
                cellRenderer={ReportCell}
                menuComponent={ReportColumnHeaderMenu}
                showRowActionsColumn={false}
                menuProps={{
                    appId: appId,
                    tblId: tblId,
                    rptId: rptId,
                    sortFids: sortFids,
                    isOnlyOneColumnVisible: this.isOnlyOneColumnVisible(columns)
                }}
            />
        );
    }

    render() {
        let {appId, tblId} = this.props.match.params;
        let name = this.props.reportData.data ? this.props.reportData.data.name : undefined;
        let columns = this.props.reportData.data ? this.props.reportData.data.columns : [];
        let records = this.props.reportData.data ? this.props.reportData.data.records : [];
        let recordShowLimit = 50;
        let transformedColumns = ReportColumnTransformer.transformColumnsForGrid(columns);
        transformedColumns.forEach(column => {
            column.fieldDef.userEditableValue = false;
        });
        let transformedRows = ReportRowTransformer.transformRecordsForGrid(_.take(records, recordShowLimit), columns);
        let content = this.getReportBuilderContent(transformedColumns, transformedRows);
        return (
            <div className="reportBuilderContainer">
                <ReportFieldSelectMenu
                    appId={appId}
                    tblId={tblId}
                    reportData={this.props.reportData}>
                    <div className="reportBuilderContainerContent">
                        <div className="reportBuilderHeader">
                            {name && <ReportNameEditor name={name}/>}
                        </div>
                        <ReportToolsAndContent
                            isRightToolbarVisible={false}
                            isSearchBoxVisible={false}
                            params={this.props.match.params}
                            reportData={this.props.reportData}
                            routeParams={this.props.match.params}
                            selectedAppId={this.props.match.params.appId}
                            selectedTable={this.props.match.params.tblId}
                            searchStringForFiltering={this.props.reportData.searchStringForFiltering}
                            selectedRows={this.props.reportData.selectedRows}
                            loadDynamicReport={this.loadDynamicReport}
                            noRowsUI={true}
                            content={content}
                        />
                    </div>
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
            tblId: PropTypes.string,

            /**
             * the report id */
            rptId: PropTypes.string
        })
    }),

    /**
     * A route that will be redirected to after a save/cancel action. Currently passed through mapState. */
    redirectRoute: PropTypes.string
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

        closeFieldSelectMenu: (context) => dispatch(closeFieldSelectMenu(context)),

        loadDynamicReport: (context, appId, tblId, rptId, format, filter, queryParams) => {
            dispatch(loadDynamicReport(context, appId, tblId, rptId, format, filter, queryParams))
        }
    };
};

export default DragDropContext(TouchBackend({enableMouseEvents: true, delay: 30}))(
    connect(mapStateToProps, mapDispatchToProps)(ReportBuilderContainer));
