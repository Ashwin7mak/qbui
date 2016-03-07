import React from 'react';

import Fluxxor from 'fluxxor';
let FluxMixin = Fluxxor.FluxMixin(React);

import Logger from '../../utils/logger';
let logger = new Logger();

/**
 * placeholder for app dashboard route
 */
let AppHomePageRoute = React.createClass({
    mixins: [FluxMixin],

    selectAppId(appId) {
        let flux = this.getFlux();
        flux.actions.selectAppId(appId);
    },
    selectAppFromParams(params, checkParams) {
        if (params) {
            let appId = params.appId;

            if (this.props.selectedAppId === appId) {
                return;
            }

            if (checkParams) {
                if (this.props.params.appId === appId) {
                    return;
                }
            }

            if (appId) {
                logger.debug('Loading app. AppId:' + appId);
                this.selectAppId(appId);
            }
        }
    },

    componentDidMount() {
        let flux = this.getFlux();
        flux.actions.setTopTitle();
        this.selectAppFromParams(this.props.params);
    },
    // Triggered when properties change
    componentWillReceiveProps: function(props) {
        this.selectAppFromParams(props.params, true);
    },
    render: function() {
        return (<div>
            <div>App Dashboard goes here...</div>
        </div>);
    }
});

export default AppHomePageRoute;
