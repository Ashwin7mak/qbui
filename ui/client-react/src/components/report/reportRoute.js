import React from 'react';
import ReactIntl from 'react-intl';
import ReactBootstrap from 'react-bootstrap';
import { Locale, getI18nBundle } from '../../locales/locales';
import Stage from '../stage/stage';
import ReportStage from './dataTable/stage';
import Logger from '../../utils/logger';
let logger = new Logger();
import ReportContent from './dataTable/content';
import Fluxxor from 'fluxxor';

let FluxMixin = Fluxxor.FluxMixin(React);
var i18n = getI18nBundle();

var ReportRoute = React.createClass( {
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
                flux.actions.loadReport(appId, tblId, rptId);
            }
        }
    },

    render: function() {

        return (<div>
                <Stage stageContent='this is the stage content text'>
                    <ReportStage {...i18n} />
                </Stage>
                <ReportContent {...i18n} reportData={this.props.reportData}/>
                </div>);
    }
});

export default ReportRoute;