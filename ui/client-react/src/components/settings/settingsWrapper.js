import React, {PropTypes, Component} from 'react';
import Fluxxor from "fluxxor";
import {connect} from 'react-redux';
import {withRouter, Switch} from 'react-router-dom';
import * as UrlConsts from "../../constants/urlConstants";
import AppShell from '../../../../reuse/client/src/components/appShell/appShell';
import DefaultTopNavGlobalActions from '../../../../reuse/client/src/components/topNav/defaultTopNavGlobalActions';
import TopNav from '../../../../reuse/client/src/components/topNav/topNav';
import LeftNav from '../../../../reuse/client/src/components/sideNavs/standardLeftNav';
import {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon';
import {toggleLeftNav} from '../../actions/shellActions';
import * as FeatureSwitchActions from '../../actions/featureSwitchActions';
import * as AppActions from '../../actions/appActions';
import {I18nMessage} from '../../utils/i18nMessage';
import RouteWithSubRoutes from "../../scripts/RouteWithSubRoutes";
import {getApp, getSelectedAppId, getSelectedTableId} from '../../reducers/app';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

export const SettingsWrapper = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('AppsStore')],

    getStateFromFlux() {
        let flux = this.getFlux();
        return {
            apps: flux.store('AppsStore').getState()
        };
    },

    getSelectedApp() {
        //return this.getAppFromState(this.state.apps.selectedAppId);
        const appId = this.props.getSelectedAppId();
        return this.props.getApp(appId);
    },

    getSelectedTable(tableId) {
        const app = this.getSelectedApp();
        if (app) {
            const selectedTableId = this.props.getSelectedTableId();
            return _.find(app.tables, (t) => t.id === selectedTableId);
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
    componentDidMount() {
        // listen for resizes (nicely) in case we need to re-render for a new breakpoint
        window.addEventListener('resize', this.handleResize);

        let paramVals = this.props.match.params;
        if (paramVals.appId) {
            // see if the app is already loaded in state
            let app = this.getAppFromState(paramVals.appId);
            if (!app) {
                //this.props.flux.actions.loadApps();
                this.props.loadApps();
                this.props.loadApp(paramVals.appId);
            }

            //  TODO - not sure about removing this...will work in 'normal' workflow, but what about a bookmarked flow
            //this.props.loadApp(paramVals.appId);
            this.props.dispatch(FeatureSwitchActions.getStates(paramVals.appId));

            if (paramVals.tblId) {
                //this.props.flux.actions.selectTableId(paramVals.tblId);
                this.props.selectTable(paramVals.appId, paramVals.tblId);
            } else {
                /*eslint no-lonely-if:0 */
                if (this.props.getSelectedTableId() !== null) {
                    //this.props.flux.actions.selectTableId(null);
                    this.props.clearSelectedTable();
                }
            }
        } else {
            //this.props.flux.actions.loadApps();
            this.props.loadApps();
        }
    },
    componentWillReceiveProps(props) {
        let paramVals = props.match.params;

        /*eslint no-lonely-if:0 */
        if (paramVals.appId) {
            if (this.props.match.params.appId !== paramVals.appId) {
                //  TODO - not sure about removing this...will work in 'normal' workflow, but what about a bookmarked flow
                //this.props.loadApp(paramVals.appId);
                this.props.dispatch(FeatureSwitchActions.getStates(paramVals.appId));
            }
        } else {
            if (this.getSelectedAppId() !== null) {
                this.props.clearSelectedApp();
            }
        }

        if (paramVals.tblId) {
            if (this.props.match.params.tblId !== paramVals.tblId) {
                //this.props.flux.actions.selectTableId(paramVals.tblId);
                this.props.selectTable(paramVals.appId, paramVals.tblId);
            }
        } else {
            if (this.props.getSelectedTableId() !== null) {
                //this.props.flux.actions.selectTableId(null);
                this.props.clearSelectedApp();
            }
        }
    },
    getBackToAppLink() {
        let selectedAppId = this.props.getSelectedAppId();
        let link = `${UrlConsts.APP_ROUTE}/${selectedAppId}`;
        let tableId = this.props.getSelectedTableId();
        if (tableId) {
            link += `/table/${tableId}`;
        }
        return link;
    },

    render() {
        let selectedApp = this.getSelectedApp();
        let selectedTable = this.getSelectedTable();

        return <AppShell functionalAreaName="settings">
            <LeftNav
                isCollapsed={this.props.isNavCollapsed}
                isOpen={this.props.isOpen}
                showContextHeader={true}
                contextHeaderIcon={selectedTable ? selectedTable.tableIcon : null}
                contextHeaderIconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY}
                contextHeaderTitle={selectedTable ? selectedTable.name : ""}
                navItems={[
                {title: <I18nMessage message={"nav.backToApp"}/>, isPrimaryAction: true, secondaryIcon: 'caret-left', link: this.getBackToAppLink()},
                ]}
            >
                <TopNav onNavClick={this.props.toggleNav}/>
                {this.props.routes ? (
                    <Switch>
                        {
                            this.props.routes.map((route, i) => {
                                let routeProps = {
                                    app: selectedApp,
                                    table: selectedTable
                                };
                                return RouteWithSubRoutes(route, i, routeProps);
                            })
                        }
                    </Switch>) : null
                }
            </LeftNav>
        </AppShell>;
    },

    getAppFromState(appId) {
        return this.props.getApp(appId);
        //if (appId && _.has(this.state.apps, 'apps')) {
        //    return _.find(this.state.apps.apps, (a) => a.id === appId);
        //}
        //return null;
    }
});

SettingsWrapper.propTypes = {
    isNavCollapsed: PropTypes.bool,
    isOpen: PropTypes.bool,
    toggleNav: PropTypes.func
};

const mapStateToProps = (state) => ({
    isNavCollapsed: !state.shell.leftNavExpanded,
    isOpen: state.shell.leftNavVisible,
    getApp: (appId) => getApp(state.app, appId),
    getSelectedAppId: () => getSelectedAppId(state.app),
    getSelectedTableId: () => getSelectedTableId(state.app)
});

const mapDispatchToProps = (dispatch) => {
    return {
        toggleNav: () => dispatch(toggleLeftNav()),
        clearSelectedApp: () => dispatch(AppActions.clearSelectedApp()),
        selectTable: (appId, tableId) => dispatch(AppActions.selectAppTable(appId, tableId)),
        clearSelectedTable: () => dispatch(AppActions.clearSelectedAppTable()),
        loadApp: (appId) => dispatch(AppActions.loadApp(appId)),
        loadApps: () => dispatch(AppActions.loadApps())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SettingsWrapper));
