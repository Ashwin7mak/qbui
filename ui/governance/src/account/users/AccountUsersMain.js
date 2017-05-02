import React, {Component, PropTypes} from 'react';
import Loader  from 'react-loader';
import {connect} from 'react-redux';

import AccountUsersGrid from './grid/AccountUsersGrid';
import AccountUsersStage from './AccountUsersStage';

import * as AccountUsersActions from './AccountUsersActions';
import * as RequestContextActions from '../../common/requestContext/RequestContextActions';
import * as SpinnerConfigurations from "../../../../client-react/src/constants/spinnerConfigurations";

import {isFetching} from './AccountUsersReducer';

/**
 * Represents the top level page that contains the grid for account users
 */
class AccountUsers extends Component {

    constructor(props) {
        super(props);
        this.GRID_ID = "accountUsers";
        this.ITEMS_PER_PAGE = 10;
    }

    /**
     * When the component mounts, get the users
     */
    componentDidMount() {
        this.props.fetchData(this.props.match.params.accountId, this.GRID_ID, this.ITEMS_PER_PAGE);
    }

    render() {
        var canSeeAccountColumns = false;
        var canSeeRealmColumns = false;

        if (this.props.requestUser && this.props.requestRealm) {
            canSeeAccountColumns = this.props.requestUser.isAccountAdmin || this.props.requestUser.isCSR;
            canSeeRealmColumns = !this.props.requestRealm.isAccountURL && (this.props.requestUser.isRealmAdmin || this.props.requestUser.isCSR);
        }

        return (
            <Loader loaded={!this.props.loading} options={SpinnerConfigurations.LARGE_BREAKPOINT}>
                <div className="accountUsersContainer">
                    <AccountUsersStage users={this.props.users}/>
                    <AccountUsersGrid id={this.GRID_ID}
                                      showAccountColumns={canSeeAccountColumns}
                                      showRealmColumns={canSeeRealmColumns}/>
                </div>
            </Loader>
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

export {AccountUsers};

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

