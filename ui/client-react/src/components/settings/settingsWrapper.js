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
        if (this.state.apps.selectedAppId) {
            return _.find(this.state.apps.apps, (a) => a.id === this.state.apps.selectedAppId);
        }
        return null;
    },
    getSelectedTable(tableId) {
        const app = this.getSelectedApp();
        if (app) {
            return _.find(app.tables, (t) => t.id === this.state.apps.selectedTableId);
        }
    },
    componentDidMount() {
        this.props.flux.actions.loadApps(true);

        if (this.props.match.params.appId) {
            this.props.flux.actions.selectAppId(this.props.match.params.appId);

            this.props.dispatch(FeatureSwitchActions.getStates(this.props.match.params.appId));

            if (this.props.match.params.tblId) {
                this.props.flux.actions.selectTableId(this.props.match.params.tblId);
            } else {
                this.props.flux.actions.selectTableId(null);
            }
        }
    },
    componentWillReceiveProps(props) {
        if (props.match.params.appId) {
            if (this.props.match.params.appId !== props.match.params.appId) {
                this.props.flux.actions.selectAppId(props.match.params.appId);

                this.props.dispatch(FeatureSwitchActions.getStates(props.match.params.appId));
            }
        } else {
            this.props.flux.actions.selectAppId(null);
        }

        if (this.props.match.params.appId !== props.match.params.appId) {
            this.props.flux.actions.selectAppId(props.match.params.appId);
            this.props.dispatch(FeatureSwitchActions.getStates(props.match.params.appId));
        }
        if (props.match.params.tblId) {
            if (this.props.match.params.tblId !== props.match.params.tblId) {
                this.props.flux.actions.selectTableId(props.match.params.tblId);
            }
        } else {
            this.props.flux.actions.selectTableId(null);
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
                isOpen={true}
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
    }
});

SettingsWrapper.propTypes = {
    isNavCollapsed: PropTypes.bool,
    toggleNav: PropTypes.func
};

const mapStateToProps = (state) => ({
    isNavCollapsed: !state.shell.leftNavExpanded
});

const mapDispatchToProps = (dispatch) => {
    return {
        toggleNav: () =>{
            dispatch(toggleLeftNav());
        }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SettingsWrapper));
