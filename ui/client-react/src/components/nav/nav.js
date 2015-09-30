import React from 'react';
import ReactIntl from 'react-intl';


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
            reports: flux.store("ReportsStore").getState(),
            reportData: flux.store("ReportDataStore").getState()
        };
    },
    toggleNav: function() {
        this.setState({leftNavOpen: !this.state.leftNavOpen});
    },

    leftNavSelection: function(id) {

        var flux = this.getFlux();

        flux.actions.loadReport(id);
    },
    showTrouser: function() {

        this.setState({trouserOpen: true});
    },
    hideTrouser: function() {

        this.setState({trouserOpen: false});
    },

    render() {
        return (<div className='navShell'>
            <Trouser visible={this.state.trouserOpen} onHide={this.hideTrouser}>

                <Button bsStyle='success' onClick={this.hideTrouser} style={{position:'absolute',bottom:'10px',right:'10px'}}>Done</Button>
            </Trouser>

            <LeftNav visible={this.state.leftNavOpen}
                     items={this.state.reports.list}
                     itemSelection={this.leftNavSelection}/>

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