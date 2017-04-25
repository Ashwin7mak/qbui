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
                id={this.props.id}
                columns={GetAccountUsersGridColumns(this.props.showAccountColumns, this.props.showRealmColumns)}
                doUpdate={Actions.doUpdate}
                items={this.props.users}
                rowKey="uid"
            />
        );
    }
}

// Provide type checking
AccountUsersGrid.propTypes = {
    id: PropTypes.string,
    users: PropTypes.array,
    showAccountColumns: PropTypes.bool,
    showRealmColumns: PropTypes.bool
};

// Provide default val
AccountUsersGrid.defaultProps = {
    users: []
};

export default AccountUsersGrid;

