import React, {PropTypes, Component} from "react";
import {connect} from 'react-redux';
import Pagination from "../../../../../reuse/client/src/components/pagination/pagination";
import * as StandardGridActions from "../../../common/grid/standardGridActions";
import * as AccountUsersActions from "../AccountUsersActions";

/**
 * The stage for the AccountUsers page
 */
class AccountUsersNavigation extends React.Component {

    constructor(...args) {
        super(...args);
    }

    isNextDisabled() {
        return false;// TODO: this.props.totalRecords === this.props.pageEnd;
    }

    isPreviousDisabled() {
        return false;//this.props.pageNumber === 1;
    }

    render() {
        return (
            <Pagination startRecord={1}
                        onClickPrevious={this.props.getPreviousUsersPage(this.props.id)}
                        onClickNext={this.props.getNextUsersPage(this.props.id)}
                        endRecord={this.props.totalRecords}
                        isPreviousDisabled={this.isPreviousDisabled()}
                        isNextDisabled={this.isNextDisabled()}
                        isHidden={false} />
        );
    }
}

AccountUsersNavigation.defaultProps = {
    pageNumber : 1
};

AccountUsersNavigation.propTypes = {
    pageNumber: PropTypes.number,
    totalRecords: PropTypes.number,
    id: PropTypes.string
};

export {AccountUsersNavigation};

const mapDispatchToProps = (dispatch) => {
    return {
        getPreviousUsersPage: (gridID) => {
            //dispatch(StandardGridActions.setPaginate(gridID, "previous"));
            //dispatch(StandardGridActions.doUpdate(gridID, AccountUsersActions.doUpdate));
        },

        getNextUsersPage: (gridID) =>  {
            //dispatch(StandardGridActions.setPaginate(gridID, "next"));
            //dispatch(StandardGridActions.doUpdate(gridID, AccountUsersActions.doUpdate));
        }
    };
};

const mapStateToProps = (state) => {
    return {
        // pageNumber: state.Grids.pageNumber
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(AccountUsersNavigation);
