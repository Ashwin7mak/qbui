import React, {Component, PropTypes} from 'react';
import Loader  from 'react-loader';
import {connect} from 'react-redux';

import AccountUsersGrid from './Grid/AccountUsersGrid';
import AccountUsersStage from './AccountUsersStage';

import * as AccountUsersActions from './AccountUsersActions';
import * as RequestContextActions from '../../common/requestContext/RequestContextActions';
import * as RequestContextCommon from '../../common/requestContext/RequestContextCommon';
import * as SpinnerConfigurations from "../../../../client-react/src/constants/spinnerConfigurations";
import AccountUsersToolBar from "./AccountUsersToolBar/AccountUsersToolBar";

/**
 * Represents the top level page that contains the grid for account users
 */
class AccountUsers extends Component {

    constructor(props) {
        super(props);
        this.GRID = "accountUsers";
    }

    /**
     * When the component mounts, get the users
     */
    componentDidMount() {
        this.props.fetchData(this.props.match.params.accountId, this.GRID);
    }

    render() {
        var canSeeAccountColumns = false;
        var canSeeRealmColumns = false;

        if (this.props.requestUser && this.props.requestRealm) {
            canSeeAccountColumns = this.props.requestUser.isAccountAdmin || this.props.requestUser.isCSR;
            canSeeRealmColumns = !this.props.requestRealm.isAccountURL && (this.props.requestUser.isRealmAdmin || this.props.requestUser.isCSR);
        }
        if (this.props.dataFetchingError) {
            return (
                <h1>Error</h1>
            );
        } else {
            return (
                <Loader loaded={!this.props.loading} options={SpinnerConfigurations.LARGE_BREAKPOINT}>
                    <div className="accountUsersContainer">
                        <AccountUsersStage users={this.props.users}/>
                        <AccountUsersToolBar totalRecords={this.props.users.length}/>
                        <AccountUsersGrid id={this.GRID} showAccountColumns={canSeeAccountColumns} showRealmColumns={canSeeRealmColumns}/>
                    </div>
                </Loader>
            );
        }
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
    fetchData(accountID, gridID) {
        dispatch(RequestContextActions.fetchRequestContextIfNeeded(accountID));
        dispatch(AccountUsersActions.fetchAccountUsers(accountID, gridID));
    }
});

const mapStateToProps = (state) => {
    return {
        requestUser: state.RequestContext.currentUser,
        requestRealm: state.RequestContext.realm,
        users: state.AccountUsers.users,
        loading: state.RequestContext.status.isFetching || !state.RequestContext.currentUser.id,
        dataFetchingError: RequestContextCommon.checkDataFetchingError(state.RequestContext.status.error),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(AccountUsers);

