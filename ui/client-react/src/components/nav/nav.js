import React from "react";
import cookie from 'react-cookie';
import Fluxxor from "fluxxor";
import LeftNav from "./leftNav";
import TopNav from "../header/topNav";
import V2V3Footer from '../footer/v2v3Footer';
import TempMainErrorMessages from './tempMainErrorMessages';
import ReportManagerTrowser from "../report/reportManagerTrowser";
import RecordTrowser from "../record/recordTrowser";
import * as SchemaConsts from "../../constants/schema";
import GlobalActions from "../actions/globalActions";
import Breakpoints from "../../utils/breakpoints";
import {NotificationContainer} from "react-notifications";
import {withRouter} from 'react-router';
import _ from 'lodash';
import "./nav.scss";
import "react-notifications/lib/notifications.css";
import AppUtils from '../../utils/appUtils';
import WindowLocationUtils from '../../utils/windowLocationUtils';
import "../../assets/css/animate.min.css";
import * as TrowserConsts from "../../constants/trowserConstants";
import * as UrlConsts from "../../constants/urlConstants";
import NavPageTitle from '../pageTitle/navPageTitle';
import InvisibleBackdrop from '../qbModal/invisibleBackdrop';
import AppQbModal from '../qbModal/appQbModal';
import UrlUtils from '../../utils/urlUtils';
import CookieConstants from '../../../../common/src/constants';
import CommonCookieUtils from '../../../../common/src/commonCookieUtils';
import * as ShellActions from '../../actions/shellActions';
import * as FormActions from '../../actions/formActions';

// This shared view with the server layer must be loaded as raw HTML because
// the current backend setup cannot handle a react component in a common directory. It is loaded
// as a raw string and we tell react to interpret it as HTML. See more in common/src/views/Readme.md
import LoadingScreen from 'raw!../../../../common/src/views/loadingScreen.html';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

const OPEN_NAV = true;
const CLOSE_NAV = false;

