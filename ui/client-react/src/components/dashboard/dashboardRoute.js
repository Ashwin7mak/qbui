import React from 'react';
import './dashboard.scss';
import ReportContent from '../report/dataTable/content';
import Fluxxor from 'fluxxor';

import Logger from '../../utils/logger';
let logger = new Logger();

let FluxMixin = Fluxxor.FluxMixin(React);

var DashboardRoute = React.createClass({
    mixins: [FluxMixin],

    // DEMO CODE TO EXPLORE NESTED TABLES etc.
    render: function() {

        return (<div className="dashboard">
                Dashboard goes here..
            </div>);
    }
});

export default DashboardRoute;
