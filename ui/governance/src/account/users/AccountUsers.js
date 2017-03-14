import React, {Component} from 'react';
import AccountUsersGrid from './AccountUsersGrid';

class AccountUsers extends Component {
    render() {
        return (
            <div className="governanceMain">
                <h1>Welcome to governance!</h1>
                <AccountUsersGrid accountID={this.props.params.accountID}/>
            </div>
        );
    }
}

export default AccountUsers;
