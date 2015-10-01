import React from 'react';
import ReactIntl from 'react-intl';
import Logger from '../../utils/logger';
var logger = new Logger();

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
var i18n = getI18nBundle();

var IntlMixin = ReactIntl.IntlMixin;
var FormattedDate = ReactIntl.FormattedDate;


var CurrentDate = React.createClass({

    mixins: [IntlMixin],

    render: function() {
        return <FormattedDate locales={[Locale]} value={new Date()} day="numeric" month="long" year="numeric"/>
    }
});



var Nav = React.createClass( {
    mixins: [FluxMixin, StoreWatchMixin("ReportsStore","ReportDataStore")],
    getInitialState: function() {
        return {
            leftNavOpen: true,
            trouserOpen: false
        }
    },
    getStateFromFlux: function (){

        var flux = this.getFlux();

        return {
            apps: flux.store("AppsStore").getState(),
            reports: flux.store("ReportsStore").getState(),
            reportData: flux.store("ReportDataStore").getState()
        };
    },
    toggleNav: function() {
        this.setState({leftNavOpen: !this.state.leftNavOpen});
    },


    showTrouser: function() {

        this.setState({trouserOpen: true});
    },
    hideTrouser: function() {

        this.setState({trouserOpen: false});
    },

    // TODO: should the nav component know the details of what is rendering??
    _handleParams: function(params) {

        if (params) {
            var flux = this.getFlux();

            let appId = params.appId;
            let tblId = params.tblId;
            let rptId = params.rptId;

            //  TODO: probably don't want to re-render when report link is clicked
            //  TODO: report url has route defined on node layer...need to re-think this..
            if (appId && tblId) {
                logger.debug('loading navigation reports.  AppId: ' + appId + ';TblId: ' + tblId);
                //flux.actions.loadReports({appId: appId, tblId: tblId});
            }
            if (rptId /*&& appId && tblId*/) {
                logger.debug('loading specfic report. RptId: ' + rptId);
                flux.actions.loadReport(rptId);
            }
        }
    },

    // Triggered when properties change
    componentWillReceiveProps: function(props) {

        this._handleParams(props.params);

    },

    render() {
        return (<div className='navShell'>
            <Trouser visible={this.state.trouserOpen} onHide={this.hideTrouser}>

                <Button bsStyle='success' onClick={this.hideTrouser} style={{position:'absolute',bottom:'10px',right:'10px'}}>Done</Button>
            </Trouser>

            <LeftNav visible={this.state.leftNavOpen}
                     items={this.state.reports.list}/>

            <div className='main'>
                <TopNav onNavClick={this.toggleNav} onAddClicked={this.showTrouser}/>
                <div className='mainContent'>
                    <Stage stageContent="this is the stage content text">
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