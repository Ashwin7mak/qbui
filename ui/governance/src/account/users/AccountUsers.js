import React, {PropTypes, Component} from 'react';
import AccountUsersGrid from './AccountUserGrid';

class AccountUsers extends Component {
    render() {
        return (
            <div className="governanceMain">
                <h1>Welcome to governance!</h1>
                <AccountUsersGrid />
            </div>
        );
    }
}

export default AccountUsers;
