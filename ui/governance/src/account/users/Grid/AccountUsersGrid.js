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
                rowKey="uid"
            />
        );
    }
}

// Provide type checking
AccountUsersGrid.propTypes = {
    id: PropTypes.string,
    showAccountColumns: PropTypes.bool,
    showRealmColumns: PropTypes.bool
};

export default AccountUsersGrid;

