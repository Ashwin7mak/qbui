import React from 'react';

import Logger from '../../utils/logger';
let logger = new Logger();

import ReportToolbar from './reportToolbar';
import ReportContent from './dataTable/reportContent';
import Fluxxor from 'fluxxor';
import './report.scss';

let FluxMixin = Fluxxor.FluxMixin(React);

/* The container for report and its toolbar */
var ReportToolsAndContent = React.createClass({
    mixins: [FluxMixin],

    propTypes: {
        appId: React.PropTypes.string,
        tblId: React.PropTypes.string,
        rptId: React.PropTypes.string,
        reportData: React.PropTypes.object,
        pageActions: React.PropTypes.element,
        callbacks :  React.PropTypes.object,
    },
    getDefaultProps() {
        return {
            selections:null,
        };
    },
    render() {
        var {appId, tblId, rptId,
             reportData:{selections, ...otherReportData}} = this.props;
        let toolbar = <ReportToolbar appId={appId}
                                     tblId={tblId}
                                     rptId={rptId}
                                     reportData={otherReportData}
                                     selections={selections}
                                     searchStringForFiltering={this.props.searchStringForFiltering}
                                     pageActions={this.props.pageActions}
                                     nameForRecords={this.props.nameForRecords}
                                     {...this.props.callbacks} />;

        return (<div className="reportToolsAndContentContainer">
                    <ReportContent  reportData={this.props.reportData}
                                    reportHeader={toolbar}
                                    {...this.props} />
                </div>);
    }
});

export default ReportToolsAndContent;
