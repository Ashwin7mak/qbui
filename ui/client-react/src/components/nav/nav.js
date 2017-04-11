import React from "react";
import Fluxxor from "fluxxor";
import LeftNav from "./leftNav";
import TopNav from "../header/topNav";
import TempMainErrorMessages from './tempMainErrorMessages';
import ReportManagerTrowser from "../report/reportManagerTrowser";
import RecordTrowser from "../record/recordTrowser";
import ReportFieldSelectTrowser from '../report/reportFieldSelectTrowser';
import ListOfElements from '../../../../reuse/client/src/components/sideNavs/listOfElements';

import GlobalActions from "../actions/globalActions";
import BuilderDropDownAction from '../actions/builderDropDownAction';
import Breakpoints from "../../utils/breakpoints";
import {NotificationContainer} from "react-notifications";
import {withRouter} from 'react-router';
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
import {addColumnToTable, toggleFieldSelectorMenu} from '../../actions/reportActions';

import {CONTEXT} from '../../actions/context';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Button from 'react-bootstrap/lib/Button';
import Tooltip from '../../../../reuse/client/src/components/tooltip/tooltip';
import Icon from '../../../../reuse/client/src/components/icon/icon';
import TableCreationDialog from '../table/tableCreationDialog';
import AppUtils from '../../utils/appUtils';
import QBicon from '../qbIcon/qbIcon';


// This shared view with the server layer must be loaded as raw HTML because
// the current backend setup cannot handle a react component in a common directory. It is loaded
// as a raw string and we tell react to interpret it as HTML. See more in common/src/views/Readme.md
import LoadingScreen from 'raw!../../../../common/src/views/loadingScreen.html';

//  import styles
import "./nav.scss";
import "react-notifications/lib/notifications.css";
import "../../assets/css/animate.min.css";

