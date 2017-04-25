import React, {PropTypes, Component} from "react";
import {connect} from 'react-redux';
import Pagination from "../../../../../reuse/client/src/components/pagination/pagination";

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
                        onClickPrevious={this.props.getPreviousUsersPage}
                        onClickNext={this.props.getNextUsersPage}
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

const mapStateToProps = (state) => {
    return {
        pageNumber: state.Grids.pageNumber
    };
};


export default connect(mapStateToProps, null)(AccountUsersNavigation);
