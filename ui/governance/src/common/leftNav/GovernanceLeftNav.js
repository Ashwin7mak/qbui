import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import StandardLeftNav from '../../../../reuse/client/src/components/sideNavs/standardLeftNav';
import {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon';
import DefaultTopNavGlobalActions from '../../../../reuse/client/src/components/topNav/defaultTopNavGlobalActions';

import * as RequestContextCommon from '../requestContext/RequestContextCommon';
import * as RequestContextActions from '../requestContext/RequestContextActions';

class GovernanceLeftNav extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchData(this.props.accountId);
    }

    render() {
        if (this.props.dataFetchingError) {
            return (
                <h1>Error</h1>
            );
        } else {
            return (
                <StandardLeftNav
                    isCollapsed={this.props.isNavCollapsed}
                    isOpen={this.props.isNavOpen}
                    showLoadingIndicator={this.props.isLoading}
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
                    {this.props.children}
                </StandardLeftNav>
            );
        }
    }
}

export {GovernanceLeftNav};

const mapDispatchToProps = (dispatch) => ({
    fetchData(id) {
        dispatch(RequestContextActions.fetchRequestContextIfNeeded(id));
    }
});

const mapStateToProps = (state) => {
    return {
        isLoading: state.RequestContext.status.isFetching || !state.RequestContext.currentUser.id,
        dataFetchingError: RequestContextCommon.checkDataFetchingError(state.RequestContext.status.error),
    };
};

GovernanceLeftNav.propTypes = {
    fetchData: PropTypes.func.isRequired,
    isNavOpen: PropTypes.bool,
    isNavCollapsed: PropTypes.bool,
    isLoading: PropTypes.bool,
    accountId: PropTypes.number
};

export default connect(mapStateToProps, mapDispatchToProps)(GovernanceLeftNav);
