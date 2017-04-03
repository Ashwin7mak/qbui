import React, {Component, PropTypes} from 'react';
import AccountUsersGrid from './grid/AccountUsersGrid';
import AccountUsersStage from './AccountUsersStage';
import {connect} from 'react-redux';
import * as AccountUsersActions from './AccountUsersActions';
import * as RequestContextActions from '../../common/requestContext/RequestContextActions';

/**
 * Represents the top level page that contains the grid for account users
 */
class AccountUsers extends Component {
    constructor(props) {
        super(props);
    }

    /**
     * get users whenever the component mounts
     */
    componentDidMount() {
        this.props.fetchRequestContextIfNeeded(this.props.params.accountId);
        this.props.fetchAccountUsers(this.props.params.accountId);
    }

    render() {
        return (
            <div className="accountUsersContainer">
                <AccountUsersStage isHidden={false} />
                <AccountUsersGrid accountId={this.props.params.accountId} />
            </div>
        );
    }
}

AccountUsers.propTypes = {
    fetchAccountUsers: PropTypes.func.isRequired,
    fetchRequestContextIfNeeded: PropTypes.func.isRequired
};

export {AccountUsers};

const mapDispatchToProps = (dispatch) => ({
    fetchAccountUsers(id) {
        dispatch(AccountUsersActions.fetchAccountUsers(id));
    },
    fetchRequestContextIfNeeded(id) {
        dispatch(RequestContextActions.fetchRequestContextIfNeeded(id));
    }
});

export default connect(null, mapDispatchToProps)(AccountUsers);

