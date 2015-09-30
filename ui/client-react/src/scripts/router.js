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

import AppsHome from '../components/apps/home';

let stores = {
    ReportsStore: new ReportsStore(),
    ReportDataStore: new ReportDataStore(),
    AppsStore: new AppsStore()
};
let flux = new Fluxxor.Flux(stores);
flux.addActions(reportActions);
flux.addActions(reportDataActions);
flux.addActions(appsActions);

flux.actions.loadReports('mydbid');
flux.actions.loadAppsWithTables();

class Nav extends React.Component {
    render() {
        return <NavComponent flux={flux} {...this.props}/>
    }
};

class Apps extends React.Component {
    render() {
        return <AppsHome flux={flux}/>
    }
}


React.render((
    <Router history={createBrowserHistory()}>
        <Route path="/" name="default" component={Nav} />
        <Route path="apps" name="apps" component={Apps} />
        <Route path="app/:appId/table/:tblId/reports" name="reports" component={Nav} />
        <Route path="app/:appId/table/:tblId/report/:rptId" name="report" component={Nav} />
    </Router>
), document.getElementById('content') );


