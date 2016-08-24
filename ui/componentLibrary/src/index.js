//these two imports are needed for safari and iOS to work with internationalization
import Intl from 'intl';
import en from 'intl/locale-data/jsonp/en.js';

import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, IndexRedirect, browserHistory} from 'react-router';

import Nav from '../../client-react/src/components/nav/nav';

import AppsHome from '../../client-react/src/components/apps/home';
import AppsRoute from '../../client-react/src/components/apps/appsRoute';
import AppHomePageRoute from '../../client-react/src/components/app/appHomePageRoute';

import ReportRoute from '../../client-react/src/components/report/reportRoute';
import RecordRoute from '../../client-react/src/components/record/recordRoute';
import TableHomePageRoute from '../../client-react/src/components/table/tableHomePageRoute';

import ComponentLibraryWrapper from './components/componentLibrary';

import QBPanelDoc from './docs/qbpanel';
import QBIconDoc from './docs/qbicon';
import TextFieldDoc from './docs/textFieldValueRenderer';
import TextFieldValueEditorDoc from './docs/textFieldValueEditor';
import FieldValueEditorDoc from './docs/fieldValueEditor';

import './assets/componentLibrary.scss';

render((
    <Router history={browserHistory}>
        <Route path="components" component={ComponentLibraryWrapper}>
            <IndexRedirect to="qbpanel" />
            <Route path="qbpanel" component={QBPanelDoc} />
            <Route path="qbicon" component={QBIconDoc} />
            <Route path="textFieldValueRenderer" component={TextFieldDoc} />
            <Route path="textfieldValueEditor" component={TextFieldValueEditorDoc} />
            <Route path="fieldValueEditor" component={FieldValueEditorDoc} />
        </Route>
    </Router>
), document.getElementById('content'));
