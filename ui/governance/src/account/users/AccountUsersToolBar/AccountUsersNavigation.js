import React, {PropTypes, Component} from "react";
import {connect} from "react-redux";
import Pagination from "../../../../../reuse/client/src/components/pagination/pagination";
import * as _ from "lodash";

/**
 * The Navigation Component for the AccountUsers page
 */
class AccountUsersNavigation extends React.Component {

    constructor(...args) {
        super(...args);
    }

    getStartRecord() {
        return 1;
    }

    getEndRecord() {
        return this.props.totalRecords;
    }

    isPreviousDisabled() {
        return this.props.pageNumber === 1;
    }

    isNextDisabled() {
        return false;// TODO: this.props.totalRecords === this.props.pageEnd;
    }

    render() {
        return (
            <Pagination startRecord={this.getStartRecord()}
                        endRecord={this.getEndRecord()}
                        onClickPrevious={this.props.getPreviousUsersPage}
                        onClickNext={this.props.getNextUsersPage}
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
    id: PropTypes.string
};

export {AccountUsersNavigation};

const mapStateToProps = (state, ownProps) => {
    return {
        totalRecords: _.has(state.Grids, ownProps.id) ? state.Grids[ownProps.id].items.length : 1,
        pageNumber: _.has(state.Grids, ownProps.id) ? state.Grids[ownProps.id].pageNumber : 1
    };
};


export default connect(mapStateToProps)(AccountUsersNavigation);
