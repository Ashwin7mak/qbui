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
            // see if the app is already loaded in state.  If not, we could be
            // accessing the app directly from a url, so go fetch
            let loadApps = true;
            if (_.has(this.state.apps, 'apps')) {
                let app = _.find(this.state.apps.apps, (a) => a.id === paramVals.appId);
                if (app) {
                    loadApps = false;
                }
            }
            if (loadApps) {
                this.props.flux.actions.loadApps();
            }

            //const isAppTablesHydrated = this.isAppTablesHydrated(paramVals.appId);
            this.props.flux.actions.selectAppId(paramVals.appId);

            this.props.dispatch(FeatureSwitchActions.getStates(paramVals.appId));

            if (paramVals.tblId) {
                this.props.flux.actions.selectTableId(paramVals.tblId);
                this.props.dispatch(ReportActions.loadReports(CONTEXT.REPORT.NAV_LIST, paramVals.appId, paramVals.tblId));
            } else {
                //this.props.flux.actions.selectTableId(null);
            }
            // TODO: once the above SELECT_TABLE action is migrated to redux, the search store should
            // TODO: listen for the new event to clear out any input.
            //this.props.dispatch(SearchActions.clearSearchInput());
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
        if (incomingProps.match.params.appId) {
            if (this.props.match.params.appId !== incomingProps.match.params.appId) {
                //const isAppTablesHydrated = this.isAppTablesHydrated(incomingProps.match.params.appId);
                this.props.flux.actions.selectAppId(incomingProps.match.params.appId);

                // TODO: once the above SELECT_TABLE action is migrated to redux, the search store should
                // TODO: listen for the new event to clear out any input.
                //this.incomingProps.dispatch(SearchActions.clearSearchInput());
                this.props.dispatch(FeatureSwitchActions.getStates(incomingProps.match.params.appId));
            }
        } else {
            this.props.flux.actions.selectAppId(null);
            // TODO: once the above SELECT_TABLE action is migrated to redux, the search store should
            // TODO: listen for the new event to clear out any input.
            //this.incomingProps.dispatch(SearchActions.clearSearchInput());
        }

        if (this.props.match.params.appId !== incomingProps.match.params.appId) {
            //const isAppTablesHydrated = this.isAppTablesHydrated(incomingProps.match.params.appId);
            this.props.flux.actions.selectAppId(incomingProps.match.params.appId);
            this.props.dispatch(FeatureSwitchActions.getStates(incomingProps.match.params.appId));
        }
        if (incomingProps.match.params.tblId) {
            if (this.props.match.params.tblId !== incomingProps.match.params.tblId) {
                //const isAppTablesHydrated = this.isAppTablesHydrated(incomingProps.match.params.tblId);
                this.props.flux.actions.selectTableId(incomingProps.match.params.tblId);
                this.props.dispatch(ReportActions.loadReports(CONTEXT.REPORT.NAV_LIST, incomingProps.match.params.appId, incomingProps.match.params.tblId));
            }
        } else {
            this.props.flux.actions.selectTableId(null);
        }
    },

    //isAppTablesHydrated(appId) {
    //    if (_.has(this.state.apps, 'apps')) {
    //        let app = _.find(this.state.apps.apps, (a) => a.id === appId);
    //        if (_.has(app, 'tables')) {
    //            if (app.tables.length > 0) {
    //                return app.tables[0].hasOwnProperty('name');
    //            }
    //        }
    //    }
    //    return true;
    //}
});

export default NavWrapper;
