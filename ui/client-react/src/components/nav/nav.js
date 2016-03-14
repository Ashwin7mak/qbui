import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import {I18nMessage} from '../../utils/i18nMessage';
import Trowser from '../trowser/trowser';
import TrowserRecordActions from '../actions/trowserRecordActions';
import Fluxxor from 'fluxxor';
import LeftNav from './leftNav';
import TopNav from '../header/topNav';
import Footer from '../footer/footer';
import ReportManager from '../report/reportManager';
import QBicon from '../qbIcon/qbIcon';
import GlobalActions from '../actions/globalActions';
import Loader  from 'react-loader';
import Breakpoints from '../../utils/breakpoints';

import './nav.scss';
import '../../assets/css/animate.min.css';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Nav = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('NavStore', 'AppsStore', 'ReportsStore', 'ReportDataStore')],

    contextTypes: {
        touch: React.PropTypes.bool,
        history: React.PropTypes.object
    },
    // todo: maybe we should move this up another level into the router...
    getStateFromFlux() {
        let flux = this.getFlux();
        return {
            nav: flux.store('NavStore').getState(),
            apps: flux.store('AppsStore').getState(),
            reportsData: flux.store('ReportsStore').getState(),
            reportData: flux.store('ReportDataStore').getState()
        };
    },

    getTopGlobalActions() {
        const actions = [
            {msg:'globalActions.user', link:'/user', icon:'user'},
            {msg:'globalActions.help', link:'/help', icon:'help'}
        ];
        return (<GlobalActions actions={actions}
                               position={"top"}/>);
    },
    getLeftGlobalActions() {
        const actions = [
            {msg:'globalActions.help', link:'/help', icon:'help'}
        ];
        return (<GlobalActions actions={actions}
                               onSelect={this.onSelectItem}
                               dropdownIcon="user"
                               dropdownMsg="globalActions.user"
                               position={"left"}/>);
    },
    hideTrowser() {
        let flux = this.getFlux();
        flux.actions.hideTrowser();
    },
    onSelectTableReports(tableId) {
        const flux = this.getFlux();

        if (Breakpoints.isSmallBreakpoint()) {
            flux.actions.toggleLeftNav(false);
        }
        flux.actions.showTrowser();
        flux.actions.loadReports(this.state.apps.selectedAppId, tableId);
    },
    /**
     *  get breadcrumb element for top of trowser
     */
    getTrowserBreadcrumbs() {
        if (this.state.reportsData.appId && this.state.reportsData.tableId) {

            let app = this.state.apps.apps.find((a) => a.id === this.state.reportsData.appId);
            let tables = app ? app.tables : [];
            let table = tables.find((t) => t.id === this.state.reportsData.tableId);

            return (
                <h3><QBicon icon="report-table"/> {table ? table.name : ""} <QBicon icon="caret-right"/> <I18nMessage message={'nav.reportsHeading'}/></h3>);
        }
        return null;
    },
    /**
     *  get actions element for bottome center of trowser (placeholders for now)
     */
    getTrowserActions() {
        return (<div className={"centerActions"}>
                <a href="#"><QBicon icon="add-mini"/><I18nMessage message={'report.newReport'}/></a>
                <a href="#"><QBicon icon="settings"/><I18nMessage message={'report.organizeReports'}/></a>
            </div>);
    },
    /**
     * get trowser content (report nav for now)
     */
    getTrowserContent() {

        let selectReport = (report) => {
            this.hideTrowser();
            setTimeout(() => {
                // give UI transition a moment to execute
                this.context.history.pushState(null, report.link);
            });
        };
        return <ReportManager reportsData={this.state.reportsData}
                              onSelectReport={selectReport}/>;
    },

    /* toggle apps list - if on collapsed nav, open left nav and display apps */
    toggleAppsList(open) {
        const flux = this.getFlux();

        if (this.state.nav.leftNavOpen) {
            flux.actions.toggleAppsList(open);
        } else {
            flux.actions.toggleAppsList(true);
            flux.actions.toggleLeftNav(true);
        }
    },
    render() {
        const flux = this.getFlux();

        let classes = 'navShell ';

        return (<div className={classes}>

            <Trowser position={"top"}
                     visible={this.state.nav.trowserOpen}
                     breadcrumbs={this.getTrowserBreadcrumbs()}
                     centerActions={this.getTrowserActions()}
                     onCancel={this.hideTrowser}
                     onDone={this.hideTrowser}
                     content={this.getTrowserContent()} />

            <LeftNav
                open={this.state.nav.leftNavOpen}
                appsListOpen={this.state.nav.appsListOpen && this.state.nav.leftNavOpen}
                apps={this.state.apps.apps}
                selectedAppId={this.state.apps.selectedAppId}
                selectedTableId={this.state.apps.selectedTableId}
                onSelectReports={this.onSelectTableReports}
                onToggleAppsList={this.toggleAppsList}
                globalActions={this.getLeftGlobalActions()}
                onSelect={this.onSelectItem}
                onNavClick={this.toggleNav}/>

            <div className="main">
                <TopNav title={this.state.nav.topTitle}
                        globalActions={this.getTopGlobalActions()}
                        onNavClick={this.toggleNav}
                        flux={flux} />
                {this.props.children &&
                    <div className="mainContent" >
                        {/* insert the component passed in by the router */}
                        {React.cloneElement(this.props.children, {
                            key: this.props.location ? this.props.location.pathname : "",
                            selectedAppId: this.state.apps.selectedAppId,
                            reportData: this.state.reportData,
                            flux: flux}
                        )}
                    </div>}
            </div>
        </div>);
    },
    onSelectItem() {
        const flux = this.getFlux();
        flux.actions.toggleLeftNav(false); // hide left nav after selecting items on small breakpoint
    },
    toggleNav: function() {
        let flux = this.getFlux();
        flux.actions.toggleLeftNav();
    }
});

export default Nav;
