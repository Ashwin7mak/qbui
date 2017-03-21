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
import FeatureSwitchesRoute from "../components/featureSwitches/featureSwitchesRoute";
import FeatureSwitchOverridesRoute from "../components/featureSwitches/featureSwitchOverridesRoute";
import * as FeatureSwitchActions from '../actions/featureSwitchActions';
import AppSettingsRoute from "../components/app/settings/appSettingsRoute";
import AppUsersRoute from "../components/app/settings/categories/appUsersRoute";
import AppPropertiesRoute from "../components/app/settings/categories/appPropertiesRoute";

import Logger from "../utils/logger";
import {APPS_ROUTE, APP_ROUTE, BUILDER_ROUTE, ADMIN_ROUTE} from '../constants/urlConstants';

import {editRecordCancel, createRecord, updateRecord} from '../actions/recordActions';

import "react-fastclick";

import {Provider, connect} from "react-redux";
import createAppStore from './store';

import getFlux from './fluxxor';

let fluxxor = getFlux();

let logger = new Logger();
PerfLogUtils.setLogger(logger);

const store = createAppStore();
let storeFunc = {
    editRecordCancel: editRecordCancel,
    createRecord: createRecord,
    updateRecord: updateRecord
};
//  pass references to redux store and methods called within the appHistory component
let history = AppHistory.setup(store, storeFunc).history;

const mapStateToProps = (state) => {
    return {
        qbui: state
    };
};
const ConnectedNav = connect(mapStateToProps)(NavWrapper); // pass Redux state as qbui prop
const ConnectedBuilderNav = connect(mapStateToProps)(BuilderWrapper); // pass Redux state as qbui prop

// init the feature switches
store.dispatch(FeatureSwitchActions.getStates());

const createElementWithFlux = (Component, props) => <Component {...props} flux={fluxxor} />;

// render the UI, wrap the router in the react-redux Provider to make the Redux store available to connected components
render((
    <Provider store={store}>
        <Router history={history} createElement={createElementWithFlux} >

            <Route path={APPS_ROUTE} component={ConnectedNav} >
                <IndexRoute component={AppsRoute} />
            </Route>

            <Route path={ADMIN_ROUTE} component={ConnectedNav} >
                <Route path="featureSwitches" component={FeatureSwitchesRoute} />
                <Route path="featureSwitch/:id" component={FeatureSwitchOverridesRoute} />
            </Route>

            <Route path={`${APP_ROUTE}/:appId`} component={ConnectedNav} >
                <IndexRoute component={AppHomePageRoute} />
                <Route path="settings" component={AppSettingsRoute} />
                <Route path="users" component={AppUsersRoute} />
                <Route path="properties" component={AppPropertiesRoute} />
                <Route path="table/:tblId" component={TableHomePageRoute} />
                <Route path="table/:tblId/report/:rptId" component={ReportRoute} />
                <Route path="table/:tblId/report/:rptId/record/:recordId" component={RecordRoute} />
                <Route path="table/:tblId/record/:recordId" component={RecordRoute} />
            </Route>

            <Route path={`${BUILDER_ROUTE}/app/:appId`} component={ConnectedBuilderNav}>
                <Route path="table/:tblId/form(/:formId)" component={FormBuilderContainer} />
            </Route>

        </Router>
    </Provider>
), document.getElementById('content'));
