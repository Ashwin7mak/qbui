import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {toggleNav} from '../../../reuse/client/src/components/sideNavs/commonNavActions';
import AppShell from '../../../reuse/client/src/components/appShell/appShell';
import DefaultTopNavGlobalActions from '../../../reuse/client/src/components/topNav/defaultTopNavGlobalActions';
import TopNav from '../../../reuse/client/src/components/topNav/topNav';
import LeftNav from '../../../reuse/client/src/components/sideNavs/standardLeftNav';
import {AVAILABLE_ICON_FONTS} from '../../../reuse/client/src/components/icon/icon';

export const GovernanceAppShell = ({isNavOpen, isNavCollapsed, toggleNav, children}) => (
    <AppShell functionalAreaName="governance">
        <LeftNav
            isCollapsed={isNavCollapsed}
            isOpen={isNavOpen}
            isContextHeaderSmall={true}
            showContextHeader={true}
            contextHeaderIcon="settings"
            contextHeaderTitle="Manage QuickBase"
            navItems={[
                {title: 'Back to My Apps', isPrimaryAction: true, secondaryIcon: 'caret-left', href: '/qbase/apps'},
                {icon: 'Report', iconFont: AVAILABLE_ICON_FONTS.TABLE_STURDY, title: 'Account summary', isDisabled: true},
                {icon: 'favicon', title: 'Manage apps', isDisabled: true},
                {icon: 'users', title: 'Manage users', isSelected: true},
                {icon: 'Group', iconFont: AVAILABLE_ICON_FONTS.TABLE_STURDY, title: 'Manage groups', isDisabled: true},
                {icon: 'configure', title: 'Set account properties', isDisabled: true},
                {icon: 'selected', title: 'Set realm policies', isDisabled: true},
                {icon: 'Fountain_Pen', iconFont: AVAILABLE_ICON_FONTS.TABLE_STURDY, title: 'Edit realm branding', isDisabled: true},
                {icon: 'currency', title: 'Manage billing', isDisabled: true},
                {icon: 'bell', iconFont: AVAILABLE_ICON_FONTS.TABLE_STURDY, title: 'Contact support'}
            ]}
            globalActions={<DefaultTopNavGlobalActions dropdownIcon="user" dropdownMsg="globalActions.user" shouldOpenMenusUp={true} />}
        >
            <TopNav onNavClick={toggleNav} globalActions={
                <DefaultTopNavGlobalActions
                    startTabIndex={4}
                    dropdownIcon="user"
                    dropdownMsg="globalActions.user"
                />
            }/>
            {children}
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
