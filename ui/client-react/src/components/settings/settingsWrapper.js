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
import {I18nMessage} from '../../utils/i18nMessage';
import RouteWithSubRoutes from "../../scripts/RouteWithSubRoutes";

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
        return this.getAppFromState(this.state.apps.selectedAppId);
    },

    getSelectedTable(tableId) {
        const app = this.getSelectedApp();
        if (app) {
            return _.find(app.tables, (t) => t.id === this.state.apps.selectedTableId);
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
                this.props.flux.actions.loadApps();
            }

            this.props.flux.actions.selectAppId(paramVals.appId);
            this.props.dispatch(FeatureSwitchActions.getStates(paramVals.appId));

            if (paramVals.tblId) {
                this.props.flux.actions.selectTableId(paramVals.tblId);
            } else {
                /*eslint no-lonely-if:0 */
                if (this.state.apps.selectedTableId !== null) {
                    this.props.flux.actions.selectTableId(null);
                }
            }
        } else {
            this.props.flux.actions.loadApps();
        }
    },
    componentWillReceiveProps(props) {
        let paramVals = props.match.params;

        /*eslint no-lonely-if:0 */
        if (paramVals.appId) {
            if (this.props.match.params.appId !== paramVals.appId) {
                this.props.flux.actions.selectAppId(paramVals.appId);
                this.props.dispatch(FeatureSwitchActions.getStates(paramVals.appId));
            }
        } else {
            if (this.state.apps.selectedAppId !== null) {
                this.props.flux.actions.selectAppId(null);
            }
        }

        if (paramVals.tblId) {
            if (this.props.match.params.tblId !== paramVals.tblId) {
                this.props.flux.actions.selectTableId(paramVals.tblId);
            }
        } else {
            if (this.state.apps.selectedTableId !== null) {
                this.props.flux.actions.selectTableId(null);
            }
        }
    },
    getBackToAppLink() {
        let link = `${UrlConsts.APP_ROUTE}/${this.state.apps.selectedAppId}`;
        if (this.state.apps.selectedTableId) {
            link += `/table/${this.state.apps.selectedTableId}`;
        }
        return link;
    },

    render() {
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
                                    app: this.getSelectedApp(),
                                    table: this.getSelectedTable()
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
        if (appId && _.has(this.state.apps, 'apps')) {
            return _.find(this.state.apps.apps, (a) => a.id === appId);
        }
        return null;
    }
});

SettingsWrapper.propTypes = {
    isNavCollapsed: PropTypes.bool,
    isOpen: PropTypes.bool,
    toggleNav: PropTypes.func
};

const mapStateToProps = (state) => ({
    isNavCollapsed: !state.shell.leftNavExpanded,
    isOpen: state.shell.leftNavVisible
});

const mapDispatchToProps = (dispatch) => {
    return {
        toggleNav: () =>{
            dispatch(toggleLeftNav());
        }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SettingsWrapper));
