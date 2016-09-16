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

import CheckBoxFieldValueEditorDoc from './docs/checkBoxFieldValueEditor';
import CheckBoxFieldValueRendererDoc from './docs/checkBoxFieldValueRenderer';
import FieldValueEditorDoc from './docs/fieldValueEditor';
import FieldValueRendererDoc from './docs/fieldValueRenderer';
import MultiLineTextFieldValueEditorDoc from './docs/multiLineTextFieldValueEditor';
import NumericFieldValueEditorDoc from './docs/numericFieldValueEditor';
import NumericFieldValueRendererDoc from './docs/numericFieldValueRenderer';
import TextFieldValueEditorDoc from './docs/textFieldValueEditor';
import TextFieldValueRendererDoc from './docs/textFieldValueRenderer';
import QBPanelDoc from './docs/qbpanel';
import QBIconDoc from './docs/qbicon';

import './assets/componentLibrary.scss';

render((
    <Router history={browserHistory}>
        <Route path="components" component={ComponentLibraryWrapper}>
            <IndexRedirect to="qbpanel" />
            <Route path="checkBoxFieldValueEditor" component={CheckBoxFieldValueEditorDoc} />
            <Route path="checkBoxFieldValueRenderer" component={CheckBoxFieldValueRendererDoc} />
            <Route path="fieldValueEditor" component={FieldValueEditorDoc} />
            <Route path="fieldValueRenderer" component={FieldValueRendererDoc} />
            <Route path="multiLineTextFieldValueEditor" component={MultiLineTextFieldValueEditorDoc} />
            <Route path="numericfieldValueEditor" component={NumericFieldValueEditorDoc} />
            <Route path="numericFieldValueRenderer" component={NumericFieldValueRendererDoc} />
            <Route path="textfieldValueEditor" component={TextFieldValueEditorDoc} />
            <Route path="textFieldValueRenderer" component={TextFieldValueRendererDoc} />
            <Route path="qbpanel" component={QBPanelDoc} />
            <Route path="qbicon" component={QBIconDoc} />
        </Route>
    </Router>
), document.getElementById('content'));
