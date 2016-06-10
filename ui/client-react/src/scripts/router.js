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
import ReportDataSearchStore from '../stores/reportDataSearchStore';
import reportDataActions from'../actions/reportDataActions';

import FieldsStore from '../stores/fieldsStore';
import fieldsActions from '../actions/fieldsActions';

import AppsStore from '../stores/appsStore';
import appsActions from '../actions/appsActions';

import NavStore from '../stores/navStore';
import navActions from '../actions/navActions';

import FacetMenuStore from '../stores/facetMenuStore';
import facetMenuActions from '../actions/facetMenuActions';

import AppsHome from '../components/apps/home';
import AppsRoute from '../components/apps/appsRoute';
import AppHomePageRoute from '../components/app/appHomePageRoute';

import ReportRoute from '../components/report/reportRoute';
import RecordRoute from '../components/record/recordRoute';
import TableHomePageRoute from '../components/table/tableHomePageRoute';

import _ from 'lodash';

import FastClick from 'fastclick';

let stores = {
    ReportsStore: new ReportsStore(),
    ReportDataStore: new ReportDataStore(),
    AppsStore: new AppsStore(),
    NavStore: new NavStore(),
    FacetMenuStore: new FacetMenuStore(),
    ReportDataSearchStore: new ReportDataSearchStore(),
    FieldsStore: new FieldsStore()
};
let flux = new Fluxxor.Flux(stores);
flux.addActions(reportActions);
flux.addActions(reportDataActions);
flux.addActions(appsActions);
flux.addActions(navActions);
flux.addActions(facetMenuActions);
flux.addActions(fieldsActions);

let NavWrapper = React.createClass({

    /* touch detection */
    isTouchDevice() {
        return "ontouchstart" in window;
    },
    getInitialState() {
        return {
            touch: this.isTouchDevice()
        };
    },
    childContextTypes: {
        touch: React.PropTypes.bool,
        locales: React.PropTypes.string
    },
    getChildContext: function() {
        return {
            touch: this.state.touch,
            locales: this.state.locales
        };
    },
    render: function() {
        return <Nav flux={flux} {...this.props} />;
    },

    componentDidMount: function() {
        FastClick.attach(document.body);

        if (this.isTouchDevice()) {
            document.body.className = "touch";
        }

        flux.actions.loadApps(true);

        if (this.props.params.appId) {
            flux.actions.selectAppId(this.props.params.appId);

            if (this.props.params.tblId) {
                flux.actions.selectTableId(this.props.params.tblId);
                flux.actions.loadFields(this.props.params.appId, this.props.params.tblId);
                flux.actions.loadReports(this.props.params.appId, this.props.params.tblId);
            } else {
                flux.actions.selectTableId(null);
            }
        }
    },

    componentWillReceiveProps(props) {
        if (props.params.appId) {
            if (this.props.params.appId !== props.params.appId) {
                flux.actions.selectAppId(props.params.appId);
            }
        } else {
            flux.actions.selectAppId(null);
        }

        if (this.props.params.appId !== props.params.appId) {
            flux.actions.selectAppId(props.params.appId);
        }
        if (props.params.tblId) {
            if (this.props.params.tblId !== props.params.tblId) {
                flux.actions.selectTableId(props.params.tblId);
                flux.actions.loadFields(props.params.appId, props.params.tblId);
                flux.actions.loadReports(props.params.appId, props.params.tblId);
            }
        } else {
            flux.actions.selectTableId(null);
        }
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


