import React, {PropTypes, Component} from 'react';
import AccountUsersGrid from './AccountUserGrid';
import ReIcon from '../../../../reuse/client/src/components/reIcon/reIcon';

class AccountUsers extends Component {
    render() {
        return (
            <div className="governanceMain">
                <h1>Welcome to governance! <ReIcon icon='speechbubble-outline'/></h1>
                <AccountUsersGrid />
            </div>
        );
    }
}

export default AccountUsers;
