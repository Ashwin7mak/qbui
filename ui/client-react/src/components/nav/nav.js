import React from "react";
import {Route} from 'react-router-dom';

import LeftNav from "./leftNav";
import TopNav from "../header/topNav";
import TempMainErrorMessages from './tempMainErrorMessages';
import ReportManagerTrowser from "../report/reportManagerTrowser";
import RecordTrowser from "../record/recordTrowser";
import {enterBuilderMode, updateReportRedirectRoute} from '../../../src/actions/reportBuilderActions';

import GlobalActions from "../actions/globalActions";
import BuilderDropDownAction from '../actions/builderDropDownAction';
import Breakpoints from "../../utils/breakpoints";
import {NotificationContainer} from "react-notifications";
import {withRouter, Switch} from 'react-router-dom';
import _ from 'lodash';
import * as TrowserConsts from "../../constants/trowserConstants";
import * as UrlConsts from "../../constants/urlConstants";
import * as SchemaConsts from "../../constants/schema";

import NavPageTitle from '../pageTitle/navPageTitle';
import InvisibleBackdrop from '../qbModal/invisibleBackdrop';
import AppQbModal from '../qbModal/appQbModal';

import {connect} from 'react-redux';

import * as ShellActions from '../../actions/shellActions';
import * as FormActions from '../../actions/formActions';
import * as ReportActions from '../../actions/reportActions';
import * as TableCreationActions from '../../actions/tableCreationActions';
import {loadApp, loadApps} from '../../actions/appActions';

import {getApp, getApps, getIsAppsLoading, getSelectedAppId, getSelectedTableId, getAppUsers, getAppUnfilteredUsers, getAppOwner} from '../../reducers/app';
import {getAppRoles} from '../../reducers/selectedApp';

import {CONTEXT} from '../../actions/context';
import TableCreationDialog from '../table/tableCreationDialog';
import AppCreationDialog from '../app/appCreationDialog';

import AppUtils from '../../utils/appUtils';

import {NEW_TABLE_IDS_KEY} from '../../constants/localStorage';
import {updateFormRedirectRoute} from '../../actions/formActions';

import Analytics from '../../../../reuse/client/src/components/analytics/analytics';
import Config from '../../config/app.config';

// This shared view with the server layer must be loaded as raw HTML because
// the current backend setup cannot handle a react component in a common directory. It is loaded
// as a raw string and we tell react to interpret it as HTML. See more in common/src/views/Readme.md
import LoadingScreen from 'raw!../../../../common/src/views/loadingScreen.html';

//  import styles
import "./nav.scss";
import "react-notifications/lib/notifications.css";
import "../../assets/css/animate.min.css";
import RouteWithSubRoutes from "../../scripts/RouteWithSubRoutes";
import {getPendEdits} from '../../reducers/record';
const OPEN_NAV = true;
const CLOSE_NAV = false;
const OPEN_APPS_LIST = true;

