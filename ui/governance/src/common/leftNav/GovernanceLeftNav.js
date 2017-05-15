import React, {PropTypes, Component} from "react";
import {connect} from "react-redux";
import StandardLeftNav from "../../../../reuse/client/src/components/sideNavs/standardLeftNav";
import DefaultTopNavGlobalActions from "../../../../reuse/client/src/components/topNav/defaultTopNavGlobalActions";
import GetLeftNavLinks from "./GovernanceLeftNavLinks";
import * as RequestContextActions from "../requestContext/RequestContextActions";
import {isFetching} from "../requestContext/RequestContextReducer";

class GovernanceLeftNav extends Component {
    componentDidMount() {
        this.props.fetchData(this.props.accountId);
    }

    render() {
        return (
            <StandardLeftNav
                isCollapsed={this.props.isNavCollapsed}
                isOpen={this.props.isNavOpen}
                showLoadingIndicator={this.props.isLoading}
                isContextHeaderSmall={true}
                showContextHeader={true}
                contextHeaderIcon="settings"
                contextHeaderIconFont="iconUISturdy"
                contextHeaderTitle="Manage Quick Base"
                navItems={GetLeftNavLinks(this.props.isAccountAdmin, this.props.isRealmAdmin, this.props.isAccountURL)}
                globalActions={<DefaultTopNavGlobalActions dropdownIcon="user" dropdownMsg="globalActions.user" shouldOpenMenusUp={true} />}
            >
                {this.props.children}
            </StandardLeftNav>
        );
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
        isLoading: isFetching(state),
        isAccountAdmin: state.RequestContext.currentUser.isAccountAdmin,
        isRealmAdmin: state.RequestContext.currentUser.isRealmAdmin,
        isAccountURL: state.RequestContext.realm.isAccountURL
    };
};

GovernanceLeftNav.propTypes = {
    fetchData: PropTypes.func.isRequired,
    isNavOpen: PropTypes.bool.isRequired,
    isNavCollapsed: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool,
    accountId: PropTypes.number,
    isRealmAdmin: PropTypes.bool,
    isAccountAdmin: PropTypes.bool,
    isAccountURL: PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(GovernanceLeftNav);
