import React, {Component} from 'react';
import AccountUsersGrid from './AccountUsersGrid';

class AccountUsers extends Component {
    render() {
        return (
            <div className="governanceMain">
                <h1>Welcome to governance!</h1>
                <AccountUsersGrid accountId={this.props.params.accountId}/>
            </div>
        );
    }
}

export default AccountUsers;
