//these two imports are needed for safari and iOS to work with internationalization
import React from "react";
import {render} from "react-dom";
import {Router, Route, IndexRoute} from "react-router";
import AppHistory from '../globals/appHistory';

import PerfLogUtils from "../utils/perf/perfLogUtils";

import NavWrapper from "../components/nav/navWrapper";
import AppsRoute from "../components/apps/appsRoute";
import AppHomePageRoute from "../components/app/appHomePageRoute";
import ReportRoute from "../components/report/reportRoute";
import RecordRoute from "../components/record/recordRoute";
import TableHomePageRoute from "../components/table/tableHomePageRoute";

import Logger from "../utils/logger";

import "react-fastclick";

import {Provider,connect} from "react-redux";
import * as ShellActions from '../actions/shellActions';

import createAppStore from './store';

import getFlux from './fluxxor';

let fluxxor = getFlux();

let logger = new Logger();
PerfLogUtils.setLogger(logger);

let history = AppHistory.setup(fluxxor).history;

const mapStateToProps = (state) => {
    return {
        qbui: state
    }
};

const NavContainer = connect(mapStateToProps)(NavWrapper);

//const NavContainer = () => <NavWrapper flux={fluxxor}/>;

const store = createAppStore();


const createElementWithFlux = (Component, props) => <Component {...props} flux={fluxxor} />;

render((
    <Provider store={store}>
        <Router history={history} createElement={createElementWithFlux} >

            <Route path="/qbase/apps" component={NavContainer} >
                <IndexRoute component={AppsRoute} />
            </Route>

            <Route path="/qbase/app/:appId" component={NavContainer} >
                <IndexRoute component={AppHomePageRoute} />
                <Route path="table/:tblId" component={TableHomePageRoute} />
                <Route path="table/:tblId/report/:rptId" component={ReportRoute} />
                <Route path="table/:tblId/report/:rptId/record/:recordId" component={RecordRoute} />
                <Route path="table/:tblId/record/:recordId" component={RecordRoute} />
            </Route>

        </Router>
    </Provider>
), document.getElementById('content'));


