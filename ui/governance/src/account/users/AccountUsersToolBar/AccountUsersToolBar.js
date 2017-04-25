import React, {PropTypes, Component} from "react";
import AccountUsersNavigation from "./AccountUsersNavigation";

/**
 * The toolbar for the AccountUsers page
 */
class AccountUsersToolBar extends React.Component {

    constructor(...args) {
        super(...args);
    }

    render() {
        return (
            <div>
                <AccountUsersNavigation id={this.props.id} totalRecords={this.props.totalRecords}/>
            </div>
        );
    }
}

AccountUsersToolBar.defaultProps = {
    totalRecords: 0
};

AccountUsersToolBar.propTypes = {
    totalRecords: PropTypes.Number,
    id: PropTypes.String
};

export default AccountUsersToolBar;
