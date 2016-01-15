import React from 'react';

import Logger from '../../utils/logger';
let logger = new Logger();

import ReportToolbar from './reportToolbar';
import ReportContent from './dataTable/reportContent';
import Fluxxor from 'fluxxor';
import './report.scss';

let FluxMixin = Fluxxor.FluxMixin(React);

var ReportToolsAndContent = React.createClass({
    mixins: [FluxMixin],

    render() {
        var header = <ReportToolbar reportData={this.props.reportData}  {...this.props}  />;
        return (<div className="reportToolsAndContentContainer">
                    <ReportContent  reportData={this.props.reportData}
                                    reportHeader={header}
                                    {...this.props} />
                </div>);
    }
});

export default ReportToolsAndContent;


