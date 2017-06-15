import React, {PropTypes, Component} from "react";
import {GetAccountUsersGridColumns} from "./AccountUsersGridColumns";
import {GetAccountUsersFacetFields} from "./AccountUsersGridFacet";
import StandardGrid from "GOVERNANCE/common/grid/standardGrid";
import * as AccountUsersActions from "../AccountUsersActions";
import constants from "../../../app/constants";
import "./AccountUsersGrid.scss";

/**
 * Renders the Grid portion of the AccountUsers view
 * It has all the standard components : Grid, ToolBar (Search, Filter, Pagination)
 */
class AccountUsersGrid extends Component {
    render() {
        return (
            <StandardGrid
                id={this.props.id}
                columns={GetAccountUsersGridColumns(this.props.showAccountColumns, this.props.showRealmColumns)}
                facetFields={GetAccountUsersFacetFields(this.props.showAccountColumns, this.props.showRealmColumns)}
                doUpdate={AccountUsersActions.doUpdateUsers}
                rowKey="uid"
                itemTypePlural="users"
                itemTypeSingular="user"
                itemsPerPage={constants.USERS_GRID_ITEMSPERPAGE}
                noItemsFound={'governance.noItemsFound'}
            />
        );
    }
}

AccountUsersGrid.propTypes = {
    /**
     * ID of the Grid
     */
    id: PropTypes.string,

    /**
     * We show different columns based on permissions.
     * Account Columns for example are only shown for Account Admins
     * Realm Columns are only shown for Realm Admins
     * See GetAccountUsersGridColumns for more details
     */
    showAccountColumns: PropTypes.bool,
    showRealmColumns: PropTypes.bool,

    /**
     * We need to tell the grid what kind of item we are displaying
     */
    itemTypePlural: PropTypes.string,
    itemTypeSingular: PropTypes.string
};

export default AccountUsersGrid;

