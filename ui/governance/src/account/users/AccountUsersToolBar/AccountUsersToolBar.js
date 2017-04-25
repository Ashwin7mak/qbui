import React, {PropTypes, Component} from "react";
import AccountUsersNavigation from "./AccountUsersNavigation";
import * as StandardGridActions from "../../../common/grid/standardGridActions";
import * as AccountUsersActions from "../AccountUsersActions";
import IconInputBox from "../../../../../reuse/client/src/components/iconInputBox/iconInputBox";
import {connect} from 'react-redux';

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
                <IconInputBox placeholder="Search users"/>
                <AccountUsersNavigation id={this.props.id} totalRecords={this.props.totalRecords}/>
            </div>
        );
    }
}

AccountUsersToolBar.defaultProps = {
    totalRecords: 0
};

AccountUsersToolBar.propTypes = {
    totalRecords: PropTypes.number,
    id: PropTypes.string
};


const mapDispatchToProps = (dispatch) => {
    return {
        // // TODO: Pass the search term
        // onSearchChange: (gridID, searchTerm) => {
        //     dispatch(StandardGridActions.setSearch(gridID, "previous"));
        //     dispatch(StandardGridActions.doUpdate(gridID, AccountUsersActions.doUpdate));
        // }
    };
};

const mapStateToProps = (state) => {
    return {
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(AccountUsersToolBar);

