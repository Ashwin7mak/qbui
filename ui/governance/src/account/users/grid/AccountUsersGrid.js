import React, {PropTypes, Component} from 'react';

import {GetAccountUsersGridColumns} from './AccountUsersGridColumns';

import "./AccountUsersGrid.scss";
import StandardGrid from '../../../common/grid/standardGrid';
import * as Actions from "../AccountUsersActions";

/**
 * Renders the grid portion of the AccountUsers view
 */
class AccountUsersGrid extends Component {
    render() {
        return (
            <StandardGrid
                columns={GetAccountUsersGridColumns(this.props.showAccountColumns, this.props.showRealmColumns)}
                doUpdate={Actions.doUpdate}
                data={this.props.users}
                id="accountUsers"
                rowKey="uid"
            />
        );
    }
}

// Provide type checking
AccountUsersGrid.propTypes = {
    users: PropTypes.array,
    showAccountColumns: PropTypes.bool,
    showRealmColumns: PropTypes.bool
};

// Provide default val
AccountUsersGrid.defaultProps = {
    users: []
};

export default AccountUsersGrid;

