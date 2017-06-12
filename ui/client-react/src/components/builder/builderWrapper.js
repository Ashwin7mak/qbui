import React, {PropTypes} from 'react';
import {NotificationContainer} from "react-notifications";
import {withRouter, Switch} from 'react-router-dom';
import Fluxxor from "fluxxor";
import {connect} from 'react-redux';
import commonNavActions from '../../../../reuse/client/src/components/sideNavs/commonNavActions';
import './builderWrapper.scss';
import GlobalActions from '../actions/globalActions';
import RouteWithSubRoutes from "../../scripts/RouteWithSubRoutes";
import TopNav from '../../../../reuse/client/src/components/topNav/topNav';
import * as tabIndexConstants from '../formBuilder/tabindexConstants';
import TableReadyDialog from '../table/tableReadyDialog';
import Locale from '../../locales/locales';
import _ from 'lodash';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;


/**
 * The AppsStore is needed for globalActions (The User and Help Button Located at the top of the screen)
 * The AppsStore selects the appId.
 * */
export const BuilderWrapper = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('AppsStore')],

    getStateFromFlux() {
        let flux = this.getFlux();
        return {
            apps: flux.store('AppsStore').getState()
        };
    },

    componentDidMount() {
        let flux = this.getFlux();

        if (!this.state.apps.apps) {
            const appId = _.get(this.props, "match.params.appId");
            flux.actions.selectAppId(appId);
        }
    },

    getCurrentApp() {
        const appId = _.get(this.props, "match.params.appId");
        if (appId) {
            return _.find(this.state.apps.apps, (a) => a.id === appId);
        }
        return null;
    },

    getTopGlobalActions() {
        const actions = [];
        return (<GlobalActions actions={actions}
                               position={"top"}
                               dropdownIcon="user"
                               dropdownMsg="globalActions.user"
                               startTabIndex={tabIndexConstants.USER_MENU_TAB_INDEX}
                               app={this.getCurrentApp()}/>);
    },

    render() {
        let title = '';
        if (this.props.location.pathname.includes('form')) {
            title = `${Locale.getMessage('builder.formBuilder.modify')}`;
        } else if (this.props.location.pathname.includes('report')) {
            title = `${Locale.getMessage('builder.reportBuilder.modify')}`;
        } else if (this.props.location.pathname.includes('automation')) {
            title = `${Locale.getMessage('builder.automationBuilder.modify')}`;
        }

        const app = this.getCurrentApp();
        return (
            <div className="builderWrapperContent">
                <NotificationContainer/>
                <TopNav
                    title={title}
                    onNavClick={this.props.toggleNav}
                    globalActions={this.getTopGlobalActions()}
                    tabIndex={tabIndexConstants.FORM_BUILDER_TOGGLE_NAV_BUTTON_TABINDEX}
                />

                <div className="builderWrapperBody">
                    {this.props.routes &&
                        <Switch>
                            {
                                this.props.routes.map((route, i) => {
                                    return RouteWithSubRoutes(route, i, {app});
                                })
                            }
                        </Switch>
                    }
                </div>
                <TableReadyDialog/>
            </div>
        );
    }
});

export default withRouter(connect(null, commonNavActions('builder'))(BuilderWrapper));
