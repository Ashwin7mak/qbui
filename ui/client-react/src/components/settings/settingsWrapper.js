import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, Switch} from 'react-router-dom';

import * as UrlConsts from "../../constants/urlConstants";
import AppShell from '../../../../reuse/client/src/components/appShell/appShell';
import DefaultTopNavGlobalActions from '../../../../reuse/client/src/components/topNav/defaultTopNavGlobalActions';
import TopNav from '../../../../reuse/client/src/components/topNav/topNav';
import LeftNav from '../../../../reuse/client/src/components/sideNavs/standardLeftNav';

import {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon';
import {I18nMessage} from '../../utils/i18nMessage';
import RouteWithSubRoutes from "../../scripts/RouteWithSubRoutes";

import {toggleLeftNav} from '../../actions/shellActions';
import * as FeatureSwitchActions from '../../actions/featureSwitchActions';
import * as AppActions from '../../actions/appActions';
import {getApp, getSelectedAppId, getSelectedTableId} from '../../reducers/app';

export const SettingsWrapper = React.createClass({

    getSelectedApp() {
        const appId = this.props.selectedAppId;
        return this.props.getApp(appId);
    },

    getSelectedTable(tableId) {
        const app = this.getSelectedApp();
        if (app) {
            const selectedTableId = this.props.selectedTableId;
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
                //TODO: performance improvement to support app argument to load when fetching all apps
                this.props.loadApps();
                this.props.loadApp(paramVals.appId).then(
                    () => {
                        if (paramVals.tblId) {
                            this.props.selectTable(paramVals.appId, paramVals.tblId);
                        }
                    });
            }

            this.props.getFeatureSwitchStates(paramVals.appId);

            if (!paramVals.tblId) {
                /*eslint no-lonely-if:0 */
                if (this.props.selectedTableId !== null) {
                    this.props.clearSelectedTable();
                }
            }
        } else {
            this.props.loadApps();
        }
    },
    componentWillReceiveProps(props) {
        let paramVals = props.match.params;

        /*eslint no-lonely-if:0 */
        if (paramVals.appId) {
            if (this.props.match.params.appId !== paramVals.appId) {
                this.props.getFeatureSwitchStates(paramVals.appId);
            }
        } else {
            if (this.selectedAppId !== null) {
                this.props.clearSelectedApp();
            }
        }

        if (paramVals.tblId) {
            if (this.props.match.params.tblId !== paramVals.tblId) {
                this.props.selectTable(paramVals.appId, paramVals.tblId);
            }
        } else {
            if (this.props.selectedTableId !== null) {
                this.props.clearSelectedApp();
            }
        }
    },
    getBackToAppLink() {
        let selectedAppId = this.props.selectedAppId;
        let link = `${UrlConsts.APP_ROUTE}/${selectedAppId}`;
        let tableId = this.props.selectedTableId;
        if (tableId) {
            link += `/table/${tableId}`;
        }
        return link;
    },

    render() {
        let selectedApp = this.getSelectedApp();
        let selectedTable = this.getSelectedTable();
        let appLink = this.getBackToAppLink();

        return <AppShell functionalAreaName="settings">
            <LeftNav
                isCollapsed={this.props.isNavCollapsed}
                isOpen={this.props.isOpen}
                showContextHeader={true}
                contextHeaderIcon={selectedTable ? selectedTable.tableIcon : null}
                contextHeaderIconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY}
                contextHeaderTitle={selectedTable ? selectedTable.name : ""}
                navItems={[
                {title: <I18nMessage message={"nav.backToApp"}/>, isPrimaryAction: true, secondaryIcon: 'caret-left', link: appLink},
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
    selectedAppId: getSelectedAppId(state.app),
    selectedTableId: getSelectedTableId(state.app),
    getApp: (appId) => getApp(state.app, appId)
});

const mapDispatchToProps = (dispatch) => {
    return {
        toggleNav: () => dispatch(toggleLeftNav()),
        clearSelectedApp: () => dispatch(AppActions.clearSelectedApp()),
        selectTable: (appId, tblId) => dispatch(AppActions.selectAppTable(appId, tblId)),
        clearSelectedTable: () => dispatch(AppActions.clearSelectedAppTable()),
        loadApp: (appId) => dispatch(AppActions.loadApp(appId)),
        loadApps: () => dispatch(AppActions.loadApps()),
        getFeatureSwitchStates: (appId) => dispatch(FeatureSwitchActions.getStates(appId))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SettingsWrapper));
