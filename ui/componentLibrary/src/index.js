//these two imports are needed for safari and iOS to work with internationalization
import Intl from 'intl';
import en from 'intl/locale-data/jsonp/en.js';

import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import RouteWithSubRoutes from "../../client-react/src/scripts/RouteWithSubRoutes";
import {ROUTES} from '../../common/src/constants';

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
import ColorsPage from './pages/colors';
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
import IconChooserDoc from './docs/iconChooser.js';
import IconInputBoxDoc from './docs/iconInputBox.js';
import TopNavDoc from './docs/topNav.js';
import StageDoc from './docs/stage.js';
import TooltipDoc from './docs/tooltip.js';
import StandardLeftNavDoc from './docs/standardLeftNav.js';
import createBrowserHistory from 'history/createBrowserHistory';
// END OF IMPORT STATEMENTS
// Above comment used for Grunt task. Please do not delete.
const browserHistory  = createBrowserHistory();


const {BASE_CLIENT_ROUTE} = ROUTES;
const LIB_ROUTE = `${BASE_CLIENT_ROUTE}/components`;


// init the localization services
AppsBundleLoader.changeLocale(config.locale.default);

// render((
//     <Router history={browserHistory}>
//         <Route path="qbase/components" component={ComponentLibraryWrapper}>
//             <IndexRedirect to="home" />
//             <Route path="home" component={HomePage} />
//             <Route path="colors" component={ColorsPage} />
//             <Route path="uiIconFont" component={UiIconFontPage} />
//             <Route path="tableIconFont" component={TableIconFontPage} />
//
//             <Route path="checkBoxFieldValueEditor" component={CheckBoxFieldValueEditorDoc} />
//             <Route path="checkBoxFieldValueRenderer" component={CheckBoxFieldValueRendererDoc} />
//             <Route path="dateFieldValueEditor" component={DateFieldValueEditorDoc} />
//             <Route path="dateTimeFieldValueEditor" component={DateTimeFieldValueEditorDoc} />
//             <Route path="dateTimeFieldValueRenderer" component={DateTimeFieldValueRendererDoc} />
//             <Route path="durationFieldValueRenderer" component={DurationFieldValueRendererDoc} />
//             <Route path="emailFieldValueEditor" component={EmailFieldValueEditorDoc} />
//             <Route path="emailFieldValueRenderer" component={EmailFieldValueRendererDoc} />
//             <Route path="fieldValueEditor" component={FieldValueEditorDoc} />
//             <Route path="fieldValueRenderer" component={FieldValueRendererDoc} />
//             <Route path="multiChoiceFieldValueEditor" component={MultiChoiceFieldValueEditorDoc} />
//             <Route path="multiLineTextFieldValueEditor" component={MultiLineTextFieldValueEditorDoc} />
//             <Route path="numericfieldValueEditor" component={NumericFieldValueEditorDoc} />
//             <Route path="numericFieldValueRenderer" component={NumericFieldValueRendererDoc} />
//             <Route path="textfieldValueEditor" component={TextFieldValueEditorDoc} />
//             <Route path="textFieldValueRenderer" component={TextFieldValueRendererDoc} />
//             <Route path="timeFieldValueEditor" component={TimeFieldValueEditorDoc} />
//             <Route path="timeFieldValueRenderer" component={TimeFieldValueRendererDoc} />
//             <Route path="trowser" component={TrowserDoc} />
//             <Route path="urlFieldValueEditor" component={UrlFieldValueEditorDoc} />
//             <Route path="urlFieldValueRenderer" component={UrlFieldValueRendererDoc} />
//             <Route path="userFieldRenderer" component={UserFieldRendererDoc} />
//             <Route path="userFieldEditor" component={UserFieldEditorDoc} />
//             <Route path="qbpanel" component={QBPanelDoc} />
//             <Route path="icon" component={IconDoc} />
//             <Route path="qBModal" component={QBModalDoc} />
//             <Route path="alertBanner" component={AlertBannerDoc} />
//             <Route path="pageTitle" component={PageTitleDoc} />
//             <Route path="invisibleBackdrop" component={InvisibleBackdropDoc} />
//             <Route path="phoneFieldValueEditor" component={PhoneFieldValueEditorDoc} />
//             <Route path="phoneFieldValueRenderer" component={PhoneFieldValueRendererDoc} />
//             <Route path="durationFieldValueEditor" component={DurationFieldValueEditorDoc} />
//             <Route path="qbGrid" component={QbGridDoc} />
//             <Route path="sideMenuBase" component={SideMenuBaseDoc} />
//             <Route path="sideTrowserBase" component={SideTrowserBaseDoc} />
//             <Route path="iconChooser" component={IconChooserDoc} />
//             <Route path="iconInputBox" component={IconInputBoxDoc} />
//             <Route path="topNav" component={TopNavDoc} />
//             <Route path="stage" component={StageDoc} />
//             <Route path="tooltip" component={TooltipDoc} />
//             <Route path="standardLeftNav" component={StandardLeftNavDoc} />
//         </Route>
//     </Router>
// ), document.getElementById('content'));


