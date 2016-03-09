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

    getDefaultProps() {
        return {
            selections:null,
        };
    },
    render() {
        var {appId, tblId, rptId, reportData:{selections, searchStringForFiltering, ...otherReportData}} = this.props;
        let toolbar = <ReportToolbar appId={appId}
                                    tblId={tblId}
                                    rptId={rptId}
                                    reportData={otherReportData}
                                    selections={selections}
                                    searchStringForFiltering={searchStringForFiltering}/>;

        return (<div className="reportToolsAndContentContainer">
                    <ReportContent  reportData={this.props.reportData}
                                    reportHeader={toolbar}
                                    {...this.props} />
                </div>);
    }
});

export default ReportToolsAndContent;
