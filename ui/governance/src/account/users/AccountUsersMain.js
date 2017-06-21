import React, {Component, PropTypes} from "react";
import Loader from "react-loader";
import {connect} from "react-redux";
import AccountUsersGrid from "./grid/AccountUsersGrid";
import AccountUsersStage from "./AccountUsersStage";
import * as AccountUsersActions from "./AccountUsersActions";
import * as RequestContextActions from "../../common/requestContext/RequestContextActions";
import * as SpinnerConfigurations from "../../../../client-react/src/constants/spinnerConfigurations";
import {isFetching} from "./AccountUsersReducer";
import constants from "../../app/constants";

import './accountUsersMain.scss';

/**
 * Represents the top level page that contains top level components
 */
export class AccountUsers extends Component {

    constructor(props) {
        super(props);
        // Currently we have 1 Grid that shows the Users in an Account
        this.USERS_GRID_ID = "accountUsers";
        // Get the number of users to show in a single page
        this.USERS_PER_PAGE = constants.USERS_GRID_ITEMSPERPAGE;
    }

    /**
     * When the component mounts, get the users and dispatch actions after success
     */
    componentDidMount() {
        this.props.fetchData(this.props.match.params.accountId, this.USERS_GRID_ID, this.USERS_PER_PAGE);
    }

    render() {
        let canSeeAccountColumns = false;
        let canSeeRealmColumns = false;

        if (this.props.requestUser && this.props.requestRealm) {
            canSeeAccountColumns = this.props.requestUser.isAccountAdmin || this.props.requestUser.isCSR;
            canSeeRealmColumns = !this.props.requestRealm.isAccountURL && (this.props.requestUser.isRealmAdmin || this.props.requestUser.isCSR);
        }

        return (
            <div className="accountUsersMain">
                <Loader loaded={!this.props.loading} options={SpinnerConfigurations.LARGE_BREAKPOINT}>
                    <div className="accountUsersContainer">
                        <AccountUsersStage />
                        {/* This is the main grid that shows the users */}
                        <AccountUsersGrid id={this.USERS_GRID_ID}
                                          showAccountColumns={canSeeAccountColumns}
                                          showRealmColumns={canSeeRealmColumns}/>
                    </div>
                </Loader>
            </div>
        );
    }
}

AccountUsers.propTypes = {
    fetchData: PropTypes.func.isRequired,
    dataFetchingError: PropTypes.any,
    requestUser: PropTypes.object,
    requestRealm: PropTypes.object,
    users: PropTypes.array,
    loading: PropTypes.bool
};

const mapDispatchToProps = (dispatch) => ({
    fetchData(accountID, gridID, itemsPerPage) {
        dispatch(RequestContextActions.fetchRequestContextIfNeeded(accountID));
        dispatch(AccountUsersActions.fetchAccountUsers(accountID, gridID, itemsPerPage));
    }
});

const mapStateToProps = (state) => {
    return {
        requestUser: state.RequestContext.currentUser,
        requestRealm: state.RequestContext.realm,
        users: state.AccountUsers.users,
        loading: isFetching(state)
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(AccountUsers);

