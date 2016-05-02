import React from 'react';

import Logger from '../../utils/logger';
let logger = new Logger();
import ReportActions from '../actions/reportActions';
import ReportToolbar from './reportToolbar';
import ReportContent from './dataTable/reportContent';
import Fluxxor from 'fluxxor';
import './report.scss';

let FluxMixin = Fluxxor.FluxMixin(React);

/* The container for report and its toolbar */
let ReportToolsAndContent = React.createClass({
    mixins: [FluxMixin],

    propTypes: {
        appId: React.PropTypes.string,
        tblId: React.PropTypes.string,
        rptId: React.PropTypes.string,
        reportData: React.PropTypes.object,
        pageActions: React.PropTypes.element,
        callbacks:  React.PropTypes.object,
        selectedRows: React.PropTypes.array
    },
    getDefaultProps() {
        return {
            selections:null,
        };
    },

    getReportToolbar() {

        let {appId, tblId, rptId,
            reportData:{selections, ...otherReportData}} = this.props;

        return <ReportToolbar appId={appId}
                              tblId={tblId}
                              rptId={rptId}
                              reportData={otherReportData}
                              selections={selections}
                              searchStringForFiltering={this.props.searchStringForFiltering}
                              pageActions={this.props.pageActions}
                              nameForRecords={this.props.nameForRecords}
            {...this.props.callbacks} />;
    },
    getSelectionActions() {
        return (<ReportActions selection={this.props.selectedRows} />);
    },

    getTableActions() {
        const selectedRows = this.props.selectedRows;
        const hasSelection = !!(selectedRows && selectedRows.length);

        let classes = "tableActionsContainer secondaryBar";

        if (hasSelection) {
            classes += " selectionActionsOpen";
        }
        return (<div className={classes}>
                    {hasSelection ? this.getSelectionActions() : this.getReportToolbar()}
                </div>);
    },

    render() {
        let {appId, tblId, rptId, reportData:{selections, ...otherReportData}} = this.props;
        let toolbar = <ReportToolbar appId={appId}
                                     tblId={tblId}
                                     rptId={rptId}
                                     reportData={otherReportData}
                                     selections={selections}
                                     searchStringForFiltering={this.props.searchStringForFiltering}
                                     fields={this.props.fields}
                                     pageActions={this.props.pageActions}
                                     nameForRecords={this.props.nameForRecords}
                                     {...this.props.callbacks} />;

        return (<div className="reportToolsAndContentContainer">
                    {this.getTableActions()}
                    <ReportContent  reportData={this.props.reportData}
                                    reportHeader={toolbar}
                                    uniqueIdentifier="Record ID#"
                                    flux={this.getFlux()}
                                    {...this.props} />
                </div>);
    }
});

export default ReportToolsAndContent;
