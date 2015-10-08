import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import NavComponent from '../components/nav/nav';
import Fluxxor from 'fluxxor';

import ReportsStore from '../stores/ReportsStore';
import reportActions from'../actions/reportActions';

import ReportDataStore from '../stores/ReportDataStore';
import reportDataActions from'../actions/reportDataActions';

import AppsStore from '../stores/AppsStore';
import appsActions from '../actions/appsActions';

import NavStore from '../stores/navStore';
import navActions from '../actions/navActions';

import AppsHome from '../components/apps/home';

import ReportRoute from '../components/report/reportRoute';
import TableHomePageRoute from '../components/table/tableHomePageRoute';

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
    return route.path.indexOf('m/')==0;
}

let Nav = React.createClass({
    render: function() {
        return <NavComponent flux={flux} {...this.props} mobile={isMobileRoute(this.props.route)} />
    },
    componentDidMount: function () {
        flux.actions.loadReports({appId: this.props.params.appId, tblId: this.props.params.tblId});
    }
});

let Apps = React.createClass({
    render: function() {
        return <AppsHome flux={flux} mobile={isMobileRoute(this.props.route)}/>
    },
    componentDidMount: function() {
        flux.actions.loadAppsWithTables();
    }
});

React.render((
    <Router history={createBrowserHistory()}>
        <Route path='/' name='default' component={Apps} />
        <Route path='apps' name='apps' component={Apps} />
        <Route path='app/:appId/table/:tblId/reports' name='reports' component={Nav} />

        <Route path='app/:appId/table/:tblId' component={Nav} >
            <IndexRoute component={TableHomePageRoute} />
            <Route path='report/:rptId' component={ReportRoute} />
        </Route>

        <Route path='m/app/:appId/table/:tblId' component={Nav} >
            <IndexRoute component={TableHomePageRoute} />
            <Route path='report/:rptId' component={ReportRoute} />
        </Route>

    </Router>
), document.getElementById('content') );


