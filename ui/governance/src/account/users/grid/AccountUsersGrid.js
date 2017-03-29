import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import Loader  from 'react-loader';
import * as Table from 'reactabular-table';

import QbHeaderCell from '../../../../../client-react/src/components/dataTable/qbGrid/qbHeaderCell';
import QbRow from '../../../../../client-react/src/components/dataTable/qbGrid/qbRow';
import QbCell from '../../../../../client-react/src/components/dataTable/qbGrid/qbCell';
import '../../../../../client-react/src/components/dataTable/qbGrid/qbGrid.scss';
import * as SpinnerConfigurations from "../../../../../client-react/src/constants/spinnerConfigurations";

import * as AccountUsersActions from '../AccountUsersActions';
import * as RequestContextActions from '../../../common/requestContext/RequestContextActions';

import {GetAccountUsersGridColumns} from './AccountUsersGridColumns';

import "./AccountUsersGrid.scss";

// Sub-component pieces we will be using to override React Tabular's default components
const tableSubComponents = {
    header: {
        cell: QbHeaderCell
    },
    body: {
        row: QbRow,
        cell: QbCell
    }
};

// Helper function to return additional props to add to a row element
const onRowFn = (row) => {
    return {
        className: 'qbRow'
    };
};

/**
 * Renders the grid portion of the AccountUsers view
 */
class AccountUsersGrid extends Component {

    constructor(props) {
        super(props);
    }

    /**
     * get users whenever the component mounts
     */
    componentDidMount() {
        this.props.fetchRequestContextIfNeeded(this.props.accountId);
        this.props.fetchAccountUsers(this.props.accountId);
    }

    render() {
        if (this.props.dataFetchingError) {
            return (
                <h1>Error</h1>
            );
        } else {
            return (
                <Loader loaded={!this.props.loading} options={SpinnerConfigurations.LARGE_BREAKPOINT}>
                    <Table.Provider
                        ref="qbGridTable"
                        className="qbGrid"
                        columns={GetAccountUsersGridColumns(this.props.showAccountColumns, this.props.showRealmColumns)}
                        components={tableSubComponents}
                    >
                        <Table.Header className="qbHeader" />

                        <Table.Body className="qbTbody"
                                    rows={this.props.users}
                                    rowKey="uid"
                                    onRow={onRowFn}
                        />
                    </Table.Provider>
                </Loader>
            );
        }
    }
}


// Provide type checking
AccountUsersGrid.propTypes = {
    accountId: PropTypes.string.isRequired,
    users: PropTypes.array,
    showAccountColumns: PropTypes.bool,
    showRealmColumns: PropTypes.bool,
    dataFetchingError: PropTypes.any,
    fetchAccountUsers: PropTypes.func.isRequired,
    fetchRequestContextIfNeeded: PropTypes.func.isRequired
};

// Provide default val
AccountUsersGrid.defaultProps = {
    users: []
};

export {AccountUsersGrid};

const mapStateToProps = (state) => {
    let user = state.RequestContext.currentUser;
    let realm = state.RequestContext.realm;

    return {
        users: state.AccountUsers.users,
        loading: state.RequestContext.status.isFetching || !user.id,
        dataFetchingError: state.RequestContext.status.error,
        showAccountColumns: user.isAccountAdmin || user.isCSR,
        showRealmColumns: !realm.isAccountURL && (user.isRealmAdmin || user.isCSR),
    };
};

const mapDispatchToProps = (dispatch) => ({
    fetchAccountUsers(id) {
        dispatch(AccountUsersActions.fetchAccountUsers(id));
    },
    fetchRequestContextIfNeeded(id) {
        dispatch(RequestContextActions.fetchRequestContextIfNeeded(id));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountUsersGrid);

