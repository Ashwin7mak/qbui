import React from "react";

import Fluxxor from "fluxxor";
import LeftNav from "./leftNav";
import TopNav from "../header/topNav";
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
import WindowLocationUtils from '../../utils/windowLocationUtils';
import "../../assets/css/animate.min.css";
import * as TrowserConsts from "../../constants/trowserConstants";
import * as UrlConsts from "../../constants/urlConstants";
import PageTitle from '../pageTitle/pageTitle';
import Locale from '../../locales/locales';
import InvisibleBackdrop from '../qbModal/invisibleBackdrop';
import AppQbModal from '../qbModal/appQbModal';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

export let Nav = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('NavStore', 'AppsStore', 'ReportsStore', 'ReportDataStore', 'RecordPendingEditsStore', 'FieldsStore', 'FormStore')],

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
            form: flux.store('FormStore').getState(),
            reportSearchData: flux.store('ReportDataSearchStore').getState(),
        };
    },

    getTopGlobalActions() {
        const actions = [
            {msg:'globalActions.help', link:'/qbase/help', icon:'help'}
        ];
        return (<GlobalActions actions={actions}
                               position={"top"}
                               dropdownIcon="user"
                               dropdownMsg="globalActions.user"
                               startTabIndex={4}/>);
    },

    getLeftGlobalActions() {
        const actions = [
            {msg:'globalActions.help', link:'/qbase/help', icon:'help'}
        ];
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
                flux.actions.toggleLeftNav(false);
            }, 0);
        }
        flux.actions.showTrowser(TrowserConsts.TROWSER_REPORTS);
        flux.actions.loadReports(this.state.apps.selectedAppId, tableId);
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

    /* toggle apps list - if on collapsed nav, open left nav and display apps */
    toggleAppsList(open) {
        const flux = this.getFlux();

        if (this.state.nav.leftNavExpanded) {
            flux.actions.toggleAppsList(open);
        } else {
            flux.actions.toggleAppsList(true);
            flux.actions.toggleLeftNav(true);
        }
    },

    /**
     * open existing or new record in trowser if editRec param exists
     */
    updateRecordTrowser(oldRecId) {

        const {appId, tblId, rptId} = this.props.params;

        const editRec = this.props.location.query[UrlConsts.EDIT_RECORD_KEY];

        // load new form data if we have an edit record query parameter and the trowser is closed (or we have a new record ID)
        if (this.props.location.query[UrlConsts.EDIT_RECORD_KEY] && !this.state.form.editFormLoading && (!this.state.nav.trowserOpen || oldRecId !== editRec)) {


            const flux = this.getFlux();

            if (editRec === UrlConsts.NEW_RECORD_VALUE) {
                flux.actions.loadForm(appId, tblId, rptId, "edit", true).then(() => {
                    flux.actions.showTrowser(TrowserConsts.TROWSER_EDIT_RECORD);
                });
            } else {
                flux.actions.loadFormAndRecord(appId, tblId, editRec, rptId, "edit", true).then(() => {
                    flux.actions.showTrowser(TrowserConsts.TROWSER_EDIT_RECORD);
                });
            }
        }
    },

    componentDidUpdate(prevProps) {

        // component updated, update the record trowser content if necessary
        // temporary solution to prevent UI getting in an endless loop state (MB-1369)
        const {editFormErrorStatus, editFormLoading, errorStatus} = this.state.form;
        if (!editFormLoading) {
            this.updateRecordTrowser(prevProps.location.query.editRec);
        }
    },

    renderSavingModal(showIt) {
        return <InvisibleBackdrop show={showIt}/>;
    },


    render() {
        const flux = this.getFlux();

        let classes = "navShell";
        if (this.state.nav.leftNavVisible) {
            classes += " leftNavOpen";
        }
        let editRecordId = _.has(this.props, "location.query") ? this.props.location.query[UrlConsts.EDIT_RECORD_KEY] : null;
        let editRecordIdForPageTitle = editRecordId;

        if (editRecordId === UrlConsts.NEW_RECORD_VALUE) {
            editRecordId = SchemaConsts.UNSAVED_RECORD_ID;
        }

        return (<div className={classes}>
            <PageTitle app={this.getSelectedApp()} table={this.getSelectedTable()} report={this.getSelectedReport()} recordId={editRecordIdForPageTitle} />
            <NotificationContainer/>
            {/* AppQbModal is an app-wide modal that can be called from non-react classes*/}
            <AppQbModal/>

            {this.props.params && this.props.params.appId &&
                <RecordTrowser visible={this.state.nav.trowserOpen && this.state.nav.trowserContent === TrowserConsts.TROWSER_EDIT_RECORD}
                               router={this.props.router}
                               form={this.state.form}
                               appId={this.props.params.appId}
                               tblId={this.props.params.tblId}
                               recId={editRecordId}
                               pendEdits={this.state.pendEdits}
                               appUsers={this.state.apps.appUsers}
                               selectedApp={this.getSelectedApp()}
                               selectedTable={this.getSelectedTable()}
                               reportData={this.state.reportData}
                               errorPopupHidden={this.state.nav.errorPopupHidden}/>
            }
            {this.props.params && this.props.params.appId &&
                <ReportManagerTrowser visible={this.state.nav.trowserOpen && this.state.nav.trowserContent === TrowserConsts.TROWSER_REPORTS}
                                      router={this.props.router}
                                      selectedTable={this.getSelectedTable()}
                                      filterReportsName={this.state.nav.filterReportsName}
                                      reportsData={this.state.reportsData}/>
            }

            <LeftNav
                visible={this.state.nav.leftNavVisible}
                expanded={this.state.nav.leftNavExpanded}
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
                            pendEdits:this.state.pendEdits,
                            isRowPopUpMenuOpen: this.state.nav.isRowPopUpMenuOpen,
                            fields: this.state.fields,
                            form: this.state.form,
                            reportSearchData: this.state.reportSearchData,
                            selectedApp: this.getSelectedApp(),
                            selectedTable: this.getSelectedTable(),
                            scrollingReport: this.state.nav.scrollingReport,
                            flux: flux}
                        )}
                    </div>}
            </div>
            {this.state.pendEdits &&
                this.renderSavingModal(this.state.pendEdits.saving)
            }
        </div>);
    },
    onSelectItem() {

        if (Breakpoints.isSmallBreakpoint()) {
            const flux = this.getFlux();

            flux.actions.toggleLeftNav(false); // hide left nav after selecting items on small breakpoint
        }
    },
    toggleNav: function() {
        let flux = this.getFlux();
        flux.actions.toggleLeftNav();
    }
});


export let NavWithRouter = withRouter(Nav);
export default NavWithRouter;

