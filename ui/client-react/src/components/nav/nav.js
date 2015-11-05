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

    hideTrouserExample() {
        let flux = this.getFlux();
        flux.actions.hideTrouser();
    },

    renderLarge() {
        const flux = this.getFlux();

        let classes = 'navShell ' + this.props.breakpoint;

        return (<div className={classes}>

            <Trouser visible={this.state.nav.trouserOpen} onHide={this.hideTrouserExample}>
                <Button bsStyle="success" onClick={this.hideTrouserExample}
                        style={{position:"absolute", bottom:"10px", right:"10px"}}>Done</Button>
            </Trouser>

            <LeftNav
                items={this.state.nav.leftNavItems}
                open={this.state.nav.leftNavOpen}
                reportsData={this.state.reportsData}
                reportID={this.state.reportData.rptId}
                flux={flux} />

            <div className="main">
                <TopNav title="QuickBase"  onNavClick={this.toggleNav} onAddClicked={this.showTrouser} flux={flux} />
                {this.props.children && this.props.children.main ?
                    <ReactCSSTransitionGroup className="mainContent"
                                         transitionName="main-transition"
                                         transitionAppear={true}
                                         transitionAppearTimeout={600}
                                         transitionEnterTimeout={600}
                                         transitionLeaveTimeout={600} >
                    {/* insert the main component passed in by the router */}
                    {React.cloneElement(this.props.children.main, {key: this.props.location ? this.props.location.pathname : "", reportData: this.state.reportData, breakpoint: this.props.breakpoint,  flux: flux})}
                </ReactCSSTransitionGroup> : null}

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

        let classes = 'navShell ' + this.props.breakpoint;
        if (this.state.nav.leftNavOpen) {
            classes += ' leftNavOpen';
        }
        return (<div className={classes}>
            <LeftNav
                items={this.state.nav.leftNavItems}
                open={this.state.nav.leftNavOpen}
                reportsData={this.state.reportsData}
                reportID={this.state.reportData.rptId}
                onSelect={onSelectSmall}
                flux={flux} />

            <div className="main">
                <MobileTopNav title="QuickBase" searching={searching} searchBarOpen={searchBarOpen}  onNavClick={this.toggleNav} flux={flux} />

                {this.props.children && this.props.children.main ?
                    <ReactCSSTransitionGroup className="mainContent"
                                         transitionName="main-transition"
                                         transitionAppear={true}
                                         transitionAppearTimeout={600}
                                         transitionEnterTimeout={600}
                                         transitionLeaveTimeout={600} >
                    {/* insert the main component passed in by the router */}
                    {this.props.children && this.props.children.main ? React.cloneElement(this.props.children.main, {key: this.props.location ? this.props.location.pathname : "", reportData: this.state.reportData, breakpoint: this.props.breakpoint,  flux: flux}) : null}
                </ReactCSSTransitionGroup> : null}

                {/* insert the footer if route wants it */}
                <MobileAddFooter newItemsOpen={this.state.nav.newItemsOpen} flux= {flux} />
            </div>
        </div>);
    },
    render() {
        if (this.props.breakpoint === breakpoints.SMALL_BREAKPOINT) {
            return this.renderSmall();
        } else {
            return this.renderLarge();
        }
    }
});

export default Nav;
