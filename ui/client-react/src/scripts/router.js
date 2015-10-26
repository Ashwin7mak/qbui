import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import Nav from '../components/nav/nav';
import LeftNav from '../components/nav/leftNav';
import MobileLeftNav from '../components/nav/mobileLeftNav';

import TopNav from '../components/header/topNav';
import MobileTopNav from '../components/header/mobileTopNav';

import Footer from '../components/footer/footer';
import MobileAddFooter from '../components/footer/mobileAddFooter';
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
import TableHomePageRoute from '../components/table/tableHomePageRoute';
import DashboardRoute from '../components/dashboard/dashboardRoute';

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

function isMobileRoute(route) {
    return route.path.indexOf('m/') === 0;
}

let NavWrapper = React.createClass({
    render: function() {
        return <Nav flux={flux} {...this.props} mobile={isMobileRoute(this.props.route)} />;
    },
    componentDidMount: function() {
        flux.actions.loadReports({appId: this.props.params.appId, tblId: this.props.params.tblId});
    }
});

let Apps = React.createClass({
    render: function() {
        return <AppsHome flux={flux} mobile={isMobileRoute(this.props.route)}/>;
    },
    componentDidMount: function() {
        flux.actions.loadAppsWithTables();
    }
});

render((
    <Router history={createBrowserHistory()}>
        <Route path="/" component={Apps} />
        <Route path="apps" component={Apps} />

        <Route path="app/:appId/table/:tblId" component={NavWrapper} >
            <IndexRoute components={{main: TableHomePageRoute, topNav: TopNav, leftNav: LeftNav, footer: Footer}} />
            <Route path="report/:rptId" components={{main: ReportRoute, topNav: TopNav,  leftNav: LeftNav, footer: Footer}} />
            <Route path="dashboardDemo/:rptId" components={{main: DashboardRoute, topNav: TopNav,  leftNav: LeftNav, footer: Footer}} />
        </Route>

        <Route path="m/app/:appId/table/:tblId" component={NavWrapper} >
            <IndexRoute components={{main: TableHomePageRoute, leftNav: MobileLeftNav, footer: MobileAddFooter}} />
            <Route path="report/:rptId" components={{main: ReportRoute, topNav: MobileTopNav, leftNav: MobileLeftNav, footer: MobileAddFooter}} />
        </Route>

    </Router>
), document.getElementById('content'));


