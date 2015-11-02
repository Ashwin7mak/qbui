import Intl from 'intl';
import en from 'intl/locale-data/jsonp/en.js';

import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import Nav from '../components/nav/nav';

import Fluxxor from 'fluxxor';

import ReportsStore from '../stores/reportsStore';
import reportActions from'../actions/reportActions';

import ReportDataStore from '../stores/reportDataStore';
import reportDataActions from'../actions/reportDataActions';

import AppsStore from '../stores/appsStore';
import appsActions from '../actions/appsActions';

import NavStore from '../stores/navStore';
import navActions from '../actions/navActions';

import AppsHome from '../components/apps/home';

import ReportRoute from '../components/report/reportRoute';
import RecordRoute from '../components/record/recordRoute';
import TableHomePageRoute from '../components/table/tableHomePageRoute';
import DashboardRoute from '../components/dashboard/dashboardRoute';

import * as breakpoints from '../constants/breakpoints';

let stores = {
    ReportsStore: new ReportsStore(),
    ReportDataStore: new ReportDataStore(),
    AppsStore: new AppsStore(),
    NavStore: new NavStore()
};
let flux = new Fluxxor.Flux(stores);
flux.addActions(reportActions);
flux.addActions(reportDataActions);
flux.addActions(appsActions);
flux.addActions(navActions);

let NavWrapper = React.createClass({
    getInitialState() {
        return {
            breakpoint: this.getCurrentBreakpointClass()
        };
    },
    getCurrentBreakpointClass: function() {
        let w = window.innerWidth;

        if (w <= 640) {
            return breakpoints.SMALL_BREAKPOINT;
        } else if (w <= 1024) {
            return breakpoints.MEDIUM_BREAKPOINT;
        } else if (w <= 1440) {
            return breakpoints.LARGE_BREAKPOINT;
        } else {
            return breakpoints.XLARGE_BREAKPOINT;
        }
    },
    render: function() {
        return <Nav flux={flux} {...this.props}  breakpoint={this.state.breakpoint} />;
    },

    //need to debounce this...
    handleResize: function() {

        let breakpoint = this.getCurrentBreakpointClass();

        this.setState({breakpoint});
    },
    componentDidMount: function() {
        flux.actions.loadReports({appId: this.props.params.appId, tblId: this.props.params.tblId});

        window.addEventListener('resize', this.handleResize);
    },
    componentWillUnmount: function() {
        window.removeEventListener('resize', this.handleResize);
    }
});

let Apps = React.createClass({
    render: function() {
        return <AppsHome flux={flux} />;
    },
    componentDidMount: function() {
        flux.actions.loadAppsWithTables();
    }
});

render((
    <Router history={createBrowserHistory()}>
        <Route path="/" component={Apps} />
        <Route path="apps" component={Apps} />
        <Route path="m/apps" component={Apps} />

        <Route path="app/:appId/table/:tblId" component={NavWrapper} >
            <IndexRoute components={{main: TableHomePageRoute}} />
            <Route path="report/:rptId" components={{main: ReportRoute}} />
            <Route path="record/:recordId" components={{main: RecordRoute}} />
            <Route path="dashboardDemo/:rptId" components={{main: DashboardRoute}} />
        </Route>


    </Router>
), document.getElementById('content'));


