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

    isNextDisabled() {
        return false;// TODO: this.props.totalRecords === this.props.pageEnd;
    }

    isPreviousDisabled() {
        return this.props.pageNumber === 1;
    }

    render() {
        return (
            <Pagination startRecord={1}
                        endRecord={this.props.totalRecords}
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
    pageNumber: PropTypes.number,
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
