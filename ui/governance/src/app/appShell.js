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
import Config from '../../../client-react/src/config/app.config';
import AccountUsersStage from "../../src/account/users/AccountUsersStage";


import "./governanceAppShell.scss";
export const GovernanceAppShell = (props) => (
    <AppShell functionalAreaName="governance">
        <Analytics dataset={Config.evergageDataset} isAdmin={props.isAdmin} userId={props.currentUserId}/>
        <LeftNav
            isNavCollapsed={props.isNavCollapsed}
            isNavOpen={props.isNavOpen}
            accountId={Number.parseInt(props.match.params.accountId)}
        >
            <TopNav onNavClick={props.toggleNav} hasNavItem={false} globalActions={
                <DefaultTopNavGlobalActions
                    startTabIndex={4}
                    dropdownIcon="user"
                    dropdownMsg="globalActions.user"
                    hasFeedback={false}
                />
            }/>
            <Switch>
                {props.routes !== undefined ? props.routes.map((route, i) => {
                    return (
                        <RouteWithSubRoutes key={i} {...route} />
                    );
                }) : ''}
            </Switch>
        </LeftNav>
    </AppShell>
);

var myChild = React.renderComponent(AccountUsersStage);
console.log(myChild.getTotalPaidUsers);


GovernanceAppShell.propTypes = {
    isNavOpen: PropTypes.bool,
    isNavCollapsed: PropTypes.bool,
    toggleNav: PropTypes.func,
};

const mapStateToProps = (state) => {
    console.log(state);
    return {
        isNavOpen: state.Nav.isNavOpen,
        isNavCollapsed: state.Nav.isNavCollapsed,
        accountId: state.RequestContext.account.id,
        currentUserId: state.RequestContext.currentUser.id,
        isAdmin: state.RequestContext.currentUser.isAccountAdmin,
        isRealmAdmin: state.RequestContext.currentUser.isRealmAdmin,
        subdomainName: state.RequestContext.account.name,

    };
};

export default connect(mapStateToProps, {toggleNav})(GovernanceAppShell);
