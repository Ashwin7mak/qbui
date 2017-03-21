import React, {Component} from 'react';
import AccountUsersGrid from './grid/AccountUsersGrid';
import {I18nMessage} from '../../../../reuse/client/src/utils/i18nMessage';

/**
 * Represents the top level page that contains the grid for account users
 */
class AccountUsers extends Component {
    render() {
        return (
            <div className="governanceMain">
                <h2><I18nMessage message="governance.home.welcome"/></h2>
                <AccountUsersGrid accountId={this.props.params.accountId}/>
            </div>
        );
    }
}

export default AccountUsers;