export const Nav = React.createClass({

    contextTypes: {
        touch: React.PropTypes.bool
    },

    navigateToFormBuilder() {
        /**
         *formId is set to null for now, it is left here, because formId will need to be passed down as a prop in a future story
         * a new unit test will need to be added to recordRoute.unit.spec.js
         * */
        const formId = null;
        const {appId, tblId} = this.props.match.params;
        let formType;

        // currently users can navigate to builder only from "view" context, will need to update
        // when we allow navigating to builder from "edit" context
        if (_.has(this.props, 'forms.view')) {
            formType = 'view';
        }

        let link = `${UrlConsts.BUILDER_ROUTE}/app/${appId}/table/${tblId}/form`;

        if (formId && formType) {
            link = `${link}/${formId}?formType=${formType}`;
        } else if (formType) {
            link = `${link}?formType=${formType}`;
        } else if (formId) {
            link = `${link}/${formId}`;
        }

        this.props.updateFormRedirectRoute(_.get(this.props, 'location.pathname'));

        this.props.history.push(link);
    },

    navigateToReportBuilder() {
        const {appId, tblId} = this.props.match.params;
        const {rptId} = this.getReportsData();

        let link = `${UrlConsts.BUILDER_ROUTE}/app/${appId}/table/${tblId}/report/${rptId}`;

        this.props.updateReportRedirectRoute(CONTEXT.REPORT.NAV, _.get(this.props, 'location.pathname'));

        this.props.enterBuilderMode(CONTEXT.REPORT.NAV);

        this.props.history.push(link);
    },

    getTopGlobalActions() {
        const actions = [];
        let selectedApp = this.getSelectedApp();
        let selectedTableId = this.props.selectedTableId;

        let isAdmin = selectedApp ? AppUtils.hasAdminAccess(selectedApp.accessRights) : false;

        return (
            <Route path={UrlConsts.BUILDER_MENU_ROUTE} render={props => (
                <GlobalActions actions={actions}
                               position={"top"}
                               dropdownIcon="user"
                               dropdownMsg="globalActions.user"
                               startTabIndex={4}
                               app={selectedApp}>

                    {isAdmin ?
                        <BuilderDropDownAction
                            history={this.props.history}
                            selectedApp={selectedApp}
                            selectedTable={this.getSelectedTable(selectedTableId)}
                            recId={props.match.params.recordId}
                            actions={actions}
                            position={"top"}
                            icon="settings"
                            navigateToFormBuilder={this.navigateToFormBuilder}
                            navigateToReportBuilder={this.navigateToReportBuilder}
                            startTabIndex={4}
                            rptId={this.getReportsData().rptId} /> : null}
                </GlobalActions>
            )} />
        );
    },

    getLeftGlobalActions() {
        const actions = [];
        let recordId;
        if (this.props.match.params) {
            recordId = this.props.match.params.recordId;
        }
        return (<GlobalActions actions={actions}
                               onSelect={this.onSelectItem}
                               dropdownIcon="user"
                               dropdownMsg="globalActions.user"
                               startTabIndex={100}
                               position="left">
        </GlobalActions>);
    },

    onSelectTableReports(tableId) {
        if (Breakpoints.isSmallBreakpoint()) {
            setTimeout(() => {
                // left nav css transition seems to interfere with event handling without this
                this.props.toggleLeftNav(CLOSE_NAV);
            }, 0);
        }

        this.props.showTrowser(TrowserConsts.TROWSER_REPORTS);

        const selectedAppId = this.props.selectedAppId;
        this.props.loadReports(CONTEXT.REPORT.NAV_LIST, selectedAppId, tableId);
    },

    /**
     * hide the trowser
     */
    hideTrowser() {
        this.props.hideTrowser();
    },

    getSelectedApp() {
        const selectedAppId = this.props.selectedAppId;
        return this.props.getApp(selectedAppId);
    },

    getEditingApp() {
        const appsList = this.props.getApps() || [];
        const selectedAppId = this.props.selectedAppId;

        if (this.props.location.query[UrlConsts.DETAIL_APPID]) {
            const childAppId = this.props.location.query[UrlConsts.DETAIL_APPID];
            return _.find(appsList, {id: childAppId});
        } else if (selectedAppId) {
            return _.find(appsList, {id: selectedAppId});
        }
        return null;
    },

    /**
     * get table object for currently editing table (or null if no table being edited)
     *
     */
    getEditingTable(tableId) {
        if (tableId) {
            const app = this.getEditingApp();
            if (app) {
                return _.find(app.tables, (t) => t.id === tableId);
            }
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
        let selectedApp = this.getSelectedApp();
        let reportData = this.getReportsData();
        return (selectedApp && reportData && reportData.rptId && reportData.data && reportData.data.name);
    },

    /**
     * get the report for the currently selected report (or null if no report selected)
     */
    getSelectedReport() {
        if (this.aReportIsSelected()) {
            return this.getReportsData();
        }
        return null;
    },

    /**
     *  if left nav is open, toggle apps list state based on open parameter;
     *  if left nav is collapsed, open the apps list and dispatch event to open nav
     */
    toggleAppsList(open) {
        if (this.props.shell.leftNavExpanded) {
            this.props.toggleAppsList(open);
        } else {
            this.props.toggleAppsList(OPEN_APPS_LIST);
            this.props.toggleLeftNav(OPEN_NAV);
        }
    },

    getEditFormFromProps() {
        return _.get(this.props, "forms.edit");
    },

    /**
     * open existing or new record in trowser if editRec param exists
     */
    updateRecordTrowser(oldRecId) {

        const {appId, tblId, rptId} = this.props.match.params;

        const editRec = this.props.location.query[UrlConsts.EDIT_RECORD_KEY];

        const editData = this.getEditFormFromProps();

        // load new form data if we have an edit record query parameter and the trowser is closed (or we have a new record ID)
        if (this.props.location.query[UrlConsts.EDIT_RECORD_KEY] &&
            (!editData || !editData.loading) &&
            (!this.props.shell.trowserOpen || oldRecId !== editRec)) {
            // load the edit form and in a trowser
            const showTrowser = true;
            const formType = "edit";
            // maybe a child create check
            if (this.props.location.query[UrlConsts.DETAIL_APPID] && this.props.location.query[UrlConsts.DETAIL_TABLEID] && this.props.location.query[UrlConsts.DETAIL_KEY_FID]) {
                let childAppId = this.props.location.query[UrlConsts.DETAIL_APPID];
                let childTableId = this.props.location.query[UrlConsts.DETAIL_TABLEID];
                let childReportId = this.props.location.query[UrlConsts.DETAIL_REPORTID];
                //`/qbase/app/${appId}/table/{1}/report/{2}?${EDIT_RECORD_KEY}=new&${DETAIL_APPID}={3}${DETAIL_TABLEID}={4}${DETAIL_KEY_FID}={5}&${DETAIL_KEY_VALUE}={6}`;
                this.props.loadForm(childAppId, childTableId, childReportId, formType, editRec, showTrowser);
            } else {
                this.props.loadForm(appId, tblId, rptId, formType, editRec, showTrowser);
            }
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
        let report = _.find(this.props.report, function(rpt) {
            return rpt.id === CONTEXT.REPORT.NAV;
        });
        return report || {};
    },

    /**
     *  Fetch the report list content.
     */
    getReportsList() {
        let reportList = _.find(this.props.report, function(rpt) {
            return rpt.id === CONTEXT.REPORT.NAV_LIST;
        });
        return reportList || {};
    },

    getPendEdits() {
        return getPendEdits(this.props.record);
    },

/*
    // Commenting out this function to render the top nav items in the center.
    // These items weren't enabled yet and were simply placeholders. We will need
    // to put some of them back so, leaving the code here for now.
    getCenterGlobalActions() {
        return (
            <ButtonGroup className="navItem">
                <Tooltip i18nMessageKey="unimplemented.search" location="bottom">
                    <Button tabIndex="2" className="disabled">
                        <Icon icon="search" />
                    </Button>
                </Tooltip>

                <Tooltip i18nMessageKey="unimplemented.favorites" location="bottom">
                    <Button tabIndex="3" className="disabled"><Icon icon="star-full" /></Button>
                </Tooltip>
            </ButtonGroup>
        );
    },
*/

    render() {
        const appsList = this.props.getApps() || [];
        const isAppsLoading = this.props.isAppsLoading;

        if (appsList.length === 0 && isAppsLoading) {
            // don't render anything until we've made this first api call without being redirected to V2
            // The common loading screen html is shared across server and client as an HTML file and
            // therefore must be loaded using the dangerouslySetInnerHTML attribute
            // see more information in common/src/views/Readme.md
            return <div dangerouslySetInnerHTML={{__html: LoadingScreen}} />;
        }

        let classes = "navShell";
        if (this.props.shell.leftNavVisible) {
            classes += " leftNavOpen";
        }
        const hasEditQuery = _.get(this.props, `location.query.${UrlConsts.EDIT_RECORD_KEY}`);
        let editRecordId = _.has(this.props, "location.query") ? this.props.location.query[UrlConsts.EDIT_RECORD_KEY] : null;
        let editRecordIdForPageTitle = editRecordId;

        if (editRecordId === UrlConsts.NEW_RECORD_VALUE) {
            editRecordId = SchemaConsts.UNSAVED_RECORD_ID;
        }

        let reportsData = this.getReportsData();
        let reportsList = this.getReportsList();
        let pendEdits = this.getPendEdits();

        const selectedAppId = this.props.selectedAppId;
        const selectedApp = this.getSelectedApp();
        const selectedTableId = this.props.selectedTableId;

        let editingAppId = this.props.match.params.appId;
        let editingTblId = this.props.match.params.tblId;
        let editingRecId = editRecordId;
        if (this.props.location.query[UrlConsts.DETAIL_APPID] &&
            this.props.location.query[UrlConsts.DETAIL_TABLEID] &&
            this.props.location.query[UrlConsts.DETAIL_KEY_FID]) {
            editingAppId  = this.props.location.query[UrlConsts.DETAIL_APPID];
            editingTblId  = this.props.location.query[UrlConsts.DETAIL_TABLEID];
        }

        return (<div className={classes}>
            <NavPageTitle
                app={selectedApp}
                table={this.getSelectedTable(reportsData.tblId)}
                report={this.getSelectedReport()}
                editingRecordId={editRecordIdForPageTitle}
            />

            <Analytics dataset={Config.evergageDataset} app={selectedApp} />

            <NotificationContainer/>

            {/* AppQbModal is an app-wide modal that can be called from non-react classes*/}
            <AppQbModal/>

            {/* show the trowser only when we have a editRec query param*/}
            {this.props.match.params && this.props.match.params.appId &&
            <RecordTrowser
                visible={this.props.shell.trowserOpen && this.props.shell.trowserContent === TrowserConsts.TROWSER_EDIT_RECORD && hasEditQuery}
                history={this.props.history}
                location={this.props.location}
                editForm={this.getEditFormFromProps()}
                appId={this.props.match.params.appId}
                tblId={this.props.match.params.tblId}
                editingAppId={editingAppId}
                editingTblId={editingTblId}
                editingRecId={editingRecId}
                recId={editRecordId}
                pendEdits={pendEdits}
                appUsers={this.props.selectedAppUsers}
                selectedApp={selectedApp}
                selectedTable={this.getSelectedTable(this.props.match.params.tblId)}
                editingApp={this.getEditingApp()}
                editingTable={this.getEditingTable(editingTblId)}
                reportData={reportsData}
                errorPopupHidden={this.props.shell.errorPopupHidden}
                onHideTrowser={this.hideTrowser}/>
            }

            {this.props.match.params && this.props.match.params.appId &&
            <ReportManagerTrowser visible={this.props.shell.trowserOpen && this.props.shell.trowserContent === TrowserConsts.TROWSER_REPORTS}
                                  history={this.props.history}
                                  selectedTable={this.getSelectedTable(reportsList.tblId)}
                                  filterReportsName={this.props.shell.filterReportsName}
                                  reportsData={reportsList}
                                  onHideTrowser={this.hideTrowser}/>
            }

            <LeftNav
                visible={this.props.shell.leftNavVisible}
                expanded={this.props.shell.leftNavExpanded}
                appsListOpen={this.props.shell.appsListOpen}
                apps={appsList}
                appsLoading={isAppsLoading}
                selectedAppId={selectedAppId}
                selectedTableId={selectedTableId}
                onSelectReports={this.onSelectTableReports}
                onToggleAppsList={this.toggleAppsList}
                globalActions={this.getLeftGlobalActions()}
                onSelect={this.onSelectItem}
                onCreateNewTable={this.allowCreateNewTable() && this.createNewTable}
                onNavClick={this.toggleNav}/>

            <div className="main" >
                <TopNav // centerGlobalActions={this.getCenterGlobalActions()} // commented out placeholders for now. See comments by getCenterGlobalActions()
                        globalActions={this.getTopGlobalActions()}
                        onNavClick={this.toggleNav}
                />
                {this.props.routes &&
                <div className="mainContent" >
                    <TempMainErrorMessages apps={appsList} appsLoading={isAppsLoading} selectedAppId={selectedAppId} />

                    <Switch>
                        { this.props.routes.map((route, i) => {
                                //insert the child route passed in by the router
                                // with additional props
                                // the Switch wrapper will pick only one of the routes the first
                                // that matches.
                            let routeProps = {
                                key : this.props.match ? this.props.match.url : "",
                                apps: appsList,
                                selectedAppId: selectedAppId,
                                appsLoading: isAppsLoading,
                                reportData: reportsData,
                                appUsers: this.props.appUsers,
                                appUsersUnfiltered: this.props.appUnfilteredUsers,
                                appRoles: this.props.appRoles,
                                appOwner: this.props.appOwner,
                                locale: this.props.shell.locale,
                                isRowPopUpMenuOpen: this.props.shell.isRowPopUpMenuOpen,
                                selectedApp: selectedApp,
                                selectedTable: this.getSelectedTable(reportsData.tblId),
                                scrollingReport: this.props.shell.scrollingReport
                            };
                            return RouteWithSubRoutes(route, i, routeProps);
                        }
                        )}
                        </Switch>
                </div>
                }

            </div>

            {pendEdits &&
            this.renderSavingModal(pendEdits.saving)
            }

            {selectedAppId && <TableCreationDialog app={selectedApp} onTableCreated={this.tableCreated}/>}
            {<AppCreationDialog />}

        </div>);
    },

    /**
     * new table was created, ensure it is displayed available in the UI
     */
    tableCreated(tblId) {
        const selectedAppId = this.props.selectedAppId;
        this.props.loadApp(selectedAppId);

        // store any new table IDs for duration of session for table homepage
        if (window.sessionStorage) {
            let newTables = window.sessionStorage.getItem(NEW_TABLE_IDS_KEY);

            let tableIds = newTables ? newTables.split(",") : [];
            tableIds.push(tblId);

            window.sessionStorage.setItem(NEW_TABLE_IDS_KEY, tableIds.join(","));
        }

        this.props.showTableReadyDialog();
    },

    onSelectItem() {
        // hide left nav after selecting items on small breakpoint
        if (Breakpoints.isSmallBreakpoint()) {
            this.props.toggleLeftNav(CLOSE_NAV);
        }
    },

    /**
     * Toggle open/closed the left nav based on its current state
     */
    toggleNav() {

        this.props.toggleLeftNav();
    },

    /**
     * is user able to create a new table from the left nav
     * @returns {*}
     */
    allowCreateNewTable() {
        const app = this.getSelectedApp();
        return app && AppUtils.hasAdminAccess(app.accessRights);
    },
    /**
     * open the create table wizard
     */
    createNewTable() {
        this.props.showTableCreationDialog();
    },
});

const mapStateToProps = (state, ownProps) => {
    return {
        getApp: (appId) => getApp(state.app, appId),
        getApps: () => getApps(state.app),
        appOwner: getAppOwner(state.app),
        appRoles: getAppRoles(state.selectedApp),
        selectedAppId: getSelectedAppId(state.app),
        selectedTableId: getSelectedTableId(state.app),
        appUsers: getAppUsers(state.app),
        appUnfilteredUsers: getAppUnfilteredUsers(state.app),
        isAppsLoading: getIsAppsLoading(state.app),
        forms: state.forms,
        shell: state.shell,
        record: state.record,
        report: state.report
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleAppsList: (toggleState) => dispatch(ShellActions.toggleAppsList(toggleState)),
        toggleLeftNav: (navState) => dispatch(ShellActions.toggleLeftNav(navState)),
        hideTrowser: () => dispatch(ShellActions.hideTrowser()),
        showTrowser: (content) => dispatch(ShellActions.showTrowser(content)),
        loadForm: (appId, tblId, rptId, formType, editRec, showTrowser) => {
            if (showTrowser) {
                dispatch(ShellActions.showTrowser(TrowserConsts.TROWSER_EDIT_RECORD));
            }
            return dispatch(FormActions.loadForm(appId, tblId, rptId, formType, editRec));
        },
        loadReports: (context, appId, tblId) => dispatch(ReportActions.loadReports(context, appId, tblId)),
        updateFormRedirectRoute: (route) => dispatch(updateFormRedirectRoute(route)),
        showTableCreationDialog: () => dispatch(TableCreationActions.showTableCreationDialog()),
        showTableReadyDialog: () => dispatch(TableCreationActions.showTableReadyDialog()),
        enterBuilderMode: (context) => dispatch(enterBuilderMode(context)),
        loadApps: () => dispatch(loadApps()),
        loadApp: (appId) => dispatch(loadApp(appId)),
        updateReportRedirectRoute: (context, route) => dispatch(updateReportRedirectRoute(context, route))
    };
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Nav));
