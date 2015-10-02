import React from 'react';
import { Router, Route } from 'react-router';
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

let Nav = React.createClass({
    render: function() {
        return <NavComponent flux={flux} {...this.props}/>
    },
    componentDidMount: function () {
        flux.actions.loadReports({appId: this.props.params.appId, tblId: this.props.params.tblId});
    }
});

let Apps = React.createClass({
    render: function() {
        return <AppsHome flux={flux}/>
    },
    componentDidMount: function() {
        flux.actions.loadAppsWithTables();
    }
});

React.render((
    <Router history={createBrowserHistory()}>
        <Route path='/' name='default' component={Nav} />
        <Route path='apps' name='apps' component={Apps} />
        <Route path='app/:appId/table/:tblId/reports' name='reports' component={Nav} />
        <Route path='app/:appId/table/:tblId/report/:rptId' name='report' component={Nav} />
    </Router>
), document.getElementById('content') );


