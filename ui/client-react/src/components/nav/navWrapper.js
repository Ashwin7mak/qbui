import React from 'react';
import Nav from './nav';
import * as ReportActions from '../../actions/reportActions';
import * as FeatureSwitchActions from '../../actions/featureSwitchActions';
import * as SearchActions from '../../actions/searchActions';
import {CONTEXT} from '../../actions/context';
import Configuration from '../../config/app.config';

const walkMeScript = document.createElement("script");
walkMeScript.src = Configuration.walkmeJSSnippet;

let NavWrapper = React.createClass({

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
            locales: this.state.locales
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

        this.props.flux.actions.loadApps(true);

        if (this.props.params.appId) {
            this.props.flux.actions.selectAppId(this.props.params.appId);

            this.props.dispatch(FeatureSwitchActions.getStates(this.props.params.appId));

            if (this.props.params.tblId) {
                this.props.flux.actions.selectTableId(this.props.params.tblId);
                //this.props.dispatch(ReportActions.loadReports(CONTEXT.REPORT.NAV_LIST, this.props.params.appId, this.props.params.tblId));
            } else {
                this.props.flux.actions.selectTableId(null);
            }
            // TODO: once SELECT_TABLE action is migrated to redux, this clearSearch action
            // should get removed and the search store should listen for the new event to
            // clear out any input.
            //this.props.dispatch(SearchActions.clearSearchInput());
        }
    },
    /**
     * force rerender since breakpoint may have changed
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
    componentWillReceiveProps(props) {
        if (props.params.appId) {
            if (this.props.params.appId !== props.params.appId) {
                this.props.flux.actions.selectAppId(props.params.appId);
                // TODO: once SELECT_TABLE action is migrated to redux, this clearSearch action
                // should get removed and the search store should listen for the new event to
                // clear out any input.
                //this.props.dispatch(SearchActions.clearSearchInput());
                this.props.dispatch(FeatureSwitchActions.getStates(props.params.appId));
            }
        } else {
            this.props.flux.actions.selectAppId(null);
            // TODO: once SELECT_TABLE action is migrated to redux, this clearSearch action
            // should get removed and the search store should listen for the new event to
            // clear out any input.
            //this.props.dispatch(SearchActions.clearSearchInput());
        }

        if (this.props.params.appId !== props.params.appId) {
            this.props.flux.actions.selectAppId(props.params.appId);
            this.props.dispatch(FeatureSwitchActions.getStates(props.params.appId));
        }
        if (props.params.tblId) {
            if (this.props.params.tblId !== props.params.tblId) {
                this.props.flux.actions.selectTableId(props.params.tblId);
                //this.props.dispatch(ReportActions.loadReports(CONTEXT.REPORT.NAV_LIST, props.params.appId, props.params.tblId));
            }
        } else {
            this.props.flux.actions.selectTableId(null);
        }
    }
});

export default NavWrapper;
