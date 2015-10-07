import React from 'react';

import Logger from '../../utils/logger';
let logger = new Logger();

import './nav.scss';

import Button from 'react-bootstrap/lib/Button';

import TopNav from './topNav';
import LeftNav from './leftNav';
import Trouser from '../trouser/trouser';
import Header from '../header/header';
import Stage from '../stage/stage';
import Footer from '../footer/footer';

import ReportStage from '../report/dataTable/stage';
import ReportContent from '../report/dataTable/content';

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
        logger.debug('hiding trowser from Nav shell');
        let flux = this.getFlux();
        flux.actions.hideTrouser();
    },

    render: function() {
        let flux = this.getFlux();

        return (<div className='navShell'>
            <Trouser visible={this.state.nav.trouserOpen} onHide={this.hideTrouserExample}>
                <Button bsStyle='success' onClick={this.hideTrouserExample} style={{position:'absolute',bottom:'10px',right:'10px'}}>Done</Button>
            </Trouser>

            <LeftNav {...i18n} open={this.state.nav.leftNavOpen}
                     items={this.state.nav.leftNavItems}
                     reportsData={this.state.reportsData}/>

            <div className='main'>
                <TopNav {...i18n} onNavClick={this.toggleNav} onAddClicked={this.showTrouser}/>
                <div className='mainContent'>
                    {React.cloneElement(this.props.children, {reportData: this.state.reportData, flux: flux} )}
                </div>
                <Footer {...i18n} />
            </div>
        </div>);
    }
});

export default Nav;