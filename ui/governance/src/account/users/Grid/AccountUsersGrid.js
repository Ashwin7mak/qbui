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
                items={this.props.users}
                id={this.props.id}
                rowKey="uid"
            />
        );
    }
}

// Provide type checking
AccountUsersGrid.propTypes = {
    users: PropTypes.array,
    id: PropTypes.string,
    showAccountColumns: PropTypes.bool,
    showRealmColumns: PropTypes.bool
};

// Provide default val
AccountUsersGrid.defaultProps = {
    users: []
};

export default AccountUsersGrid;

