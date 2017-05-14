import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {toggleNav} from 'REUSE/components/sideNavs/commonNavActions';
import AppShell from 'REUSE/components/appShell/appShell';
import DefaultTopNavGlobalActions from 'REUSE/components/topNav/defaultTopNavGlobalActions';
import TopNav from 'REUSE/components/topNav/topNav';
import {Switch} from 'react-router-dom';
import RouteWithSubRoutes from "APP/scripts/RouteWithSubRoutes";
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
