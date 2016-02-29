//these two imports are needed for safari and iOS to work with internationalization
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
import AppsRoute from '../components/apps/appsRoute';
import AppHomePageRoute from '../components/app/appHomePageRoute';

import ReportRoute from '../components/report/reportRoute';
import RecordRoute from '../components/record/recordRoute';
import TableHomePageRoute from '../components/table/tableHomePageRoute';

import FastClick from 'fastclick';

import Breakpoints from '../utils/breakpoints';

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
            breakpoint: Breakpoints.getCurrentBreakpointClass(),
            touch: Breakpoints.isTouchDevice()
        };
    },
    childContextTypes: {
        breakpoint: React.PropTypes.string,
        touch: React.PropTypes.bool
    },
    getChildContext: function() {
        return {
            breakpoint: this.state.breakpoint,
            touch: this.state.touch
        };
    },
    render: function() {
        return <Nav flux={flux} {...this.props} />;
    },

    /**
     * try to detect touch devices
     *
     * @returns {boolean}
     */

    handleResize: function() {

        let breakpoint = Breakpoints.getCurrentBreakpointClass();
        let bodyClasses = breakpoint;

        if (Breakpoints.isTouchDevice()) {
            bodyClasses += " touch";
        }

        document.body.className = bodyClasses;

        this.setState({breakpoint});
    },

    componentDidMount: function() {
        FastClick.attach(document.body);

        flux.actions.loadApps(true);

        if (this.props.params.appId && this.props.params.tblId) {
            flux.actions.selectAppId(this.props.params.appId);
            flux.actions.selectTableId(this.props.params.tblId);
            flux.actions.loadReports(this.props.params.appId, this.props.params.tblId);
        }
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    },

    componentWillReceiveProps(props) {
        if (this.props.params.appId && this.props.params.tblId && this.props.params.appId !== props.params.appId && this.props.params.tblId !== props.params.tblId) {
            flux.actions.selectAppId(this.props.params.appId);
            flux.actions.selectTableId(this.props.params.tblId);
            flux.actions.loadReports(this.props.params.appId, this.props.params.tblId);
        }
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
        flux.actions.loadApps(true);
    }
});

render((
    <Router history={createBrowserHistory()}>
        <Route path="/" component={Apps} />

        <Route path="apps" component={NavWrapper} >
            <IndexRoute component={AppsRoute} />
        </Route>

        <Route path="app/:appId" component={NavWrapper} >
            <IndexRoute component={AppHomePageRoute} />
            <Route path="table/:tblId" component={TableHomePageRoute} />
            <Route path="table/:tblId/report/:rptId" component={ReportRoute} />
            <Route path="table/:tblId/record/:recordId" component={RecordRoute} />
        </Route>

    </Router>
), document.getElementById('content'));


