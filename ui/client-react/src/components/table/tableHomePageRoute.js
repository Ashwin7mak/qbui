import React from 'react';

import Fluxxor from 'fluxxor';
let FluxMixin = Fluxxor.FluxMixin(React);
import Logger from '../../utils/logger';
let logger = new Logger();

let TableHomePageRoute = React.createClass({
    mixins: [FluxMixin],

    selectTableId(tblId) {
        let flux = this.getFlux();
        flux.actions.selectTableId(tblId);
        flux.actions.loadReports(this.props.params.appId, tblId);
    },
    loadReportsFromParams(params, checkParams) {

        let flux = this.getFlux();

        if (params) {
            let appId = params.appId;
            let tblId = params.tblId;

            // VERY IMPORTANT: check URL params against props to prevent cycles

            if (appId === this.props.reportData.appId &&
                tblId === this.props.reportData.tblId) {
                return;
            }

            if (checkParams) {
                if (appId === this.props.params.appId &&
                    tblId === this.props.params.tblId) {
                    return;
                }
            }

            if (appId && tblId) {
                logger.debug('Loading reports. AppId:' + appId + ' ;tblId:' + tblId);

                this.selectTableId(tblId);
            }
        }
    },
    componentDidMount() {
        let flux = this.getFlux();
        flux.actions.setTopTitle();

        this.loadReportsFromParams(this.props.params);
    },
    componentWillReceiveProps: function(props) {
        this.loadReportsFromParams(props.params, true);
    },
    render: function() {

        return (<div>
            <div>Table Homepage goes here... </div>
        </div>);
    }
});

export default TableHomePageRoute;
