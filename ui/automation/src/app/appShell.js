import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {toggleNav} from '../../../reuse/client/src/components/sideNavs/commonNavActions';
import AppShell from '../../../reuse/client/src/components/appShell/appShell';
import DefaultTopNavGlobalActions from '../../../reuse/client/src/components/topNav/defaultTopNavGlobalActions';
import TopNav from '../../../reuse/client/src/components/topNav/topNav';
import {Switch} from 'react-router-dom';
import RouteWithSubRoutes from "../../../client-react/src/scripts/RouteWithSubRoutes";
export const AutomationAppShell = (props) => (
    <AppShell functionalAreaName="automation">
            <TopNav onNavClick={props.toggleNav} globalActions={
                <DefaultTopNavGlobalActions
                    startTabIndex={4}
                    dropdownIcon="user"
                    dropdownMsg="globalActions.user"
                />
            }/>
            <Switch>
                {props.routes !== undefined ? props.routes.map((route, i) => {
                    return (
                            <RouteWithSubRoutes key={i} {...route} />
                    );
                }) : ''}
            </Switch>
    </AppShell>
);

AutomationAppShell.propTypes = {
    isNavOpen: PropTypes.bool,
    isNavCollapsed: PropTypes.bool,
    toggleNav: PropTypes.func,
};

const mapStateToProps = (state) => ({
    isNavOpen: state.Nav.isNavOpen,
    isNavCollapsed: state.Nav.isNavCollapsed
});

export default connect(mapStateToProps, {toggleNav})(AutomationAppShell);
