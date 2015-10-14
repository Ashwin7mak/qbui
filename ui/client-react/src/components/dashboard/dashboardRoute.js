import React from 'react';
import ReactIntl from 'react-intl';
import ReactBootstrap from 'react-bootstrap';
import { Locale, getI18nBundle } from '../../locales/locales';
import './dashboard.scss';

import Logger from '../../utils/logger';
let logger = new Logger();
import ReportContent from '../report/dataTable/content';
import Fluxxor from 'fluxxor';

let FluxMixin = Fluxxor.FluxMixin(React);
var i18n = getI18nBundle();

var DashboardRoute = React.createClass( {
    mixins: [FluxMixin],

    // Triggered when properties change
    componentWillReceiveProps: function(props) {

        if (props.params) {
            let appId = props.params.appId;
            let tblId = props.params.tblId;
            let rptId = props.params.rptId;

            // VERY IMPORTANT: check URL params against props to prevent cycles
            if (appId == this.props.reportData.appId &&
                tblId == this.props.reportData.tblId &&
                rptId == this.props.reportData.rptId)
                return;

            if (appId && tblId && rptId) {
                logger.debug('Loading report. AppId:' + appId + ' ;tblId:' + tblId + ' ;rptId:' + rptId);
                let flux = this.getFlux();
                flux.actions.loadReport(appId, tblId, rptId, true);
            }
        }
    },

    // DEMO CODE TO EXPLORE NESTED TABLES etc.
    render: function() {

        return (<div className='dashboard'>

                <div className='dashboardRow'>
                    <div className='narrow'>
                        <ReportContent className='narrow' {...i18n} reportData={this.props.reportData} mobile={this.props.mobile}/>
                    </div>
                    <div className='wide'>
                        <ReportContent className='narrow' {...i18n} reportData={this.props.reportData} mobile={this.props.mobile}/>
                    </div>
                </div>
                <div className='dashboardRow'>
                    <div className='narrow'>
                        <ReportContent {...i18n}  reportData={this.props.reportData} mobile={this.props.mobile}/>
                    </div>
                    <div className='wide'>
                        <ReportContent {...i18n}  reportData={this.props.reportData} mobile={this.props.mobile}/>
                    </div>
                </div>

            </div>);
    }
});

export default DashboardRoute;