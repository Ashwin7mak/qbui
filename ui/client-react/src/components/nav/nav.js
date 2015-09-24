import React from 'react';
import ReactIntl from 'react-intl';

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
    mixins: [FluxMixin, StoreWatchMixin("ReportsStore")],
    getInitialState: function() {
        return {
            leftNavOpen: false,
            trouserOpen: false
        }
    },
    getStateFromFlux: function (){

        var flux = this.getFlux();
        // Our entire state is made up of the ReportsStore data. In a larger
        // application, you will likely return data from multiple stores, e.g.:
        //
        //   return {
        //     reportsData: flux.store("ReportsStore").getState(),
        //     userData: flux.store("UserStore").getData(),
        //     fooBarData: flux.store("FooBarStore").someMoreData()
        //   };

        return flux.store("ReportsStore").getState();
    },
    showNav: function() {
        this.setState({leftNavOpen: true});
    },
    hideNav: function() {
        this.setState({leftNavOpen: false});
    },
    leftNavSelection: function(id) {
        this.hideNav();

        var flux = this.getFlux();

        flux.actions.loadReport(id);
    },
    showTrouser: function() {
        console.log('show it')
        this.setState({trouserOpen: true});
    },
    hideTrouser: function() {
        console.log('hide it')
        this.setState({trouserOpen: false});
    },

    render() {
        return (<div>
            <Trouser visible={this.state.trouserOpen} onHide={this.hideTrouser}>

                <Button bsStyle='success' onClick={this.hideTrouser} style={{position:'absolute',bottom:'10px',right:'10px'}}>Done</Button>
            </Trouser>

            <LeftNav visible={this.state.leftNavOpen}
                     items={this.state.reports}
                     itemSelection={this.leftNavSelection}/>

            <TopNav onNavClick={this.showNav} onAddClicked={this.showTrouser}/>

            <Stage stageContent="this is the stage content text">
                <ReportStage {...i18n} />
            </Stage>
            <ReportContent {...i18n}/>
            <Footer {...i18n} />

        </div>);
    }
});

export default Nav;