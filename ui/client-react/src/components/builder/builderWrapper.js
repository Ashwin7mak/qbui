import React, {PropTypes} from 'react';
import {NotificationContainer} from "react-notifications";
import {withRouter, Switch} from 'react-router-dom';
import {connect} from 'react-redux';
import commonNavActions from '../../../../reuse/client/src/components/sideNavs/commonNavActions';
import GlobalActions from '../actions/globalActions';
import RouteWithSubRoutes from "../../scripts/RouteWithSubRoutes";
import TopNav from '../../../../reuse/client/src/components/topNav/topNav';
import * as tabIndexConstants from '../formBuilder/tabindexConstants';
import TableReadyDialog from '../table/tableReadyDialog';
import Locale from '../../locales/locales';
import {loadApp, loadApps} from '../../actions/appActions';
import {getApp, getApps, getSelectedAppId} from '../../reducers/app';
import _ from 'lodash';

import './builderWrapper.scss';

/**
 * The AppsStore is needed for globalActions (The User and Help Button Located at the top of the screen)
 * The AppsStore selects the appId.
 *
 **/
export const BuilderWrapper = React.createClass({

    getSelectedApp() {
        const selectedAppId = this.props.selectedAppId;
        if (selectedAppId) {
            return this.props.getApp(selectedAppId);
        }
    },

    componentDidMount() {
        //  see if the app is already loaded
        const appId = _.get(this.props, "match.params.appId");
        if (appId) {
            const app = this.props.getApp(appId);
            if (!app) {
                this.props.loadApps();
                this.props.loadApp(appId);
            } else {
                const selectedAppId = this.props.selectedAppId;
                if (selectedAppId !== app.id) {
                    this.props.loadApp(appId);
                }
            }
        }
    },

    getTopGlobalActions() {
        const actions = [];
        const selectedApp = this.getSelectedApp();
        return (<GlobalActions actions={actions}
                               position={"top"}
                               dropdownIcon="user"
                               dropdownMsg="globalActions.user"
                               startTabIndex={tabIndexConstants.USER_MENU_TAB_INDEX}
                               app={selectedApp}/>);
    },

    render() {
        let title = '';
        if (this.props.location.pathname.includes('form')) {
            title = `${Locale.getMessage('builder.formBuilder.modify')}`;
        } else if (this.props.location.pathname.includes('report')) {
            title = `${Locale.getMessage('builder.reportBuilder.modify')}`;
        }

        const app = this.getSelectedApp();
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

const mapStateToProps = (state) => ({
    getApp: (appId) => getApp(state.app, appId),
    getApps: () => getApps(state.app),
    selectedAppId: getSelectedAppId(state.app)
});

const mapDispatchToProps = (dispatch) => {
    return {
        loadApp: (appId) => dispatch(loadApp(appId)),
        loadApps: () => dispatch(loadApps())
    };
};

export default withRouter(connect(mapStateToProps, commonNavActions('builder'))(BuilderWrapper));