export let Nav = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('NavStore', 'AppsStore', 'ReportsStore', 'ReportDataStore', 'RecordPendingEditsStore', 'FieldsStore')],

    contextTypes: {
        touch: React.PropTypes.bool
    },
    // todo: maybe we should move this up another level into the router...
    getStateFromFlux() {
        let flux = this.getFlux();
        return {
            nav: flux.store('NavStore').getState(),
            apps: flux.store('AppsStore').getState(),
            reportsData: flux.store('ReportsStore').getState(),
            pendEdits: flux.store('RecordPendingEditsStore').getState(),
            reportData: flux.store('ReportDataStore').getState(),
            fields: flux.store('FieldsStore').getState(),
            reportSearchData: flux.store('ReportDataSearchStore').getState()
        };
    },

    getTopGlobalActions() {
        const actions = [];
        return (<GlobalActions actions={actions}
                               position={"top"}
                               dropdownIcon="user"
                               dropdownMsg="globalActions.user"
                               startTabIndex={4}
                               app={this.getSelectedApp()}/>);
    },

    getLeftGlobalActions() {
        const actions = [];
        return (<GlobalActions actions={actions}
                               onSelect={this.onSelectItem}
                               dropdownIcon="user"
                               dropdownMsg="globalActions.user"
                               startTabIndex={100}
                               position={"left"}/>);
    },

    onSelectTableReports(tableId) {
        const flux = this.getFlux();

        if (Breakpoints.isSmallBreakpoint()) {
            setTimeout(() => {
                // left nav css transition seems to interfere with event handling without this
                this.props.dispatch(ShellActions.toggleLeftNav(CLOSE_NAV));
            }, 0);
        }

        this.props.dispatch(ShellActions.showTrowser(TrowserConsts.TROWSER_REPORTS));
        flux.actions.loadReports(this.state.apps.selectedAppId, tableId);
    },

    /**
     * hide the trowser
     */
    hideTrowser() {
        this.props.dispatch(ShellActions.hideTrowser());
    },

    getSelectedApp() {
        if (this.state.apps.selectedAppId) {
            return _.find(this.state.apps.apps, (a) => a.id === this.state.apps.selectedAppId);
        }
        return null;
    },

    /**
     * get table object for currently selected table (or null if no table selected)
     *
     */
    getSelectedTable() {
        const app = this.getSelectedApp();

        if (app && this.state.reportsData.tableId) {
            return _.find(app.tables, (t) => t.id === this.state.reportsData.tableId);
        }
        return null;
    },


    aReportIsSelected() {
        let app = this.getSelectedApp();
        let reportData = this.state.reportData;

        return (app && reportData && reportData.rptId && reportData.data && reportData.data.name);
    },

    /**
     * get the report for the currently selected report (or null if no report selected)
     */
    getSelectedReport() {
        if (this.aReportIsSelected()) {
            return this.state.reportData.data;
        }
        return null;
    },

    /**
     *  if left nav is open, toggle apps list state based on open parameter;
     *  if left nav is collapsed, open the apps list and dispatch event to open nav
     */
    toggleAppsList(open) {
        const flux = this.getFlux();

        if (this.props.qbui.shell.leftNavExpanded) {
            flux.actions.toggleAppsList(open);
        } else {
            flux.actions.toggleAppsList(true);
            this.props.dispatch(ShellActions.toggleLeftNav(OPEN_NAV));
        }
    },

    getEditFormFromProps() {
        return _.has(this.props, "qbui.forms") && _.find(this.props.qbui.forms, form => form.id === "edit");
    },

    /**
     * open existing or new record in trowser if editRec param exists
     */
    updateRecordTrowser(oldRecId) {

        const {appId, tblId, rptId} = this.props.params;

        const editRec = this.props.location.query[UrlConsts.EDIT_RECORD_KEY];

        const editData = this.getEditFormFromProps();

        // load new form data if we have an edit record query parameter and the trowser is closed (or we have a new record ID)
        if (this.props.location.query[UrlConsts.EDIT_RECORD_KEY] &&
            (!editData || !editData.loading) &&
            (!this.props.qbui.shell.trowserOpen || oldRecId !== editRec)) {

            this.props.dispatch(FormActions.loadForm(appId, tblId, rptId, "edit", editRec)).then(() => {
                this.props.dispatch(ShellActions.showTrowser(TrowserConsts.TROWSER_EDIT_RECORD));
            });

        }
    },

    componentDidUpdate(prevProps) {

        // component updated, update the record trowser content if necessary
        // temporary solution to prevent UI getting in an endless loop state (MB-1369)

        const editData = this.getEditFormFromProps();

        if (!editData || !editData.loading) {
            this.updateRecordTrowser(prevProps.location.query.editRec);
        }
    },

    renderSavingModal(showIt) {
        return <InvisibleBackdrop show={showIt}/>;
    },

    render() {
        if (!this.state.apps || this.state.apps.apps === null) {
            // don't render anything until we've made this first api call without being redirected to V2
            // The common loading screen html is shared across server and client as an HTML file and
            // therefore must be loaded using the dnagerouslySetInnerHTML attribute
            // see more information in common/src/views/Readme.md
            return <div dangerouslySetInnerHTML={{__html: LoadingScreen}} />;
        }

        const flux = this.getFlux();

        let classes = "navShell";
        if (this.props.qbui.shell.leftNavVisible) {
            classes += " leftNavOpen";
        }
        let editRecordId = _.has(this.props, "location.query") ? this.props.location.query[UrlConsts.EDIT_RECORD_KEY] : null;
        let editRecordIdForPageTitle = editRecordId;

        if (editRecordId === UrlConsts.NEW_RECORD_VALUE) {
            editRecordId = SchemaConsts.UNSAVED_RECORD_ID;
        }

        let viewingRecordId = null;
        if (this.props.params) {
            viewingRecordId = this.props.params.recordId;
        }

        return (<div className={classes}>
            <NavPageTitle
                app={this.getSelectedApp()}
                table={this.getSelectedTable()}
                report={this.getSelectedReport()}
                editingRecordId={editRecordIdForPageTitle}
                selectedRecordId={viewingRecordId}
            />
            <NotificationContainer/>
            {/* AppQbModal is an app-wide modal that can be called from non-react classes*/}
            <AppQbModal/>

            {this.props.params && this.props.params.appId &&
                <RecordTrowser visible={this.props.qbui.shell.trowserOpen && this.props.qbui.shell.trowserContent === TrowserConsts.TROWSER_EDIT_RECORD}
                               router={this.props.router}
                               editForm={this.getEditFormFromProps()}
                               appId={this.props.params.appId}
                               tblId={this.props.params.tblId}
                               recId={editRecordId}
                               viewingRecordId={viewingRecordId}
                               pendEdits={this.state.pendEdits}
                               appUsers={this.state.apps.appUsers}
                               selectedApp={this.getSelectedApp()}
                               selectedTable={this.getSelectedTable()}
                               reportData={this.state.reportData}
                               errorPopupHidden={this.state.nav.errorPopupHidden}
                               onHideTrowser={this.hideTrowser}/>
            }
            {this.props.params && this.props.params.appId &&
                <ReportManagerTrowser visible={this.props.qbui.shell.trowserOpen && this.props.qbui.shell.trowserContent === TrowserConsts.TROWSER_REPORTS}
                                      router={this.props.router}
                                      selectedTable={this.getSelectedTable()}
                                      filterReportsName={this.state.nav.filterReportsName}
                                      reportsData={this.state.reportsData}
                                      onHideTrowser={this.hideTrowser}/>
            }

            <LeftNav
                visible={this.props.qbui.shell.leftNavVisible}
                expanded={this.props.qbui.shell.leftNavExpanded}
                appsListOpen={this.state.nav.appsListOpen}
                apps={this.state.apps.apps}
                appsLoading={this.state.apps.loading}
                selectedAppId={this.state.apps.selectedAppId}
                selectedTableId={this.state.apps.selectedTableId}
                onSelectReports={this.onSelectTableReports}
                onToggleAppsList={this.toggleAppsList}
                globalActions={this.getLeftGlobalActions()}
                onSelect={this.onSelectItem}
                onNavClick={this.toggleNav}/>

            <div className="main" >
                <TopNav title={this.state.nav.topTitle}
                        globalActions={this.getTopGlobalActions()}
                        onNavClick={this.toggleNav}
                        flux={flux}
                        showOnSmall = {this.state.nav.showTopNav}/>
                {this.props.children &&
                    <div className="mainContent" >
                        <TempMainErrorMessages apps={this.state.apps.apps} appsLoading={this.state.apps.loading} selectedAppId={this.state.apps.selectedAppId} />
                        {/* insert the component passed in by the router */}
                        {React.cloneElement(this.props.children, {
                            key: this.props.location ? this.props.location.pathname : "",
                            apps: this.state.apps.apps,
                            selectedAppId: this.state.apps.selectedAppId,
                            appsLoading: this.state.apps.loading,
                            reportData: this.state.reportData,
                            appUsers: this.state.apps.appUsers,
                            locale: this.state.nav.locale,
                            pendEdits:this.state.pendEdits,
                            isRowPopUpMenuOpen: this.state.nav.isRowPopUpMenuOpen,
                            fields: this.state.fields,
                            forms: this.props.qbui.forms,
                            reportSearchData: this.state.reportSearchData,
                            selectedApp: this.getSelectedApp(),
                            selectedTable: this.getSelectedTable(),
                            scrollingReport: this.state.nav.scrollingReport,
                            flux: flux}
                        )}
                    </div>}
            </div>

            {this.getV2V3Footer()}

            {this.state.pendEdits &&
                this.renderSavingModal(this.state.pendEdits.saving)
            }
        </div>);
    },

    checkOpenInV2(selectedApp) {
        let v2tov3Cookie = cookie.load(CookieConstants.COOKIES.V2TOV3);
        if (v2tov3Cookie && CommonCookieUtils.searchCookieValue(v2tov3Cookie, selectedApp.id)) {
            let qbClassicURL = UrlUtils.getQuickBaseClassicLink(selectedApp.id);
            WindowLocationUtils.update(qbClassicURL);
        }
    },

    /**
     * get v2/v3 toggle popup (for admins on app pages)
     *
     * @returns V2V3Footer or null
     */
    getV2V3Footer() {
        const selectedApp = this.getSelectedApp();

        if (selectedApp) {
            this.checkOpenInV2(selectedApp);
            const hasAdmin = AppUtils.hasAdminAccess(selectedApp.accessRights);

            if (hasAdmin) {
                return <V2V3Footer app={selectedApp} onSelectOpenInV3={this.onSelectOpenInV3}/>;
            } else if (!selectedApp.openInV3) {
                WindowLocationUtils.update("/qbase/notAvailable?appId=" + selectedApp.id);
            }
        }
        return null;
    },

    onSelectOpenInV3(openInV3) {
        const flux = this.getFlux();
        flux.actions.setApplicationStack(this.state.apps.selectedAppId, openInV3);
    },

    onSelectItem() {
        // hide left nav after selecting items on small breakpoint
        if (Breakpoints.isSmallBreakpoint()) {
            this.props.dispatch(ShellActions.toggleLeftNav(CLOSE_NAV));
        }
    },

    /**
     * Toggle open/closed the left nav based on its current state
     */
    toggleNav() {
        this.props.dispatch(ShellActions.toggleLeftNav());
    }
});


export let NavWithRouter = withRouter(Nav);
export default NavWithRouter;

