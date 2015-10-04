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
import { Locale, getI18nBundle } from '../../locales/locales';
let i18n = getI18nBundle();

var Nav = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('NavStore','AppsStore','ReportsStore','ReportDataStore')],

    getStateFromFlux: function() {
        let flux = this.getFlux();
        return {
            nav: flux.store('NavStore').getState(),
            apps: flux.store('AppsStore').getState(),
            reports: flux.store('ReportsStore').getState(),
            reportData: flux.store('ReportDataStore').getState()
        };
    },

    // Triggered when properties change
    componentWillReceiveProps: function(props) {
        if (props) {
            if (props.params) {
                let appId = props.params.appId;
                let tblId = props.params.tblId;
                let rptId = props.params.rptId;
                if (appId && tblId && rptId) {
                    logger.debug('Loading report. AppId:' + appId + ' ;tblId:' + tblId + ' ;rptId:' + rptId);
                    let flux = this.getFlux();
                    flux.actions.loadReport({appId: appId, tblId: tblId, rptId: rptId});
                }
            }
        }
    },

    hideTrouserExample: function() {
        logger.debug('hiding trowser from Nav shell');
        let flux = this.getFlux();
        flux.actions.hideTrouser();
    },

    render: function() {

        return (<div className='navShell'>
            <Trouser visible={this.state.nav.trouserOpen} onHide={this.hideTrouserExample}>
                <Button bsStyle='success' onClick={this.hideTrouserExample} style={{position:'absolute',bottom:'10px',right:'10px'}}>Done</Button>
            </Trouser>

            <LeftNav {...i18n} open={this.state.nav.leftNavOpen}
                     items={this.state.nav.leftNavItems}
                     reports={this.state.reports.list}/>

            <div className='main'>
                <TopNav {...i18n} onNavClick={this.toggleNav} onAddClicked={this.showTrouser}/>
                <div className='mainContent'>
                    <Stage stageContent='this is the stage content text'>
                        <ReportStage {...i18n} />
                    </Stage>
                    <ReportContent {...i18n} data={this.state.reportData.data}/>
                </div>
                <Footer {...i18n} />
            </div>
        </div>);
    }
});

export default Nav;