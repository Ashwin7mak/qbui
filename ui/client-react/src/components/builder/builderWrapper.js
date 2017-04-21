import React, {PropTypes} from 'react';
import {NotificationContainer} from "react-notifications";
import {withRouter, Switch} from 'react-router-dom';
import FormBuilderContainer from './formBuilderContainer';
import Fluxxor from "fluxxor";
import {connect} from 'react-redux';
import commonNavActions from '../../../../reuse/client/src/components/sideNavs/commonNavActions';
import './builderWrapper.scss';
import GlobalActions from '../actions/globalActions';
import RouteWithSubRoutes from "../../scripts/RouteWithSubRoutes";
import TopNav from '../../../../reuse/client/src/components/topNav/topNav';

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

    getSelectedApp() {
        if (this.state.apps.selectedAppId) {
            return _.find(this.state.apps.apps, (a) => a.id === this.state.apps.selectedAppId);
        }
        return null;
    },

    getTopGlobalActions() {
        const actions = [];
        return (<GlobalActions actions={actions}
                               position={"top"}
                               dropdownIcon="user"
                               dropdownMsg="globalActions.user"
                               startTabIndex={4}
                               app={this.getSelectedApp()}/>);
    },

    render() {
        return (
            <div className="builderWrapperContent">
                <NotificationContainer/>
                <TopNav
                    onNavClick={this.props.toggleNav}
                    globalActions={this.getTopGlobalActions()}
                />

                <div className="builderWrapperBody">
                    {this.props.routes &&
                        <Switch>
                            {
                                this.props.routes.map((route, i) => {
                                    return RouteWithSubRoutes(route, i);
                                })
                            }
                        </Switch>
                    }
                </div>

            </div>
        );
    }
});

export default withRouter(connect(null, commonNavActions('builder'))(BuilderWrapper));
