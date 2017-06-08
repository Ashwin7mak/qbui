//these two imports are needed for safari and iOS to work with internationalization
import React from "react";
import {render} from "react-dom";
import {Router, Switch} from "react-router-dom";
import AppHistory from '../globals/appHistory';
import PerfLogUtils from "../utils/perf/perfLogUtils";
import NavWrapper from "../components/nav/navWrapper";
import BuilderWrapper from '../components/builder/builderWrapper';
import SettingsWrapper from '../components/settings/settingsWrapper';
import AppsRoute from "../components/apps/appsRoute";
import AppHomePageRoute from "../components/app/appHomePageRoute";
import ReportRoute from "../components/report/reportRoute";
import RecordRoute from "../components/record/recordRoute";
import FormBuilderContainer from '../components/builder/formBuilderContainer';
import ReportBuilderContainer from '../components/builder/reportBuilderContainer';
import TableHomePageRoute from "../components/table/tableHomePageRoute";
import FeatureSwitchesRoute from "../components/featureSwitches/featureSwitchesRoute";
import FeatureSwitchOverridesRoute from "../components/featureSwitches/featureSwitchOverridesRoute";
import * as FeatureSwitchActions from '../actions/featureSwitchActions';
import AppSettingsRoute from "../components/app/settings/appSettingsRoute";
import AppUsersRoute from "../components/app/settings/categories/appUsersRoute";
import AppPropertiesRoute from "../components/app/settings/categories/appPropertiesRoute";
import TablePropertiesRoute from "../components/table/settings/tablePropertiesRoute";
import AutomationListRoute from "../components/automation/settings/automationListRoute";
import AutomationViewRoute from "../components/automation/settings/automationViewRoute";
import AutomationEditRoute from "../components/automation/settings/automationEditRoute";
import AppsBundleLoader from '../locales/appsBundleLoader';
import config from '../config/app.config';

import Logger from "../utils/logger";
import {APPS_ROUTE, APP_ROUTE, AUTOMATION, BUILDER_ROUTE, ADMIN_ROUTE, SETTINGS_ROUTE} from '../constants/urlConstants';

import {editRecordCancel, createRecord, updateRecord} from '../actions/recordActions';
import {showErrorMsgDialog, hideTrowser} from '../actions/shellActions';
import {updateForm, saveFormComplete, setFormBuilderPendingEditToFalse} from '../actions/formActions';
import {setReportBuilderPendingEditToFalse, saveReport} from '../actions/reportBuilderActions';
import {setFieldsPropertiesPendingEditToFalse} from '../actions/fieldsActions';
import {getNavReport} from '../reducers/report';

import "react-fastclick";

import {Provider, connect} from "react-redux";
import createAppStore from './store';

import getFlux from './fluxxor';
import RouteWithSubRoutes from "./RouteWithSubRoutes";

let fluxxor = getFlux();

let logger = new Logger();
PerfLogUtils.setLogger(logger);

const store = createAppStore();
let storeFunc = {
    editRecordCancel,
    createRecord,
    updateRecord,
    hideTrowser,
    updateForm,
    saveReport,
    saveFormComplete,
    showErrorMsgDialog,
    getNavReport,
    setFieldsPropertiesPendingEditToFalse,
    setFormBuilderPendingEditToFalse,
    setReportBuilderPendingEditToFalse
};
//  pass references to redux store and methods called within the appHistory component
let history = AppHistory.setup(store, storeFunc).history;

const mapStateToProps = (state) => {
    return {
        qbui: state
    };
};


const withFlux = (ComponentToWrap) => {
    class WrappedComponent extends React.Component {
        render() {
            const {...props} = this.props;
            return <ComponentToWrap {...props} flux={fluxxor}/>;
        }
    }
    return WrappedComponent;
};

const ConnectedNav = connect(mapStateToProps)(withFlux(NavWrapper)); // pass Redux state as qbui prop
const ConnectedBuilderNav = connect(mapStateToProps)(withFlux(BuilderWrapper)); // pass Redux state as qbui prop
const ConnectedSettingsNav = connect(mapStateToProps)(withFlux(SettingsWrapper)); // pass Redux state as qbui prop

// init the localization services
AppsBundleLoader.changeLocale(config.locale.default);

// init the feature switches
store.dispatch(FeatureSwitchActions.getStates());

const createElementWithFlux = (Component, props) => <Component {...props} flux={fluxxor} />;

