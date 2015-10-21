import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

import { render } from 'react-dom'
import './nav.scss';
import Loader  from 'react-loader';
import Button from 'react-bootstrap/lib/Button';
import Trouser from '../trouser/trouser';

import Logger from '../../utils/logger';
let logger = new Logger();

import Fluxxor from 'fluxxor';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;


var Nav = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('NavStore','AppsStore','ReportsStore','ReportDataStore')],

    // todo: maybe we should move this up another level into the router...
    getStateFromFlux: function() {
        let flux = this.getFlux();
        return {
            nav: flux.store('NavStore').getState(),
            apps: flux.store('AppsStore').getState(),
            reportsData: flux.store('ReportsStore').getState(),
            reportData: flux.store('ReportDataStore').getState()
        };
    },

    hideTrouserExample: function() {
        let flux = this.getFlux();
        flux.actions.hideTrouser();
    },

    render: function() {

        let flux = this.getFlux();

        const { pathname } = this.props.location;
        const key = pathname.split('/')[1] || 'root';

        const { main, topNav, leftNav, footer } = this.props.children;

        const mobileNavOpen = this.props.mobile && this.state.nav.mobileLeftNavOpen;
        const navOpen = mobileNavOpen || this.state.nav.leftNavOpen;
        const searchBarOpen = this.state.nav.searchBarOpen;

        const i18n = this.state.nav.i18n;

        // todo: might be cleaner to just pass {...this.state} down and let the child components use what they need...
        return (<div className={mobileNavOpen ? 'navShell mobileNavOpen' : 'navShell'}>
            <Trouser visible={this.state.nav.trouserOpen} onHide={this.hideTrouserExample}>
                <Button bsStyle='success' onClick={this.hideTrouserExample} style={{position:'absolute',bottom:'10px',right:'10px'}}>Done</Button>
            </Trouser>

            {/* insert the leftNav component passed in by the router */}
            {React.cloneElement(leftNav,{...i18n, items:this.state.nav.leftNavItems, open: navOpen, reportsData: this.state.reportsData, reportID: this.state.reportData.rptId, flux: flux} )}

            <div className='main'>
                {React.cloneElement(topNav, {...i18n, title:'QuickBase', searchBarOpen: searchBarOpen, mobile: this.props.mobile, onNavClick:this.toggleNav, onAddClicked:this.showTrouser, flux: flux} )}

                <ReactCSSTransitionGroup className='mainContent'
                                         transitionName="main-transition"
                                         transitionAppear={true}
                                         transitionAppearTimeout={500}
                                         transitionEnterTimeout={500}
                                         transitionLeaveTimeout={500} >
                {/* insert the main component passed in by the router */}
                {React.cloneElement(main, {...i18n, key: pathname, reportData: this.state.reportData, mobile: this.props.mobile,  flux: flux} )}
                </ReactCSSTransitionGroup>

                {/* insert the footer if route wants it */}
                {footer ? React.cloneElement(footer, {...i18n, newItemsOpen: this.state.nav.newItemsOpen, flux: flux} ) : ''}
            </div>
        </div>);
    }
});

export default Nav;