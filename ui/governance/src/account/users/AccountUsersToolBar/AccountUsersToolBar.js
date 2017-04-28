import React, {PropTypes, Component} from "react";
import AccountUsersNavigation from "./AccountUsersNavigation";
import * as StandardGridActions from "../../../common/grid/standardGridActions";
import * as AccountUsersActions from "../AccountUsersActions";
import IconInputBox from "../../../../../reuse/client/src/components/iconInputBox/iconInputBox";
import {connect} from "react-redux";

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
                <IconInputBox placeholder="Search users"
                              onChange={this.props.onSearchChange}/>
                <AccountUsersNavigation getPreviousUsersPage={this.props.getPreviousUsersPage}
                                        getNextUsersPage={this.props.getNextUsersPage}
                                        id={this.props.id}/>
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


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getPreviousUsersPage: () => {
            dispatch(StandardGridActions.setCurrentPageOffset(ownProps.id, -1));
            dispatch(StandardGridActions.doUpdate(ownProps.id, AccountUsersActions.doUpdate));
        },

        getNextUsersPage: () => {
            dispatch(StandardGridActions.setCurrentPageOffset(ownProps.id, 1));
            dispatch(StandardGridActions.doUpdate(ownProps.id, AccountUsersActions.doUpdate));
        },

        onSearchChange: (searchEvent) => {
            dispatch(StandardGridActions.setSearch(ownProps.id, searchEvent.target.value));
            dispatch(StandardGridActions.doUpdate(ownProps.id, AccountUsersActions.doUpdate));
        }
    };
};

const mapStateToProps = (state) => {
    return {
    };
};

export {AccountUsersToolBar};

export default connect(mapStateToProps, mapDispatchToProps)(AccountUsersToolBar);

