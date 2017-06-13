import React, {PropTypes, Component} from "react";
import {connect} from "react-redux";
import {toggleNav} from "../../../reuse/client/src/components/sideNavs/commonNavActions";
import AppShell from "../../../reuse/client/src/components/appShell/appShell";
import DefaultTopNavGlobalActions from "../../../reuse/client/src/components/topNav/defaultTopNavGlobalActions";
import TopNav from "../../../reuse/client/src/components/topNav/topNav";
import LeftNav from "../common/leftNav/GovernanceLeftNav";
import {Switch} from "react-router-dom";
import RouteWithSubRoutes from "../../../client-react/src/scripts/RouteWithSubRoutes";

import "./governanceAppShell.scss";

export class GovernanceAppShell extends Component {
    render() {
        return (
            <AppShell functionalAreaName="governance">
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

const mapStateToProps = (state) => ({
    isNavOpen: state.Nav.isNavOpen,
    isNavCollapsed: state.Nav.isNavCollapsed
});

export default connect(mapStateToProps, {toggleNav})(GovernanceAppShell);