const OPEN_NAV = true;
const CLOSE_NAV = false;
const OPEN_APPS_LIST = true;

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;
export const Nav = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('NavStore', 'AppsStore')],

    contextTypes: {
        touch: React.PropTypes.bool
    },

    getStateFromFlux() {
        let flux = this.getFlux();
        return {
            nav: flux.store('NavStore').getState(),
            apps: flux.store('AppsStore').getState()
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

        this.props.router.push(link);
    },

    getTopGlobalActions() {
        const actions = [];
        let recordId;
        if (this.props.params) {
            recordId = this.props.params.recordId;
        }
        let selectedApp = this.getSelectedApp();
        let isAdmin = false;
        if (selectedApp) {
            isAdmin = AppUtils.hasAdminAccess(selectedApp.accessRights);
        }
        return (<GlobalActions actions={actions}
                               position={"top"}
                               dropdownIcon="user"
                               dropdownMsg="globalActions.user"
                               startTabIndex={4}
                               app={selectedApp}>
            {isAdmin ?
                    <BuilderDropDownAction
                                router={this.props.router}
                                selectedApp={selectedApp}
                                selectedTable={this.getSelectedTable(this.state.apps.selectedTableId)}
                                recId={recordId}
                                actions={actions}
                                position={"top"}
                                icon="settings"
                                navigateToBuilder={this.navigateToBuilder}
                                startTabIndex={4}/> : null}
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
        this.props.loadReports(CONTEXT.REPORT.NAV_LIST, this.state.apps.selectedAppId, tableId);
    },

    /**
     * hide the trowser
     */
    hideTrowser() {
        this.props.hideTrowser();
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
        if (this.props.shell.leftNavExpanded) {
            this.props.toggleAppsList(open);
        } else {
            this.props.toggleAppsList(OPEN_APPS_LIST);
            this.props.toggleLeftNav(OPEN_NAV);
        }
    },

    getEditFormFromProps() {
        return _.has(this.props, "forms") && _.find(this.props.forms, form => form.id === "edit");
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
            (!this.props.shell.trowserOpen || oldRecId !== editRec)) {
            // load the edit form and in a trowser
            const showTrowser = true;
            const formType = "edit";
            this.props.loadForm(appId, tblId, rptId, formType, editRec, showTrowser);
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
        let pendEdits = {};
        //  TODO: just getting to work....improve this to support multi records...
        if (Array.isArray(this.props.record) && this.props.record.length > 0) {
            if (_.isEmpty(this.props.record[0]) === false) {
                pendEdits = this.props.record[0].pendEdits || {};
            }
        }
        return pendEdits;
    },

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

    toggleFieldSelectorMenu(context, appId, tblId, rptId, params) {
        this.props.toggleFieldSelectorMenu(context, appId, tblId, rptId, params);
    },

    addColumnToTable(columnData, reportData) {
        let params = {
            clickedId: this.props.shell.fieldsSelectMenu.clickedId,
            requested: columnData,
            addBefore: this.props.shell.fieldsSelectMenu.addBefore
        };

        console.log(reportData);

        this.props.addColumnToTable(CONTEXT.REPORT.NAV, reportData.appId, reportData.tblId, reportData.rptId, params);
    },

    getMenuContent(reportData) {
        let elements = [];
        let columns = reportData.data ? reportData.data.columns : [];
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].fieldDef.isHidden) {
                elements.push({
                    key: columns[i].id + "",
                    title: columns[i].headerName,
                    onClick: (() => {
                        this.addColumnToTable(columns[i], reportData)
                    })
                });
            }
        }

        let params = {
            open: false
        };

        return (
            <div className="fieldSelect">
                <QBicon
                    icon="close"
                    onClick={() => this.toggleFieldSelectorMenu(CONTEXT.REPORT.NAV, reportData.appId, reportData.tblId, reportData.rptId, params)}
                    className="fieldSelectCloseIcon"
                />
                <div className="header">Fields</div>
                <div className="info">Add a field to the report</div>
                <ListOfElements
                    elements={elements}
                    emptyListMessage={"All fields are shown in the table."}
                />
            </div>
        );
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
        if (this.props.shell.leftNavVisible) {
            classes += " leftNavOpen";
        }
        let editRecordId = _.has(this.props, "location.query") ? this.props.location.query[UrlConsts.EDIT_RECORD_KEY] : null;
        let editRecordIdForPageTitle = editRecordId;

        if (editRecordId === UrlConsts.NEW_RECORD_VALUE) {
            editRecordId = SchemaConsts.UNSAVED_RECORD_ID;
        }

        let viewingRecordId = null;
        let reportsData = this.getReportsData();
        let reportsList = this.getReportsList();
        let pendEdits = this.getPendEdits();
        let menuContent = this.getMenuContent(reportsData);

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
                <RecordTrowser visible={this.props.shell.trowserOpen && this.props.shell.trowserContent === TrowserConsts.TROWSER_EDIT_RECORD}
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
                               errorPopupHidden={this.props.shell.errorPopupHidden}
                               onHideTrowser={this.hideTrowser}/>
            }
            {this.props.params && this.props.params.appId &&
                <ReportManagerTrowser visible={this.props.shell.trowserOpen && this.props.shell.trowserContent === TrowserConsts.TROWSER_REPORTS}
                                      router={this.props.router}
                                      selectedTable={this.getSelectedTable(reportsList.tblId)}
                                      filterReportsName={this.state.nav.filterReportsName}
                                      reportsData={reportsList}
                                      onHideTrowser={this.hideTrowser}/>
            }

            <LeftNav
                visible={this.props.shell.leftNavVisible}
                expanded={this.props.shell.leftNavExpanded}
                appsListOpen={this.props.shell.appsListOpen}
                apps={this.state.apps.apps}
                appsLoading={this.state.apps.loading}
                selectedAppId={this.state.apps.selectedAppId}
                selectedTableId={this.state.apps.selectedTableId}
                onSelectReports={this.onSelectTableReports}
                onToggleAppsList={this.toggleAppsList}
                globalActions={this.getLeftGlobalActions()}
                onSelect={this.onSelectItem}
                onCreateNewTable={this.allowCreateNewTable() && this.createNewTable}
                onNavClick={this.toggleNav}/>

            <div className="main" >
                <TopNav title={this.state.nav.topTitle}
                        centerGlobalActions={this.getCenterGlobalActions()}
                        globalActions={this.getTopGlobalActions()}
                        onNavClick={this.toggleNav}
                        showOnSmall={this.state.nav.showTopNav}
                />
                {this.props.children &&
                    <div className="mainContent" >
                        <ReportFieldSelectTrowser
                            sideMenuContent={menuContent}
                            isCollapsed={this.props.shell.fieldsSelectMenu.fieldsListCollapsed}
                            isDocked={false}
                            pullRight>
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
                            appOwner: this.state.apps.appOwner,
                            locale: this.state.nav.locale,
                            isRowPopUpMenuOpen: this.props.shell.isRowPopUpMenuOpen,
                            selectedApp: this.getSelectedApp(),
                            selectedTable: this.getSelectedTable(reportsData.tblId),
                            scrollingReport: this.state.nav.scrollingReport,
                            flux: flux}
                        )}</ReportFieldSelectTrowser>
                    </div>}

            </div>

            {pendEdits &&
                this.renderSavingModal(pendEdits.saving)
            }

            {this.state.apps.selectedAppId && <TableCreationDialog app={this.getSelectedApp()} onTableCreated={this.tableCreated}/>}
        </div>);
    },

    /**
     * new table was created, ensure it is displayed available in the UI
     */
    tableCreated() {
        const flux = this.getFlux();

        flux.actions.loadApps(true);
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
        this.props.dispatch(TableCreationActions.showTableCreationDialog());
    }
});

const mapStateToProps = (state) => {
    return {
        forms: state.forms,
        shell: state.shell,
        record: state.record,
        report: state.report
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleAppsList: (toggleState) => {
            dispatch(ShellActions.toggleAppsList(toggleState));
        },
        toggleLeftNav: (navState) => {
            dispatch(ShellActions.toggleLeftNav(navState));
        },
        hideTrowser: () => {
            dispatch(ShellActions.hideTrowser());
        },
        showTrowser: (content) => {
            dispatch(ShellActions.showTrowser(content));
        },
        loadForm: (appId, tblId, rptId, formType, editRec, showTrowser) => {
            dispatch(FormActions.loadForm(appId, tblId, rptId, formType, editRec)).then(() => {
                if (showTrowser) {
                    dispatch(ShellActions.showTrowser(TrowserConsts.TROWSER_EDIT_RECORD));
                }
            });
        },
        loadReports: (context, appId, tblId) => {
            dispatch(ReportActions.loadReports(context, appId, tblId));
        },
        addColumnToTable: (context, appId, tblId, rptId, params) => {
            dispatch(addColumnToTable(context, appId, tblId, rptId, params));
        },
        toggleFieldSelectorMenu: (context, appId, tblId, rptId, params) => {
            dispatch(toggleFieldSelectorMenu(context, appId, tblId, rptId, params));
        }
    };
};

export const NavWithRouter = withRouter(Nav);
export const ConnectedNavRoute = connect(
    mapStateToProps,
    mapDispatchToProps
)(Nav);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NavWithRouter);
