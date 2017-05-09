import React from 'react';
import Nav from './nav';
import * as ReportActions from '../../actions/reportActions';
import * as FeatureSwitchActions from '../../actions/featureSwitchActions';
import * as SearchActions from '../../actions/searchActions';
import {CONTEXT} from '../../actions/context';
import Configuration from '../../config/app.config';

const walkMeScript = document.createElement("script");
walkMeScript.src = Configuration.walkmeJSSnippet;

import Fluxxor from "fluxxor";
let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

let NavWrapper = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('AppsStore')],

    getStateFromFlux() {
        let flux = this.getFlux();
        return {
            apps: flux.store('AppsStore').getState()
        };
    },

    /* touch detection */
    isTouchDevice() {
        return "ontouchstart" in window;
    },
    getInitialState() {
        return {
            touch: this.isTouchDevice()
        };
    },
    childContextTypes: {
        touch: React.PropTypes.bool,
        locales: React.PropTypes.string
    },
    getChildContext() {
        return {
            touch: this.state.touch,
            locales: this.props.qbui.shell.locales
        };
    },
    render() {
        return <Nav {...this.props} />;
    },

    componentDidMount() {
        /*eslint no-lonely-if:0 */
        if (!this.isTouchDevice()) {
            document.body.appendChild(walkMeScript);
        }
        // listen for resizes (nicely) in case we need to re-render for a new breakpoint
        window.addEventListener('resize', this.handleResize);

        if (this.isTouchDevice()) {
            document.body.className = "touch";
        }

        let paramVals = this.props.match.params;
        if (paramVals.appId) {
            // see if the app is already loaded in state
            let app = this.getAppFromState(paramVals.appId);
            if (!app) {
                this.props.flux.actions.loadApps();
            }

            this.props.flux.actions.selectAppId(paramVals.appId);

            this.props.dispatch(FeatureSwitchActions.getStates(paramVals.appId));

            if (paramVals.tblId) {
                this.props.flux.actions.selectTableId(paramVals.tblId);
                this.props.dispatch(ReportActions.loadReports(CONTEXT.REPORT.NAV_LIST, paramVals.appId, paramVals.tblId));
            } else {
                if (this.state.apps.selectedTableId !== null) {
                    this.props.flux.actions.selectTableId(null);
                }
            }
        } else {
            this.props.flux.actions.loadApps();
        }
    },
    /**
     * force re-render since breakpoint may have changed
     */
    handleResize() {
        this.setState(this.state);
    },

    /**
     * clean up listener
     */
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },
    componentWillReceiveProps(incomingProps) {
        /*eslint no-lonely-if:0 */
        if (incomingProps.match.params.appId) {
            if (this.props.match.params.appId !== incomingProps.match.params.appId) {
                this.props.flux.actions.selectAppId(incomingProps.match.params.appId);
                this.props.dispatch(FeatureSwitchActions.getStates(incomingProps.match.params.appId));
            }
        } else {
            if (this.state.apps.selectedAppId !== null) {
                this.props.flux.actions.selectAppId(null);
            }
        }

        if (incomingProps.match.params.tblId) {
            if (this.props.match.params.tblId !== incomingProps.match.params.tblId) {
                this.props.flux.actions.selectTableId(incomingProps.match.params.tblId);
                this.props.dispatch(ReportActions.loadReports(CONTEXT.REPORT.NAV_LIST, incomingProps.match.params.appId, incomingProps.match.params.tblId));
            }
        } else {
            if (this.state.apps.selectedTableId !== null) {
                this.props.flux.actions.selectTableId(null);
            }
        }
    },

    getAppFromState(appId) {
        if (appId && _.has(this.state.apps, 'apps')) {
            return _.find(this.state.apps.apps, (a) => a.id === appId);
        }
        return null;
    }
});

export default NavWrapper;
