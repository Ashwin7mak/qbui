import React, {PropTypes, Component} from "react";
import AccountUsersNavigation from "./AccountUsersNavigation";
import IconInputBox from "../../../../../reuse/client/src/components/iconInputBox/iconInputBox";
import * as StandardGridActions from "../../../common/grid/standardGridActions";
import * as AccountUsersActions from "../AccountUsersActions";

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
                <IconInputBox
                    onClear={this.props.onClearSearch}
                    placeholder="Search users"
                    onChange={this.props.onSearchChange(this.props.id)}/>
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


const mapDispatchToProps = (dispatch) => {
    return {
        // TODO: Pass the search term
        onSearchChange: (gridID, searchTerm) => {
            dispatch(StandardGridActions.setSearch(gridID, "previous"));
            dispatch(StandardGridActions.doUpdate(gridID, AccountUsersActions.doUpdate));
        }
    };
};

const mapStateToProps = (state) => {
    return {
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(AccountUsersToolBar);

