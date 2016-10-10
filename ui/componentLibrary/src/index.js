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
import './assets/componentLibrary.scss';

import CheckBoxFieldValueEditorDoc from './docs/checkBoxFieldValueEditor';
import CheckBoxFieldValueRendererDoc from './docs/checkBoxFieldValueRenderer';
import DateFieldValueEditorDoc from './docs/dateFieldValueEditor.js';
import DateTimeFieldValueEditorDoc from './docs/dateTimeFieldValueEditor.js';
import DateTimeFieldValueRendererDoc from './docs/dateTimeFieldValueRenderer.js';
import FieldValueEditorDoc from './docs/fieldValueEditor';
import FieldValueRendererDoc from './docs/fieldValueRenderer';
import MultiChoiceFieldValueEditorDoc from './docs/multiChoiceFieldValueEditor';
import MultiLineTextFieldValueEditorDoc from './docs/multiLineTextFieldValueEditor';
import NumericFieldValueEditorDoc from './docs/numericFieldValueEditor';
import NumericFieldValueRendererDoc from './docs/numericFieldValueRenderer';
import TextFieldValueEditorDoc from './docs/textFieldValueEditor';
import TextFieldValueRendererDoc from './docs/textFieldValueRenderer';
import TimeFieldValueEditorDoc from './docs/timeFieldValueEditor.js';
import TimeFieldValueRendererDoc from './docs/timeFieldValueRenderer.js';
import UrlFieldValueEditorDoc from './docs/urlFieldValueEditor.js';
import UrlFieldValueRendererDoc from './docs/urlFieldValueRenderer.js';
import UserFieldEditorDoc from './docs/userFieldValueEditor';
import UserFieldRendererDoc from './docs/userFieldValueRenderer';
import QBPanelDoc from './docs/qbpanel';
import QBIconDoc from './docs/qbicon';

// END OF IMPORT STATEMENTS
// Above comment used for Grunt task. Please do not delete.

render((
    <Router history={browserHistory}>
        <Route path="components" component={ComponentLibraryWrapper}>
            <IndexRedirect to="qbpanel" />
            <Route path="checkBoxFieldValueEditor" component={CheckBoxFieldValueEditorDoc} />
            <Route path="checkBoxFieldValueRenderer" component={CheckBoxFieldValueRendererDoc} />
            <Route path="dateFieldValueEditor" component={DateFieldValueEditorDoc} />
            <Route path="dateTimeFieldValueEditor" component={DateTimeFieldValueEditorDoc} />
            <Route path="dateTimeFieldValueRenderer" component={DateTimeFieldValueRendererDoc} />
            <Route path="fieldValueEditor" component={FieldValueEditorDoc} />
            <Route path="fieldValueRenderer" component={FieldValueRendererDoc} />
            <Route path="multiChoiceFieldValueEditor" component={MultiChoiceFieldValueEditorDoc} />
            <Route path="multiLineTextFieldValueEditor" component={MultiLineTextFieldValueEditorDoc} />
            <Route path="numericfieldValueEditor" component={NumericFieldValueEditorDoc} />
            <Route path="numericFieldValueRenderer" component={NumericFieldValueRendererDoc} />
            <Route path="textfieldValueEditor" component={TextFieldValueEditorDoc} />
            <Route path="textFieldValueRenderer" component={TextFieldValueRendererDoc} />
            <Route path="timeFieldValueEditor" component={TimeFieldValueEditorDoc} />
            <Route path="timeFieldValueRenderer" component={TimeFieldValueRendererDoc} />
            <Route path="urlFieldValueEditor" component={UrlFieldValueEditorDoc} />
            <Route path="urlFieldValueRenderer" component={UrlFieldValueRendererDoc} />
            <Route path="userFieldRenderer" component={UserFieldRendererDoc} />
            <Route path="userFieldEditor" component={UserFieldEditorDoc} />
            <Route path="qbpanel" component={QBPanelDoc} />
            <Route path="qbicon" component={QBIconDoc} />
        </Route>
    </Router>
), document.getElementById('content'));
