import React, {Component} from 'react';
import AccountUsersGrid from './grid/AccountUsersGrid';
import AccountUsersStage from './AccountUsersStage';

/**
 * Represents the top level page that contains the grid for account users
 */
class AccountUsers extends Component {
    render() {
        return (
            <div className="governanceMain">
                <AccountUsersStage isHidden={true} />
                <AccountUsersGrid accountId={this.props.params.accountId}/>
            </div>
        );
    }
}

export default AccountUsers;