const routes = [
    {
        path: `${LIB_ROUTE}`,
        component: ComponentLibraryWrapper,
        routes: [
            {
                path: `${LIB_ROUTE}/home`,
                component: HomePage
            },
            {
                path: `${LIB_ROUTE}/colors`,
                component: ColorsPage
            },
            {
                path: `${LIB_ROUTE}/uiIconFont`,
                component: UiIconFontPage
            },
            {
                path: `${LIB_ROUTE}/tableIconFont`,
                component: TableIconFontPage
            },
            {
                path: `${LIB_ROUTE}/checkBoxFieldValueEditor`,
                component: CheckBoxFieldValueEditorDoc
            },
            {
                path: `${LIB_ROUTE}/checkBoxFieldValueRenderer`,
                component: CheckBoxFieldValueRendererDoc
            },
            {
                path: `${LIB_ROUTE}/dateFieldValueEditor`,
                component: DateFieldValueEditorDoc
            },
            {
                path: `${LIB_ROUTE}/dateTimeFieldValueEditor`,
                component: DateTimeFieldValueEditorDoc
            },
            {
                path: `${LIB_ROUTE}/dateTimeFieldValueRenderer`,
                component: DateTimeFieldValueRendererDoc
            },
            {
                path: `${LIB_ROUTE}/durationFieldValueRenderer`,
                component: DurationFieldValueRendererDoc
            },
            {
                path: `${LIB_ROUTE}/emailFieldValueEditor`,
                component: EmailFieldValueEditorDoc
            },
            {
                path: `${LIB_ROUTE}/emailFieldValueRenderer`,
                component: EmailFieldValueRendererDoc
            },
            {
                path: `${LIB_ROUTE}/fieldValueEditor`,
                component: FieldValueEditorDoc
            },
            {
                path: `${LIB_ROUTE}/fieldValueRenderer`,
                component: FieldValueRendererDoc
            },
            {
                path: `${LIB_ROUTE}/multiChoiceFieldValueEditor`,
                component: MultiChoiceFieldValueEditorDoc
            },
            {
                path: `${LIB_ROUTE}/multiLineTextFieldValueEditor`,
                component: MultiLineTextFieldValueEditorDoc
            },
            {
                path: `${LIB_ROUTE}/numericfieldValueEditor`,
                component: NumericFieldValueEditorDoc
            },
            {
                path: `${LIB_ROUTE}/numericFieldValueRenderer`,
                component: NumericFieldValueRendererDoc
            },
            {
                path: `${LIB_ROUTE}/textfieldValueEditor`,
                component: TextFieldValueEditorDoc
            },
            {
                path: `${LIB_ROUTE}/textFieldValueRenderer`,
                component: TextFieldValueRendererDoc
            },
            {
                path: `${LIB_ROUTE}/timeFieldValueEditor`,
                component: TimeFieldValueEditorDoc
            },
            {
                path: `${LIB_ROUTE}/timeFieldValueRenderer`,
                component: TimeFieldValueRendererDoc
            },
            {
                path: `${LIB_ROUTE}/trowser`,
                component: TrowserDoc
            },
            {
                path: `${LIB_ROUTE}/urlFieldValueEditor`,
                component: UrlFieldValueEditorDoc
            },
            {
                path: `${LIB_ROUTE}/urlFieldValueRenderer`,
                component: UrlFieldValueRendererDoc
            },
            {
                path: `${LIB_ROUTE}/userFieldRenderer`,
                component: UserFieldRendererDoc
            },
            {
                path: `${LIB_ROUTE}/userFieldEditor`,
                component: UserFieldEditorDoc
            },
            {
                path: `${LIB_ROUTE}/qbpanel`,
                component: QBPanelDoc
            },
            {
                path: `${LIB_ROUTE}/icon`,
                component: IconDoc
            },
            {
                path: `${LIB_ROUTE}/qBModal`,
                component: QBModalDoc
            },
            {
                path: `${LIB_ROUTE}/alertBanner`,
                component: AlertBannerDoc
            },
            {
                path: `${LIB_ROUTE}/pageTitle`,
                component: PageTitleDoc
            },
            {
                path: `${LIB_ROUTE}/invisibleBackdrop`,
                component: InvisibleBackdropDoc
            },
            {
                path: `${LIB_ROUTE}/phoneFieldValueEditor`,
                component: PhoneFieldValueEditorDoc
            },
            {
                path: `${LIB_ROUTE}/phoneFieldValueRenderer`,
                component: PhoneFieldValueRendererDoc
            },
            {
                path: `${LIB_ROUTE}/durationFieldValueEditor`,
                component: DurationFieldValueEditorDoc
            },
            {
                path: `${LIB_ROUTE}/qbGrid`,
                component: QbGridDoc
            },
            {
                path: `${LIB_ROUTE}/sideMenuBase`,
                component: SideMenuBaseDoc
            },
            {
                path: `${LIB_ROUTE}/sideTrowserBase`,
                component: SideTrowserBaseDoc
            },
            {
                path: `${LIB_ROUTE}/iconChooser`,
                component: IconChooserDoc
            },
            {
                path: `${LIB_ROUTE}/iconInputBox`,
                component: IconInputBoxDoc
            },
            {
                path: `${LIB_ROUTE}/topNav`,
                component: TopNavDoc
            },
            {
                path: `${LIB_ROUTE}/stage`,
                component: StageDoc
            },
            {
                path: `${LIB_ROUTE}/tooltip`,
                component: TooltipDoc
            },
            {
                path: `${LIB_ROUTE}/standardLeftNav`,
                component: StandardLeftNavDoc
            }
        ]
    }
];


render((
    <BrowserRouter>
        <div className="router-wrapper">
            <Redirect push from="{LIB_ROUTE}" to={`${LIB_ROUTE}/home`}/>
            <Switch>
                {/*  within Switch 1st match wins
                 includes all the above top level routes and passed on the child routes in the properties
                 note if an entry it is without a path to match
                 the route has to come after specific routes
                 */}
                {routes.map((route, i) => (
                        <RouteWithSubRoutes key={i} {...route} />
                    )
                )}
            </Switch>
        </div>
    </BrowserRouter>
), document.getElementById('content'));
