import React from 'react';

import Logger from '../../utils/logger';
let logger = new Logger();

import ReportToolbar from './reportToolbar';
import ReportContent from './dataTable/content';
import Fluxxor from 'fluxxor';
import './report.scss';

let FluxMixin = Fluxxor.FluxMixin(React);

var ReportToolsAndContent = React.createClass({
    mixins: [FluxMixin],

    render() {

        return (<div className="reportToolsAndContentContainer">
            <ReportToolbar reportData={this.props.reportData}  {...this.props}  />
            <ReportContent reportData={this.props.reportData}  {...this.props} />
        </div>);
    }
});

export default ReportToolsAndContent;


