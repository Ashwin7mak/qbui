import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import Nav from './nav';
import * as ReportActions from '../../actions/reportActions';
import * as FeatureSwitchActions from '../../actions/featureSwitchActions';
import * as AppActions from '../../actions/appActions';
import * as SearchActions from '../../actions/searchActions';
import {CONTEXT} from '../../actions/context';
import Configuration from '../../config/app.config';

import {getApp, getSelectedAppId, getSelectedTableId} from '../../reducers/app';

const walkMeScript = document.createElement("script");
walkMeScript.src = Configuration.walkmeJSSnippet;

export const NavWrapper = React.createClass({

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
            locales: this.props.locales
        };
    },
    render() {
        return <Nav {...this.props}/>;
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
                this.props.loadApps();
            }

            this.props.loadApp(paramVals.appId);

            this.props.getFeatureSwitchStates(paramVals.appId);

            if (paramVals.tblId && !this.isUsersRoute(this.props.match.url)) {
                this.props.selectTable(paramVals.appId, paramVals.tblId);
                this.props.loadReports(CONTEXT.REPORT.NAV_LIST, paramVals.appId, paramVals.tblId);
            } else {
                if (this.props.selectedTableId !== null) {
                    this.props.clearSelectedTable();
                }
            }
        } else {
            this.props.loadApps();
        }
    },

    /**
     * Is this a 'users' route..
     *
     * @returns {boolean}
     */
    isUsersRoute(url) {
        const REGEX_USERS_ROUTE = /^\/qbase\/app\/.*\/users$/i;
        return REGEX_USERS_ROUTE.test(url);
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
                this.props.loadApp(incomingProps.match.params.appId);
                this.props.getFeatureSwitchStates(incomingProps.match.params.appId);
            }
        } else {
            if (this.props.selectedAppId !== null) {
                this.props.clearSelectedApp();
            }
        }

        if (incomingProps.match.params.tblId) {
            if ((this.props.match.params.tblId !== incomingProps.match.params.tblId) && !this.isUsersRoute(incomingProps.match.url)) {
                const appId = incomingProps.match.params.appId || this.props.match.params.appId;
                this.props.selectTable(appId, incomingProps.match.params.tblId);
                this.props.loadReports(CONTEXT.REPORT.NAV_LIST, appId, incomingProps.match.params.tblId);
            }
        } else {
            if (this.props.selectedTableId !== null) {
                this.props.clearSelectedTable();
            }
        }
    },

    getAppFromState(appId) {
        return this.props.getApp(appId);
    }
});

const mapStateToProps = (state) => ({
    locales: state.shell.locales,
    selectedAppId: getSelectedAppId(state.app),
    selectedTableId: getSelectedTableId(state.app),
    getApp: (appId) => getApp(state.app, appId)
});

const mapDispatchToProps = (dispatch) => {
    return {
        clearSelectedApp: () => dispatch(AppActions.clearSelectedApp()),
        loadApp: (appId) => dispatch(AppActions.loadApp(appId)),
        loadApps: () => dispatch(AppActions.loadApps()),
        clearSelectedTable: () => dispatch(AppActions.clearSelectedAppTable()),
        selectTable: (appId, tableId) => dispatch(AppActions.selectAppTable(appId, tableId)),
        getFeatureSwitchStates: (appId) => dispatch(FeatureSwitchActions.getStates(appId)),
        loadReports: (context, appId, tblId) => dispatch(ReportActions.loadReports(context, appId, tblId))
    };
};

//export default connect(mapStateToProps, mapDispatchToProps)(NavWrapper);
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(NavWrapper));



