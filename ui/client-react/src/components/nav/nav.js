import React from "react";
import cookie from 'react-cookie';
import Fluxxor from "fluxxor";
import LeftNav from "./leftNav";
import TopNav from "../header/topNav";
import TempMainErrorMessages from './tempMainErrorMessages';
import ReportManagerTrowser from "../report/reportManagerTrowser";
import RecordTrowser from "../record/recordTrowser";
import * as SchemaConsts from "../../constants/schema";
import GlobalActions from "../actions/globalActions";
import BuilderDropDownAction from '../actions/builderDropDownAction';
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
import * as ReportActions from '../../actions/reportActions';
import {CONTEXT} from '../../actions/context';

// This shared view with the server layer must be loaded as raw HTML because
// the current backend setup cannot handle a react component in a common directory. It is loaded
// as a raw string and we tell react to interpret it as HTML. See more in common/src/views/Readme.md
import LoadingScreen from 'raw!../../../../common/src/views/loadingScreen.html';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

const OPEN_NAV = true;
const CLOSE_NAV = false;
const OPEN_APPSLIST = true;

export let Nav = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('NavStore', 'AppsStore', /*'ReportDataStore', 'RecordPendingEditsStore',*/ 'FieldsStore')],

    contextTypes: {
        touch: React.PropTypes.bool
    },
    // todo: maybe we should move this up another level into the router...
    getStateFromFlux() {
        let flux = this.getFlux();
        return {
            nav: flux.store('NavStore').getState(),
            apps: flux.store('AppsStore').getState(),
            //pendEdits: flux.store('RecordPendingEditsStore').getState(),
            //reportData: flux.store('ReportDataStore').getState(),
            fields: flux.store('FieldsStore').getState(),
            reportSearchData: flux.store('ReportDataSearchStore').getState()
        };
    },

    navigateToBuilder() {
        /**
         *formId is set to null for now, it is left here, because formId will need to be passed down as a prop in a future story
         * a new unit test will need to be added to recordRoute.unit.spec.js
         * */
        const formId = null;
        const {appId, tblId} = this.props.params;
        let formType;

        if (this.props.qbui && this.props.qbui.forms && this.props.qbui.forms[0]) {
            formType = this.props.qbui.forms[0].id;
        }

        let link = `${UrlConsts.BUILDER_ROUTE}/app/${appId}/table/${tblId}/form`;

        if (formId && formType) {
            link = `${link}/${formId}?formType=${formType}`;
        } else if (formType) {
            link = `${link}?formType=${formType}`;
        } else if (formId) {
            link = `${link}/${formId}`;
        }

        this.props.router.push(link);
    },

    getTopGlobalActions() {
        const actions = [];
        let recordId;
        if (this.props.params) {
            recordId = this.props.params.recordId;
        }
        return (<GlobalActions actions={actions}
                               position={"top"}
                               dropdownIcon="user"
                               dropdownMsg="globalActions.user"
                               startTabIndex={4}
                               app={this.getSelectedApp()}>
                    <BuilderDropDownAction recId={recordId}
                                           actions={actions}
                                           position={"top"}
                                           formBuilderIcon="settings"
                                           navigateToBuilder={this.navigateToBuilder}
                                           startTabIndex={4}/>
                </GlobalActions>);
    },

    getLeftGlobalActions() {
        const actions = [];
        let recordId;
        if (this.props.params) {
            recordId = this.props.params.recordId;
        }
        return (<GlobalActions actions={actions}
                               onSelect={this.onSelectItem}
                               dropdownIcon="user"
                               dropdownMsg="globalActions.user"
                               startTabIndex={100}
                               position={"left"}>
                    <BuilderDropDownAction recId={recordId}
                                           actions={actions}
                                           position={"left"}
                                           formBuilderIcon="settings"
                                           navigateToBuilder={this.navigateToBuilder}
                                           startTabIndex={4}/>
                </GlobalActions>);
    },

    onSelectTableReports(tableId) {
        if (Breakpoints.isSmallBreakpoint()) {
            setTimeout(() => {
                // left nav css transition seems to interfere with event handling without this
                this.props.dispatch(ShellActions.toggleLeftNav(CLOSE_NAV));
            }, 0);
        }

        this.props.dispatch(ShellActions.showTrowser(TrowserConsts.TROWSER_REPORTS));
        this.props.dispatch(ReportActions.loadReports(CONTEXT.REPORT.NAV_LIST, this.state.apps.selectedAppId, tableId));
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
    getSelectedTable(tableId) {
        if (tableId) {
            const app = this.getSelectedApp();
            if (app) {
                return _.find(app.tables, (t) => t.id === tableId);
            }
        }
        return null;
    },


    aReportIsSelected() {
        let app = this.getSelectedApp();
        let reportData = this.getReportsData();
        return (app && reportData && reportData.rptId && reportData.data && reportData.data.name);
    },

    /**
     * get the report for the currently selected report (or null if no report selected)
     */
    getSelectedReport() {
        if (this.aReportIsSelected()) {
            //return this.state.reportData.data;
            return this.getReportsData();
        }
        return null;
    },

    /**
     *  if left nav is open, toggle apps list state based on open parameter;
     *  if left nav is collapsed, open the apps list and dispatch event to open nav
     */
    toggleAppsList(open) {
        if (this.props.qbui.shell.leftNavExpanded) {
            this.props.dispatch(ShellActions.toggleAppsList(open));
        } else {
            this.props.dispatch(ShellActions.toggleAppsList(OPEN_APPSLIST));
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

    /**
     *  Fetch the report data content.
     */
    getReportsData() {
        let report = _.find(this.props.qbui.report, function(rpt) {
            return rpt.id === CONTEXT.REPORT.NAV;
        });
        return report || {};
    },
    /**
     *  Fetch the report list content.
     */
    getReportsList() {
        let reportList = _.find(this.props.qbui.report, function(rpt) {
            return rpt.id === CONTEXT.REPORT.NAV_LIST;
        });
        return reportList || {};
    },

    getPendEdits() {
        let pendEdits = {};
        //  TODO: just getting to work....improve this to support multi records...
        if (Array.isArray(this.props.qbui.record) && this.props.qbui.record.length > 0) {
            if (_.isEmpty(this.props.qbui.record[0]) === false) {
                pendEdits = this.props.qbui.record[0].pendEdits || {};
            }
        }
        return pendEdits;
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

        let reportsData = this.getReportsData();
        let reportsList = this.getReportsList();
        let pendEdits = this.getPendEdits();

        return (<div className={classes}>
            <NavPageTitle
                app={this.getSelectedApp()}
                table={this.getSelectedTable(reportsData.tblId)}
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
                               pendEdits={pendEdits}
                               appUsers={this.state.apps.appUsers}
                               selectedApp={this.getSelectedApp()}
                               selectedTable={this.getSelectedTable(reportsData.tblId)}
                               reportData={reportsData}
                               errorPopupHidden={this.props.qbui.shell.errorPopupHidden}
                               onHideTrowser={this.hideTrowser}/>
            }
            {this.props.params && this.props.params.appId &&
                <ReportManagerTrowser visible={this.props.qbui.shell.trowserOpen && this.props.qbui.shell.trowserContent === TrowserConsts.TROWSER_REPORTS}
                                      router={this.props.router}
                                      selectedTable={this.getSelectedTable(reportsList.tblId)}
                                      filterReportsName={this.state.nav.filterReportsName}
                                      reportsData={reportsList}
                                      onHideTrowser={this.hideTrowser}/>
            }

            <LeftNav
                visible={this.props.qbui.shell.leftNavVisible}
                expanded={this.props.qbui.shell.leftNavExpanded}
                appsListOpen={this.props.qbui.shell.appsListOpen}
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
                        //flux={flux}
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
                            reportData: reportsData,
                            appUsers: this.state.apps.appUsers,
                            appUsersUnfiltered: this.state.apps.appUsersUnfiltered,
                            appRoles: this.state.apps.appRoles,
                            locale: this.state.nav.locale,
                            //pendEdits:pendEdits,
                            isRowPopUpMenuOpen: this.props.qbui.shell.isRowPopUpMenuOpen,
                            fields: this.state.fields,
                            reportSearchData: this.state.reportSearchData,
                            selectedApp: this.getSelectedApp(),
                            selectedTable: this.getSelectedTable(reportsData.tblId),
                            scrollingReport: this.state.nav.scrollingReport,
                            flux: flux}
                        )}
                    </div>}
            </div>

            {pendEdits &&
                this.renderSavingModal(pendEdits.saving)
            }
        </div>);
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
