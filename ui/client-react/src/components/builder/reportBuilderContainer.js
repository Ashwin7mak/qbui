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
import BuilderCustomDragLayer from '../../../../reuse/client/src/components/dragAndDrop/builderCustomDragLayer';
import DraggableReportHeaderCell from '../dataTable/reportGrid/draggableReportHeaderCell';
import QbGrid from '../dataTable/qbGrid/qbGrid';
import ReportCell from '../dataTable/reportGrid/reportCell';
import {CONTEXT} from '../../actions/context';
import {exitBuilderMode} from '../../actions/reportBuilderActions';
import {loadDynamicReport,loadReport} from '../../actions/reportActions';
import AppQbModal from '../qbModal/appQbModal';

import './reportBuilderContainer.scss';

const RECORD_SHOW_LIMIT = 50;

export class ReportBuilderContainer extends Component {

    /**
     * Load a report on refresh
     */
    componentWillMount() {
        let {appId, tblId, rptId} = this.props.match.params;
        this.props.loadReport(CONTEXT.REPORT.NAV,appId,tblId,rptId,true,0,RECORD_SHOW_LIMIT);
    }

    getSaveOrCancelFooter = () => {
        let {appId, tblId, rptId} = this.props.match.params;
        return (
            <ReportSaveOrCancelFooter
                className="reportBuilderSaveOrCancelFooter"
                appId={appId}
                tblId={tblId}
                rptId={rptId}
                reportData={this.props.reportData}
            />
        );
    };

    isOnlyOneColumnVisible(columns) {
        return columns.filter(column => {
            return !column.isHidden && !column.isPlaceholder;
        }).length === 1;
    }

    /**
     * Load a report with query parameters.
     */
    loadDynamicReport(appId, tblId, rptId, format, filter, queryParams) {
        this.props.loadDynamicReport(CONTEXT.REPORT.NAV, appId, tblId, rptId, format, filter, queryParams);
    }

    getReportBuilderContent = (columns, rows) => {
        let {appId, tblId, rptId} = this.props.match.params;
        let sortFids = (this.props.reportData && this.props.reportData.data) ? this.props.reportData.data.sortFids : [];
        let loading = columns.length === 0;
        return (
            <QbGrid
                loading={loading}
                numberOfColumns={columns.length}
                columns={columns}
                rows={rows}
                headerRenderer={DraggableReportHeaderCell}
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
        let {appId, tblId, rptId} = this.props.match.params;
        let {name, columns, records} = _.get(this.props, 'reportData.data', {});
        let transformedColumns = ReportColumnTransformer.transformColumnsForGrid(columns);
        transformedColumns.forEach(column => {
            column.fieldDef.userEditableValue = false;
        });
        let transformedRows = ReportRowTransformer.transformRecordsForGrid(_.take(records, RECORD_SHOW_LIMIT), columns);
        let content = this.getReportBuilderContent(transformedColumns, transformedRows);
        return (
            <div className="reportBuilderContainer">
                {/* AppQbModal is an app-wide modal that can be called from non-react classes*/}
                <AppQbModal/>
                {this.props.reportData &&
                <BuilderCustomDragLayer />
                <ReportFieldSelectMenu
                    className="reportBuilderFieldSelectMenu"
                    appId={appId}
                    tblId={tblId}
                    reportData={this.props.reportData}>
                    <div className="reportBuilderContainerContent">
                        <div className="reportBuilderHeader">
                            {rptId !== '0' && <ReportNameEditor className="reportBuilderNameEditor" name={name}/>}
                        </div>
                        <ReportToolsAndContent
                            className="reportBuilderToolsAndContent"
                            isRightToolbarVisible={false}
                            isSearchBoxVisible={false}
                            params={this.props.match.params}
                            reportData={this.props.reportData}
                            routeParams={this.props.match.params}
                            selectedAppId={this.props.match.params.appId}
                            selectedTable={this.props.match.params.tblId}
                            searchStringForFiltering={this.props.reportData ? this.props.reportData.searchStringForFiltering : ''}
                            selectedRows={this.props.reportData ? this.props.reportData.selectedRows : []}
                            loadDynamicReport={this.loadDynamicReport}
                            noRowsUI={true}
                            content={content}
                        />
                    </div>
                </ReportFieldSelectMenu>}
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
     * Report data */
    reportData: PropTypes.object,

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

const mapDispatchToProps = {
    exitBuilderMode,
    loadDynamicReport,
    loadReport
};

export default DragDropContext(TouchBackend({enableMouseEvents: true, delay: 30}))(
    connect(mapStateToProps, mapDispatchToProps)(ReportBuilderContainer));
