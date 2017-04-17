import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {toggleNav} from '../../../reuse/client/src/components/sideNavs/commonNavActions';
import AppShell from '../../../reuse/client/src/components/appShell/appShell';
import DefaultTopNavGlobalActions from '../../../reuse/client/src/components/topNav/defaultTopNavGlobalActions';
import TopNav from '../../../reuse/client/src/components/topNav/topNav';
import LeftNav from '../common/leftNav/GovernanceLeftNav';

export const GovernanceAppShell = (props) => (
    <AppShell functionalAreaName="governance">
        <LeftNav
            isCollapsed={props.isNavCollapsed}
            isOpen={props.isNavOpen}
            accountId={Number.parseInt(props.params.accountId)}
        >
            <TopNav onNavClick={props.toggleNav} globalActions={
                <DefaultTopNavGlobalActions
                    startTabIndex={4}
                    dropdownIcon="user"
                    dropdownMsg="globalActions.user"
                />
            }/>
            {props.children}
        </LeftNav>
    </AppShell>
);

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
