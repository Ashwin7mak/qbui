import React from 'react';
import TransitionGroup from 'react/lib/ReactCSSTransitionGroup';

import './nav.scss';

import Button from 'react-bootstrap/lib/Button';

import TopNav from './topNav';
import Trouser from '../trouser/trouser';
import Footer from '../footer/footer';

import Logger from '../../utils/logger';
let logger = new Logger();

import Fluxxor from 'fluxxor';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

//  load the locale
import Locale from '../../locales/locales';
let i18n = Locale.getI18nBundle();

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
        logger.debug('hiding trouser from Nav shell');
        let flux = this.getFlux();
        flux.actions.hideTrouser();
    },

    render: function() {

        let flux = this.getFlux();

        const { main, leftNav } = this.props.children;

        return (<div className='navShell'>
            <Trouser visible={this.state.nav.trouserOpen} onHide={this.hideTrouserExample}>
                <Button bsStyle='success' onClick={this.hideTrouserExample} style={{position:'absolute',bottom:'10px',right:'10px'}}>Done</Button>
            </Trouser>

            {/* insert the leftNav component passed in by the router */}
            {React.cloneElement(leftNav,{...i18n, items:this.state.nav.leftNavItems, open: this.state.nav.leftNavOpen, reportsData: this.state.reportsData, flux: flux} )}

            <div className='main'>
                <TopNav {...i18n} title='QuickBase' mobile={this.props.mobile} showActionIcons={!this.props.mobile} onNavClick={this.toggleNav} onAddClicked={this.showTrouser}/>
                <div className='mainContent'>
                    <TransitionGroup transitionName="example" transitionEnterTimeout={1500} transitionLeaveTimeout={1300}>
                    {/* insert the main component passed in by the router */}
                        {React.cloneElement(main, {key: this.state.reportData.name, reportData: this.state.reportData, mobile: this.props.mobile,  flux: flux} )}
                    </TransitionGroup>
                </div>
                <Footer {...i18n} />
            </div>
        </div>);
    }
});

export default Nav;