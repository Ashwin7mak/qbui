//these two imports are needed for safari and iOS to work with internationalization
import Intl from 'intl';
import en from 'intl/locale-data/jsonp/en.js';

import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, IndexRedirect} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import Nav from '../nav/nav';

import AppsHome from '../apps/home';
import AppsRoute from '../apps/appsRoute';
import AppHomePageRoute from '../app/appHomePageRoute';

import ReportRoute from '../report/reportRoute';
import RecordRoute from '../record/recordRoute';
import TableHomePageRoute from '../table/tableHomePageRoute';

import ComponentLibraryWrapper from './src/componentLibrary';
import ComponentRoute from './src/ComponentLibraryRoute';

import './assets/componentLibrary.scss';

render((
    <Router history={createBrowserHistory()}>
        <Route path="components" component={ComponentLibraryWrapper}>
            <IndexRedirect to="qbpanel" />
            <Route path=":componentName" component={ComponentRoute} />
        </Route>
    </Router>
), document.getElementById('content'));
