import React, {PropTypes} from 'react';
import {NotificationContainer} from "react-notifications";
import {withRouter, Switch} from 'react-router-dom';
import Fluxxor from "fluxxor";
import {connect} from 'react-redux';
import commonNavActions from '../../../../reuse/client/src/components/sideNavs/commonNavActions';
import {toggleFieldSelectMenu} from '../../actions/reportBuilderActions';
import './builderWrapper.scss';
import GlobalActions from '../actions/globalActions';
import RouteWithSubRoutes from "../../scripts/RouteWithSubRoutes";
import TopNav from '../../../../reuse/client/src/components/topNav/topNav';
import * as tabIndexConstants from '../formBuilder/tabindexConstants';
import TableReadyDialog from '../table/tableReadyDialog';
import Locale from '../../locales/locales';
import {CONTEXT} from '../../actions/context';
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
                               startTabIndex={tabIndexConstants.USER_MENU_TAB_INDEX}
                               app={this.getSelectedApp()}/>);
    },

    render() {
        let title = '';
        let onNavClick;
        if (this.props.location.pathname.includes('form')) {
            title = `${Locale.getMessage('builder.formBuilder.modify')}`;
            onNavClick = () => {this.props.toggleNav('builder');};
        } else if (this.props.location.pathname.includes('report')) {
            title = `${Locale.getMessage('builder.reportBuilder.modify')}`;
            onNavClick = () => {this.props.toggleFieldSelectMenu(CONTEXT.REPORT.NAV)};
        }
        return (
            <div className="builderWrapperContent">
                <NotificationContainer/>
                <TopNav
                    title={title}
                    onNavClick={onNavClick}
                    globalActions={this.getTopGlobalActions()}
                    tabIndex={tabIndexConstants.FORM_BUILDER_TOGGLE_NAV_BUTTON_TABINDEX}
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
                <TableReadyDialog/>
            </div>
        );
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        toggleFieldSelectMenu: (context) => {
            dispatch(toggleFieldSelectMenu(context));
        },
        toggleNav() {
            dispatch(commonNavActions('builder').toggleNav())
        }
    };
};

export default withRouter(connect(null, mapDispatchToProps)(BuilderWrapper));
