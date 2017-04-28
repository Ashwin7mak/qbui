import React, {PropTypes, Component} from "react";
import StandardGridNavigation from "./StandardGridNavigation";
import * as StandardGridActions from "../../../common/grid/standardGridActions";
import IconInputBox from "../../../../../reuse/client/src/components/iconInputBox/iconInputBox";
import {connect} from "react-redux";

/**
 * The toolbar for Standard Grid
 */
class StandardGridToolBar extends React.Component {

    constructor(...args) {
        super(...args);
    }

    render() {
        return (
            <div>
                <IconInputBox placeholder="Search users"
                              onChange={this.props.onSearchChange}/>
                <StandardGridNavigation getPreviousUsersPage={this.props.getPreviousUsersPage}
                                        getNextUsersPage={this.props.getNextUsersPage}
                                        id={this.props.id}/>
            </div>
        );
    }
}

StandardGridToolBar.defaultProps = {
    totalRecords: 0
};

StandardGridToolBar.propTypes = {
    totalRecords: PropTypes.number,
    id: PropTypes.string,
    doUpdate: PropTypes.func.isRequired
};


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getPreviousUsersPage: () => {
            dispatch(StandardGridActions.setCurrentPageOffset(ownProps.id, -1));
            dispatch(StandardGridActions.doUpdate(ownProps.id, ownProps.doUpdate));
        },

        getNextUsersPage: () => {
            dispatch(StandardGridActions.setCurrentPageOffset(ownProps.id, 1));
            dispatch(StandardGridActions.doUpdate(ownProps.id, ownProps.doUpdate));
        },

        onSearchChange: (searchEvent) => {
            dispatch(StandardGridActions.setSearch(ownProps.id, searchEvent.target.value));
            dispatch(StandardGridActions.doUpdate(ownProps.id, ownProps.doUpdate));
        }
    };
};

const mapStateToProps = (state) => {
    return {
    };
};

export {StandardGridToolBar};

export default connect(mapStateToProps, mapDispatchToProps)(StandardGridToolBar);

