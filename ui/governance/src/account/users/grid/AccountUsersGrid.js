import React, {PropTypes, Component} from "react";
import {GetAccountUsersGridColumns} from "./AccountUsersGridColumns";
import {GetFacetFields} from "./AccountUsersGridFacet";
import "./AccountUsersGrid.scss";
import StandardGrid from "GOVERNANCE/common/grid/standardGrid";
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
                facetFields={GetFacetFields(this.props.showAccountColumns, this.props.showRealmColumns)}
                doUpdate={Actions.doUpdate}
                rowKey="uid"
                itemTypePlural={this.props.itemTypePlural}
                itemTypeSingular={this.props.itemTypeSingular}
            />
        );
    }
}

AccountUsersGrid.propTypes = {
    id: PropTypes.string,
    showAccountColumns: PropTypes.bool,
    showRealmColumns: PropTypes.bool,
    itemTypePlural: PropTypes.string,
    itemTypeSingular: PropTypes.string
};

export default AccountUsersGrid;

