import React from "react";

import Fluxxor from "fluxxor";
import LeftNav from "./leftNav";
import TopNav from "../header/topNav";
import ReportManagerTrowser from "../report/reportManagerTrowser";


import GlobalActions from "../actions/globalActions";
import Breakpoints from "../../utils/breakpoints";
import {NotificationContainer} from "react-notifications";
import {withRouter} from 'react-router';
import "./nav.scss";
import "react-notifications/lib/notifications.css";
import "../../assets/css/animate.min.css";

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
            form: flux.store('FormStore').getState()
        };
    },

    getTopGlobalActions() {
        const actions = [
            {msg:'globalActions.user', link:'/user', icon:'user'},
            {msg:'globalActions.help', link:'/help', icon:'help'}
        ];
        return (<GlobalActions actions={actions}
                               position={"top"}
                               startTabIndex={4}/>);
    },

    getLeftGlobalActions() {
        const actions = [
            {msg:'globalActions.user', link:'/user', icon:'user'}
        ];
        return (<GlobalActions actions={actions}
                               onSelect={this.onSelectItem}
                               dropdownIcon="help"
                               dropdownMsg="globalActions.help"
                               startTabIndex={100}
                               position={"left"}/>);
    },

    onSelectTableReports(tableId) {
        const flux = this.getFlux();

        if (Breakpoints.isSmallBreakpoint()) {
            flux.actions.toggleLeftNav(false);
        }
        flux.actions.showTrowser("reports");
        flux.actions.loadReports(this.state.apps.selectedAppId, tableId);
    },

    getSelectedApp() {
        if (this.state.apps.selectedAppId) {

            return this.state.apps.apps.find((a) => a.id === this.state.apps.selectedAppId);
        }
        return null;
    },
    /**
     * get table object for currently selecte table (or null if no table selected);
     *
     */
    getSelectedTable() {
        const app = this.getSelectedApp();

        if (app && this.state.reportsData.tableId) {
            return app.tables.find((t) => t.id === this.state.reportsData.tableId);
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
    render() {
        const flux = this.getFlux();

        let classes = "navShell";
        if (this.state.nav.leftNavVisible) {
            classes += " leftNavOpen";
        }

        return (<div className={classes}>

            <ReportManagerTrowser visible={this.state.nav.trowserOpen}
                                  router={this.props.router}
                                  selectedTable={this.getSelectedTable()}
                                  filterReportsName={this.state.nav.filterReportsName}
                                  reportsData={this.state.reportsData}
            />


            <LeftNav
                visible={this.state.nav.leftNavVisible}
                expanded={this.state.nav.leftNavExpanded}
                appsListOpen={this.state.nav.appsListOpen}
                apps={this.state.apps.apps}
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
                        <NotificationContainer/>
                        {/* insert the component passed in by the router */}
                        {React.cloneElement(this.props.children, {
                            key: this.props.location ? this.props.location.pathname : "",
                            selectedAppId: this.state.apps.selectedAppId,
                            reportData: this.state.reportData,
                            appUsers: this.state.apps.appUsers,
                            pendEdits:this.state.pendEdits,
                            fields: this.state.fields,
                            form: this.state.form,
                            selectedApp: this.getSelectedApp(),
                            selectedTable: this.getSelectedTable(),
                            scrollingReport: this.state.nav.scrollingReport,
                            flux: flux}
                        )}
                    </div>}
            </div>
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