/**
 * routes config
 * each entry is a route config that contains:
 *          path -  string the URL path pattern to match (see https://www.npmjs.com/package/path-to-regexp for the patterns supported )
 *                  if path is not included or en all routes will match the item
 *          component - the Component to render when the match occurs (required)
 *          routes - an array child routes that occur under within the route (optional)
 *          props - object with any properties to be included when rendering the component (optional)
 **/
const routes = [
    {
        path: ADMIN_ROUTE,
        component: ConnectedNav,
        routes: [
            {
                path: `${ADMIN_ROUTE}/featureSwitches/:id`,
                component: FeatureSwitchOverridesRoute
            },
            {
                path: `${ADMIN_ROUTE}/featureSwitches`,
                component: FeatureSwitchesRoute
            }
        ]
    },
    {
        path: `${APP_ROUTE}/:appId/users`,
        component: ConnectedNav,
        routes: [
            {
                path: `${APP_ROUTE}/:appId/users`,
                component: AppUsersRoute
            }
        ]
    },
    {
        path: `${APP_ROUTE}/:appId/(table)?/:tblId?`,
        component: ConnectedNav,
        routes:  [
            {
                path: `${APP_ROUTE}/:appId/table/:tblId/(report)?/:rptId?/record/:recordId`,
                exact: false,
                component: RecordRoute
            },
            {
                path: `${APP_ROUTE}/:appId/table/:tblId/report/:rptId/`,
                exact: false,
                component: ReportRoute
            },
            {
                path: `${APP_ROUTE}/:appId/table/:tblId/record/:recordId`,
                exact: false,
                component: RecordRoute
            },
            {
                path: `${APP_ROUTE}/:appId/table/:tblId`,
                exact: true,
                component: TableHomePageRoute
            },
            {
                path: `${APP_ROUTE}/:appId/users`,
                exact: true,
                component: withFlux(AppUsersRoute)
            },
            {
                path: `${APP_ROUTE}/:appId`,
                exact: true,
                component: AppHomePageRoute
            }
        ]
    },
    {
        path: APPS_ROUTE,
        exact: true,
        component: ConnectedNav,
        routes: [
            {
                path: APPS_ROUTE,
                component: AppsRoute
            }
        ]
    },
    {
        path: `${BUILDER_ROUTE}/app/:appId`,
        component: ConnectedBuilderNav,
        routes: [
            {
                path: `${BUILDER_ROUTE}/app/:appId/table/:tblId/form/:formId?`,
                component: FormBuilderContainer
            },
            {
                path: `${BUILDER_ROUTE}/app/:appId/table/:tblId/report/:rptId`,
                component: ReportBuilderContainer
            }
        ]
    },
    {
        path: `${SETTINGS_ROUTE}/app/:appId/table/:tblId`,
        component: ConnectedSettingsNav,
        routes: [
            {
                path: `${SETTINGS_ROUTE}/app/:appId/table/:tblId/properties`,
                exact: true,
                component: withFlux(TablePropertiesRoute)
            }
        ]
    },
    {
        path: `${SETTINGS_ROUTE}/app/:appId/`,
        component: ConnectedSettingsNav,
        routes: [
            {
                path: `${SETTINGS_ROUTE}/app/:appId/properties`,
                component: AppPropertiesRoute
            },
            {
                path: `${SETTINGS_ROUTE}/app/:appId/${AUTOMATION.PATH}/:automationId/${AUTOMATION.VIEW}`,
                component: AutomationViewRoute
            },
            {
                path: `${SETTINGS_ROUTE}/app/:appId/${AUTOMATION.PATH}/:automationId/${AUTOMATION.EDIT}`,
                component: AutomationEditRoute
            },
            {
                path: `${SETTINGS_ROUTE}/app/:appId/${AUTOMATION.PATH}`,
                component: AutomationListRoute
            },
            {
                path: `${SETTINGS_ROUTE}/app/:appId`,
                exact: true,
                component: AppSettingsRoute
            }
        ]
    },
];

render((
    <Provider store={store}>
        <Router history={history} createElement={createElementWithFlux} >
                {/*  within Switch 1st match wins
                    includes all the above top level routes and passes on the child routes in the properties
                    note if an entry it is without a path to match it matches all
                    the route has to come after specific routes to be matched within a switch
                 */}
                <Switch>
                    {routes.map((route, i) =>
                        (RouteWithSubRoutes(route, i))
                    )}
                </Switch>
        </Router>
    </Provider>
), document.getElementById('content'));
