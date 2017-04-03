//these two imports are needed for safari and iOS to work with internationalization
import Intl from 'intl';
import en from 'intl/locale-data/jsonp/en.js';

import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, IndexRedirect, browserHistory} from 'react-router';
import AppsBundleLoader from '../../client-react/src/locales/appsBundleLoader';
import config from '../../client-react/src/config/app.config';

import Nav from '../../client-react/src/components/nav/nav';

import AppsHome from '../../client-react/src/components/apps/home';
import AppsRoute from '../../client-react/src/components/apps/appsRoute';
import AppHomePageRoute from '../../client-react/src/components/app/appHomePageRoute';

import ReportRoute from '../../client-react/src/components/report/reportRoute';
import RecordRoute from '../../client-react/src/components/record/recordRoute';
import TableHomePageRoute from '../../client-react/src/components/table/tableHomePageRoute';

import ComponentLibraryWrapper from './components/componentLibrary';
import './assets/componentLibrary.scss';

import HomePage from './pages/home';
import Colors3Page from './pages/colors3';
import UiIconFontPage from './pages/uiIconFont';
import TableIconFontPage from './pages/tableIconFont';

import CheckBoxFieldValueEditorDoc from './docs/checkBoxFieldValueEditor';
import CheckBoxFieldValueRendererDoc from './docs/checkBoxFieldValueRenderer';
import DateFieldValueEditorDoc from './docs/dateFieldValueEditor.js';
import DateTimeFieldValueEditorDoc from './docs/dateTimeFieldValueEditor.js';
import DateTimeFieldValueRendererDoc from './docs/dateTimeFieldValueRenderer.js';
import EmailFieldValueEditorDoc from './docs/emailFieldValueEditor.js';
import EmailFieldValueRendererDoc from './docs/emailFieldValueRenderer.js';
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
import TrowserDoc from './docs/trowser.js';
import UrlFieldValueEditorDoc from './docs/urlFieldValueEditor.js';
import UrlFieldValueRendererDoc from './docs/urlFieldValueRenderer.js';
import UserFieldEditorDoc from './docs/userFieldValueEditor';
import UserFieldRendererDoc from './docs/userFieldValueRenderer';
import QBPanelDoc from './docs/qbpanel';
import IconDoc from './docs/icon';
import QBModalDoc from './docs/qbModal.js';

import InvisibleBackdropDoc from './docs/invisibleBackdrop.js';
import AlertBannerDoc from './docs/alertBanner.js';
import PageTitleDoc from './docs/pageTitle.js';
import PhoneFieldValueEditorDoc from './docs/phoneFieldValueEditor.js';
import PhoneFieldValueRendererDoc from './docs/phoneFieldValueRenderer.js';
import DurationFieldValueRendererDoc from './docs/durationFieldValueRenderer.js';
import DurationFieldValueEditorDoc from './docs/durationFieldValueEditor.js';
import QbGridDoc from './docs/qbGrid.js';
import SideMenuBaseDoc from './docs/sideMenuBase.js';
import SideTrowserBaseDoc from './docs/sideTrowserBase.js';
// END OF IMPORT STATEMENTS
// Above comment used for Grunt task. Please do not delete.

// init the localization services
AppsBundleLoader.changeLocale(config.locale.default);

render((
    <Router history={browserHistory}>
        <Route path="qbase/components" component={ComponentLibraryWrapper}>
            <IndexRedirect to="home" />
            <Route path="home" component={HomePage} />
            <Route path="colors3" component={Colors3Page} />
            <Route path="uiIconFont" component={UiIconFontPage} />
            <Route path="tableIconFont" component={TableIconFontPage} />

            <Route path="checkBoxFieldValueEditor" component={CheckBoxFieldValueEditorDoc} />
            <Route path="checkBoxFieldValueRenderer" component={CheckBoxFieldValueRendererDoc} />
            <Route path="dateFieldValueEditor" component={DateFieldValueEditorDoc} />
            <Route path="dateTimeFieldValueEditor" component={DateTimeFieldValueEditorDoc} />
            <Route path="dateTimeFieldValueRenderer" component={DateTimeFieldValueRendererDoc} />
            <Route path="durationFieldValueRenderer" component={DurationFieldValueRendererDoc} />
            <Route path="emailFieldValueEditor" component={EmailFieldValueEditorDoc} />
            <Route path="emailFieldValueRenderer" component={EmailFieldValueRendererDoc} />
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
            <Route path="trowser" component={TrowserDoc} />
            <Route path="urlFieldValueEditor" component={UrlFieldValueEditorDoc} />
            <Route path="urlFieldValueRenderer" component={UrlFieldValueRendererDoc} />
            <Route path="userFieldRenderer" component={UserFieldRendererDoc} />
            <Route path="userFieldEditor" component={UserFieldEditorDoc} />
            <Route path="qbpanel" component={QBPanelDoc} />
            <Route path="icon" component={IconDoc} />
            <Route path="qBModal" component={QBModalDoc} />
            <Route path="alertBanner" component={AlertBannerDoc} />
            <Route path="pageTitle" component={PageTitleDoc} />
            <Route path="invisibleBackdrop" component={InvisibleBackdropDoc} />
            <Route path="phoneFieldValueEditor" component={PhoneFieldValueEditorDoc} />
            <Route path="phoneFieldValueRenderer" component={PhoneFieldValueRendererDoc} />
            <Route path="durationFieldValueEditor" component={DurationFieldValueEditorDoc} />
            <Route path="qbGrid" component={QbGridDoc} />
            <Route path="sideMenuBase" component={SideMenuBaseDoc} />
            <Route path="sideTrowserBase" component={SideTrowserBaseDoc} />
        </Route>
    </Router>
), document.getElementById('content'));
