import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import { render } from 'react-dom'
import './nav.scss';
import Loader  from 'react-loader';
import Button from 'react-bootstrap/lib/Button';

import TopNav from './topNav';
import Trouser from '../trouser/trouser';

import Logger from '../../utils/logger';
let logger = new Logger();

import Fluxxor from 'fluxxor';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Nav = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('NavStore','AppsStore','ReportsStore','ReportDataStore')],

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

        const { pathname } = this.props.location
        const key = pathname.split('/')[1] || 'root'

        const { main, leftNav, footer } = this.props.children;

        let mobileNavOpen = this.props.mobile && this.state.nav.mobileLeftNavOpen;
        let navOpen = mobileNavOpen || this.state.nav.leftNavOpen;

        return (<div className={mobileNavOpen ? 'navShell mobileNavOpen' : 'navShell'}>
            <Trouser visible={this.state.nav.trouserOpen} onHide={this.hideTrouserExample}>
                <Button bsStyle='success' onClick={this.hideTrouserExample} style={{position:'absolute',bottom:'10px',right:'10px'}}>Done</Button>
            </Trouser>

            {/* insert the leftNav component passed in by the router */}
            {React.cloneElement(leftNav,{...this.state.nav.i18n, items:this.state.nav.leftNavItems, open: navOpen, reportsData: this.state.reportsData, reportID: this.state.reportData.rptId, flux: flux} )}

            <div className='main'>
                <TopNav {...this.state.nav.i18n} title='QuickBase' mobile={this.props.mobile} showActionIcons={!this.props.mobile} onNavClick={this.toggleNav} onAddClicked={this.showTrouser}/>
                <div className='mainContent'>
                    {/* insert the main component passed in by the router */}
                    {React.cloneElement(main, {...this.state.nav.i18n, key: key, reportData: this.state.reportData, mobile: this.props.mobile,  flux: flux} )}
                </div>
                {/* insert the footer if route wants it */}
                {footer ? React.cloneElement(footer, {...this.state.nav.i18n, flux: flux} ) : ''}
            </div>
        </div>);
    }
});

export default Nav;