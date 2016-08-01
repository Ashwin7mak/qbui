//these two imports are needed for safari and iOS to work with internationalization
import React from "react";
import ReactDOM, {render} from "react-dom";
import {Router, Route, IndexRoute} from "react-router";
import createBrowserHistory from "history/lib/createBrowserHistory";
import Nav from "../components/nav/nav";
import Fluxxor from "fluxxor";
import ReportsStore from "../stores/reportsStore";
import reportActions from "../actions/reportActions";
import ReportDataStore from "../stores/reportDataStore";
import ReportDataSearchStore from "../stores/reportDataSearchStore";
import RecordPendingEditsStore from "../stores/recordPendingEditsStore";
import reportDataActions from "../actions/reportDataActions";
import recordPendingEditsActions from "../actions/recordPendingEditsActions";
import FieldsStore from "../stores/fieldsStore";
import fieldsActions from "../actions/fieldsActions";
import AppsStore from "../stores/appsStore";
import appsActions from "../actions/appsActions";
import NavStore from "../stores/navStore";
import navActions from "../actions/navActions";
import FacetMenuStore from "../stores/facetMenuStore";
import facetMenuActions from "../actions/facetMenuActions";
import PerfStore from "../stores/perfStore";
import perfActions from "../actions/perfActions";
import PerfLogUtils from "../utils/perf/perfLogUtils";

import AppsHome from "../components/apps/home";
import AppsRoute from "../components/apps/appsRoute";
import AppHomePageRoute from "../components/app/appHomePageRoute";
import ReportRoute from "../components/report/reportRoute";
import RecordRoute from "../components/record/recordRoute";
import TableHomePageRoute from "../components/table/tableHomePageRoute";

import FormStore from '../stores/formStore';
import formActions from '../actions/formActions';
import Logger from "../utils/logger";
import FastClick from "fastclick";
import _ from 'lodash';

let logger = new Logger();
PerfLogUtils.setLogger(logger);

import tableActions from '../actions/tableActions';

let stores = {
    ReportsStore: new ReportsStore(),
    ReportDataStore: new ReportDataStore(),
    AppsStore: new AppsStore(),
    NavStore: new NavStore(),
    FacetMenuStore: new FacetMenuStore(),
    ReportDataSearchStore: new ReportDataSearchStore(),
    RecordPendingEditsStore: new RecordPendingEditsStore(),
    FieldsStore: new FieldsStore(),
    FormStore: new FormStore(),
    PerfStore: new PerfStore()
};
let flux = new Fluxxor.Flux(stores);
flux.addActions(reportActions);
flux.addActions(reportDataActions);
flux.addActions(recordPendingEditsActions);
flux.addActions(appsActions);
flux.addActions(navActions);
flux.addActions(facetMenuActions);
flux.addActions(fieldsActions);
flux.addActions(formActions);
flux.addActions(tableActions);
flux.addActions(perfActions);

//to ensure you don't get cascading dispatch errors with Fluxxor
// if you dispatch actions from within componentWillMount or componentDidMount
// this ties Fluxxor action dispatches to the React batched update
flux.setDispatchInterceptor(function(action, dispatch) {
    ReactDOM.unstable_batchedUpdates(function() {
        dispatch(action);
    });
});


var history;
/**
 * Instrumentation code of SPA history route change perf timing
 */
function hookHistory(theHistory) {
    flux.actions.newRoute("initialFullPageLoad");

    if (PerfLogUtils.isEnabled()) {
        theHistory.listen(function(ev) {
            // mark start of new route
            if (ev.action === "PUSH" || ev.action === "REPLACE") {
                flux.actions.newRoute("newroute:" + ev.pathname);
            }
        });
        return true;
    }
}

function setupHistory() {
    history = createBrowserHistory();
    hookHistory(history);
    return history;
}
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
    getChildContext() {
        return {
            touch: this.state.touch,
            locales: this.state.locales
        };
    },
    render() {
        return <Nav flux={flux} {...this.props} />;
    },

    componentDidMount() {
        FastClick.attach(document.body);

        // listen for resizes (nicely) in case we need to re-render for a new breakpoint
        window.addEventListener('resize', _.debounce(this.handleResize, 250));

        if (this.isTouchDevice()) {
            document.body.className = "touch";
        }

        flux.actions.loadApps(true);

        if (this.props.params.appId) {
            flux.actions.selectAppId(this.props.params.appId);

            if (this.props.params.tblId) {
                flux.actions.selectTableId(this.props.params.tblId);
                flux.actions.loadReports(this.props.params.appId, this.props.params.tblId);
            } else {
                flux.actions.selectTableId(null);
            }
        }
    },
    /**
     * force rerender since breakpoint may have changed
     */
    handleResize: function() {
        this.setState(this.state);
    },

    /**
     * clean up listener
     */
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
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
                flux.actions.loadReports(props.params.appId, props.params.tblId);
            }
        } else {
            flux.actions.selectTableId(null);
        }
    }
});

let Apps = React.createClass({
    render() {
        return <AppsHome flux={flux} />;
    },
    componentDidMount() {
        flux.actions.loadApps(true);
    }
});

render((
    <Router history={setupHistory()}>
        <Route path="/" component={Apps} />

        <Route path="apps" component={NavWrapper} >
            <IndexRoute component={AppsRoute} />
        </Route>

        <Route path="app/:appId" component={NavWrapper} >
            <IndexRoute component={AppHomePageRoute} />
            <Route path="table/:tblId" component={TableHomePageRoute} />
            <Route path="table/:tblId/report/:rptId" component={ReportRoute} />
            <Route path="table/:tblId/report/:rptId/record/:recordId" component={RecordRoute} />
            <Route path="table/:tblId/record/:recordId" component={RecordRoute} />

        </Route>

    </Router>
), document.getElementById('content'));


