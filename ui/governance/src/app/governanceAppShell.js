import React, {PropTypes, Component} from "react";
import {connect} from "react-redux";
import {toggleNav} from "../../../reuse/client/src/components/sideNavs/commonNavActions";
import AppShell from "../../../reuse/client/src/components/appShell/appShell";
import DefaultTopNavGlobalActions from "../../../reuse/client/src/components/topNav/defaultTopNavGlobalActions";
import TopNav from "../../../reuse/client/src/components/topNav/topNav";
import LeftNav from "../common/leftNav/GovernanceLeftNav";
import {Switch} from "react-router-dom";
import RouteWithSubRoutes from "../../../client-react/src/scripts/RouteWithSubRoutes";
import Analytics from "../../../reuse/client/src/components/analytics/analytics";
import Config from "../../../client-react/src/config/app.config";
import _ from 'lodash';
import {getTotalPaidUsers, getTotalDeniedUsers, getTotalDeactivatedUsers, getTotalRealmUsers} from "../../src/account/users/AccountUsersReducer";

import "./governanceAppShell.scss";

export class GovernanceAppShell extends Component {
    render() {
        return (
            <AppShell functionalAreaName="governance">
                <Analytics dataset={Config.evergageDataset} userId={this.props.currentUserId}/>

                <LeftNav
                    isNavCollapsed={this.props.isNavCollapsed}
                    isNavOpen={this.props.isNavOpen}
                    accountId={Number.parseInt(this.props.match.params.accountId)}
                >
                    <TopNav onNavClick={this.props.toggleNav} hasNavItem={false} globalActions={
                        <DefaultTopNavGlobalActions
                            startTabIndex={4}
                            dropdownIcon="user"
                            dropdownMsg="globalActions.user"
                            hasFeedback={false}
                        />
                    }/>
                    <Switch>
                        {this.props.routes !== undefined ? this.props.routes.map((route, i) => {
                            return (
                                <RouteWithSubRoutes key={i} {...route} />
                            );
                        }) : ''}
                    </Switch>
                </LeftNav>
            </AppShell>
        );
    }
}

GovernanceAppShell.propTypes = {
    isNavOpen: PropTypes.bool,
    isNavCollapsed: PropTypes.bool,
    toggleNav: PropTypes.func,
};

const mapStateToProps = (state) => {
    console.log("STATE", state);
    let requestContextStateAccount = state.RequestContext.account;
    let requestContextStateCurrentUser = state.RequestContext.currentUser;
    return {
        isNavOpen: state.Nav.isNavOpen,
        isNavCollapsed: state.Nav.isNavCollapsed,
        accountId: requestContextStateAccount.id,
        subdomainName: state.RequestContext.realm.name,
        currentUserId: requestContextStateCurrentUser.id,
        isAdmin: requestContextStateCurrentUser.isAccountAdmin,
        isRealmAdmin: requestContextStateCurrentUser.isRealmAdmin,
        totalItems: _.get(state, 'Grids.accountUsers.pagination.totalItems', 0),
        paidUsers: getTotalPaidUsers(state.AccountUsers.users),
        deniedUsers: getTotalDeniedUsers(state.AccountUsers.users),
        deactivatedUsers: getTotalDeactivatedUsers(state.AccountUsers.users),
        totalRealmUsers: getTotalRealmUsers(state.AccountUsers.users)
    };
};

export default connect(mapStateToProps, {toggleNav})(GovernanceAppShell);
