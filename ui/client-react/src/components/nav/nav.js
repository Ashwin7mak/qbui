import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

import * as breakpoints from '../../constants/breakpoints';
import './nav.scss';
import Button from 'react-bootstrap/lib/Button';
import Trouser from '../trouser/trouser';

import Fluxxor from 'fluxxor';

import LeftNav from './leftNav';

import TopNav from '../header/topNav';
import MobileTopNav from '../header/mobileTopNav';

import Footer from '../footer/footer';
import MobileAddFooter from '../footer/mobileAddFooter';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Nav = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('NavStore', 'AppsStore', 'ReportsStore', 'ReportDataStore')],

    contextTypes: {
        breakpoint: React.PropTypes.string
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

    getGlobalActions() {

        return [
            {key:'globalActions.user', link:'/apps', icon:'user'},
            {key:'globalActions.alerts', link:'/apps', icon:'exclamation-sign'},
            {key:'globalActions.help', link:'/apps', icon:'question-sign'},
            {key:'globalActions.logout', link:'/apps', icon:'off'}
        ];
    },
    hideTrouserExample() {
        let flux = this.getFlux();
        flux.actions.hideTrouser();
    },
    onSelectTableReports(tableId) {
        const flux = this.getFlux();
        flux.actions.showReports();
        flux.actions.loadReports(this.state.apps.selectedAppId, tableId);

    },
    onHideTableReports() {
        const flux = this.getFlux();
        flux.actions.hideReports();
    },
    renderLarge() {

        const flux = this.getFlux();

        let classes = 'navShell ';

        return (<div className={classes}>

            <Trouser visible={this.state.nav.trouserOpen} onHide={this.hideTrouserExample}>
                <Button bsStyle="success" onClick={this.hideTrouserExample}
                        style={{position:"absolute", bottom:"10px", right:"10px"}}>Done</Button>
            </Trouser>

            <LeftNav
                items={this.state.nav.leftNavItems}
                open={this.state.nav.leftNavOpen}
                appsListOpen={this.state.nav.appsListOpen}
                apps={this.state.apps.apps}
                selectedAppId={this.state.apps.selectedAppId}
                selectedTableId={this.state.apps.selectedTableId}
                reportsData={this.state.reportsData}
                selectedReportId={this.state.reportData.rptId}
                showReports={this.state.nav.showReports}
                onSelectReports={this.onSelectTableReports}
                onHideReports={this.onHideTableReports}
                flux={flux} />

            <div className="main">
                <TopNav title="QuickBase"  globalActions={this.getGlobalActions()} onNavClick={this.toggleNav} onAddClicked={this.showTrouser} flux={flux} />
                {this.props.children && <ReactCSSTransitionGroup className="mainContent"
                                         transitionName="main-transition"
                                         transitionAppear={true}
                                         transitionAppearTimeout={600}
                                         transitionEnterTimeout={600}
                                         transitionLeaveTimeout={600} >
                    {/* insert the component passed in by the router */}
                    {React.cloneElement(this.props.children, {key: this.props.location ? this.props.location.pathname : "", selectedAppId: this.state.apps.selectedAppId, reportData: this.state.reportData,  flux: flux})}
                </ReactCSSTransitionGroup>}

                <Footer flux= {flux} />
            </div>
        </div>);
    },
    renderSmall() {
        const flux = this.getFlux();

        function onSelectSmall() {
            flux.actions.toggleLeftNav(false);
        }
        const searchBarOpen = this.state.nav.searchBarOpen;
        const searching = this.state.nav.searching;

        let classes = 'navShell';
        if (this.state.nav.leftNavOpen) {
            classes += ' leftNavOpen';
        }
        return (<div className={classes}>
            <LeftNav
                items={this.state.nav.leftNavItems}
                open={this.state.nav.leftNavOpen}
                appsListOpen={this.state.nav.appsListOpen}
                apps={this.state.apps.apps}
                selectedAppId={this.state.apps.selectedAppId}
                selectedTableId={this.state.apps.selectedTableId}
                reportsData={this.state.reportsData}
                selectedReportId={this.state.reportData.rptId}
                showReports={this.state.nav.showReports}
                onSelectReports={this.onSelectTableReports}
                onHideReports={this.onHideTableReports}
                onSelect={onSelectSmall}
                globalActions={this.getGlobalActions()}
                flux={flux} />

            <div className="main">
                <MobileTopNav title="QuickBase" searching={searching} searchBarOpen={searchBarOpen}  onNavClick={this.toggleNav} flux={flux} />

                {this.props.children && <ReactCSSTransitionGroup className="mainContent"
                                         transitionName="main-transition"
                                         transitionAppear={true}
                                         transitionAppearTimeout={600}
                                         transitionEnterTimeout={600}
                                         transitionLeaveTimeout={600} >
                    {/* insert the component passed in by the router */}
                    {React.cloneElement(this.props.children, {key: this.props.location ? this.props.location.pathname : "", selectedAppId: this.state.apps.selectedAppId, reportData: this.state.reportData, flux: flux})}
                </ReactCSSTransitionGroup>}

                {/* insert the footer if route wants it */}
                <MobileAddFooter newItemsOpen={this.state.nav.newItemsOpen} flux= {flux} />
            </div>
        </div>);
    },
    render() {
        if (this.context.breakpoint === breakpoints.SMALL_BREAKPOINT) {
            return this.renderSmall();
        } else {
            return this.renderLarge();
        }
    }
});

export default Nav;
