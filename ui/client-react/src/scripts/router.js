//these two imports are needed for safari and iOS to work with internationalization
import React from "react";
import {render} from "react-dom";
import {Router, Route, IndexRoute} from "react-router";
import AppHistory from '../globals/appHistory';
import PerfLogUtils from "../utils/perf/perfLogUtils";
import NavWrapper from "../components/nav/navWrapper";
import BuilderWrapper from '../components/builder/builderWrapper';
import AppsRoute from "../components/apps/appsRoute";
import AppHomePageRoute from "../components/app/appHomePageRoute";
import ReportRoute from "../components/report/reportRoute";
import RecordRoute from "../components/record/recordRoute";
import FormBuilderContainer from '../components/builder/formBuilderContainer';
import TableHomePageRoute from "../components/table/tableHomePageRoute";
import Logger from "../utils/logger";
import {APPS_ROUTE, APP_ROUTE, BUILDER_ROUTE} from '../constants/urlConstants';

import "react-fastclick";

import {Provider, connect} from "react-redux";
import createAppStore from './store';

import getFlux from './fluxxor';

let fluxxor = getFlux();

let logger = new Logger();
PerfLogUtils.setLogger(logger);

let history = AppHistory.setup(fluxxor).history;

const mapStateToProps = (state) => {
    return {
        qbui: state
    };
};

const ConnectedNav = connect(mapStateToProps)(NavWrapper); // pass Redux state as qbui prop
const ConnectedBuilderNav = connect(mapStateToProps)(BuilderWrapper); // pass Redux state as qbui prop

const store = createAppStore();

const createElementWithFlux = (Component, props) => <Component {...props} flux={fluxxor} />;

// render the UI, wrap the router in the react-redux Provider to make the Redux store available to connected components
render((
    <Provider store={store}>
        <Router history={history} createElement={createElementWithFlux} >

            <Route path={APPS_ROUTE} component={ConnectedNav} >
                <IndexRoute component={AppsRoute} />
            </Route>

            <Route path={`${APP_ROUTE}/:appId`} component={ConnectedNav} >
                <IndexRoute component={AppHomePageRoute} />
                <Route path="table/:tblId" component={TableHomePageRoute} />
                <Route path="table/:tblId/report/:rptId" component={ReportRoute} />
                <Route path="table/:tblId/report/:rptId/detailKeyFid/:detailKeyFid/detailKeyValue/:detailKeyValue" component={ReportRoute} />
                <Route path="table/:tblId/report/:rptId/record/:recordId" component={RecordRoute} />
                <Route path="table/:tblId/record/:recordId" component={RecordRoute} />
            </Route>

            <Route path={`${BUILDER_ROUTE}/app/:appId`} component={ConnectedBuilderNav}>
                <Route path="table/:tblId/form(/:formId)" component={FormBuilderContainer} />
            </Route>

        </Router>
    </Provider>
), document.getElementById('content'));
