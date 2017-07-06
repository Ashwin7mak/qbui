import React, {PropTypes, Component} from 'react';
import {connect} from "react-redux";
import {getTotalPaidUsers, getTotalDeniedUsers, getTotalDeactivatedUsers, getTotalRealmUsers} from "../../src/account/users/AccountUsersReducer";
import {Analytics} from "../../../reuse/client/src/components/analytics/analytics";
import Config from '../../../client-react/src/config/app.config';
import {getPageLoadTime, getGridLoadTime, getGridRefreshTime} from "../analytics/performanceTimingReducer";
import _ from "lodash";

export class GovernanceAnalytics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pageLoaded: false
        }
    }

    /**
     * Determines the conditions specifying an initial page load - if the flag (pageLoaded) is false and pageLoadTime
     * has been populated with a non-zero value
     * @returns {boolean|Number}
     */
    isFirstPageLoad = () => {
        return !this.state.pageLoaded && this.props.pageLoadTime && this.props.pageLoadTime > 0;
    };

    componentDidUpdate() {
        if (this.isFirstPageLoad()) {
            this.setState({pageLoaded: true});
        }
    }

    render() {
        /**
        Any of these prop_key_vals will be sent to Evergage whenever they change.
        The given key is the name that will be used as the property for the event in
        Evergage, and the value will be the value set to that property.
         */
        let propKeyVals = {
            accountId: this.props.accountId,
            has_account_admin: this.props.isAccountAdmin,
            is_realm_admin: this.props.isRealmAdmin,
            is_CSR: this.props.isCSR,
            subdomainName: this.props.subdomainName,
            totalUsers: this.props.totalUsers,
            paidUsers: this.props.paidUsers,
            deniedUsers: this.props.deniedUsers,
            deactivatedUsers: this.props.deactivatedUsers,
            totalRealmUsers: this.props.totalRealmUsers
        };

        /**
         * NOTE: special case - this makes sure that a negative value isn't sent to Evergage, since
         * usersGridLoadTime gets populated before pageLoadTime is calculated, and ensures they are
         * only sent to evergage for the first page load
         */
        if (this.isFirstPageLoad()) {
            propKeyVals.pageLoadTime = this.props.pageLoadTime;
            propKeyVals.usersGridLoadTime = this.props.usersGridLoadTime;
        }
        else if (this.state.pageLoaded) {
            propKeyVals.usersGridRefreshTime = this.props.usersGridRefreshTime;
        }

        return (
            <Analytics dataset={Config.evergageDataset}
                       userId={this.props.currentUserId}
                       evergageUpdateProps={propKeyVals} />
        );
    }
}

GovernanceAnalytics.propTypes = {
    /**
     * This is a reference to the Evergage dataset that should be used for this instance of the analytics component.
     * The evergage scripts will not be added if a dataset is not provided. I.e., this component won't do anything. Can be used to disable anlaytics.
     * Typically, this is set using app configuration.
     */
    dataset: PropTypes.string,

    /**
     * The current account ID for the current user
     */
    accountId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /**
     * The subdomain name for the current user
     */
    subdomainName: PropTypes.string,

    /**
     * The UID of the current user
     */
    currentUserId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /**
     * This is used to identify if the current user is an account admin
     */
    isAccountAdmin: PropTypes.bool,

    /**
     * This is used to identify if the current user is a realm admin
     */
    isRealmAdmin: PropTypes.bool,

    /**
     * This is used to identify if the current user is a CSR
     */
    isCSR: PropTypes.bool,

    /**
     * The total number of users contained in the grid
     */
    totalUsers: PropTypes.number,

    /**
     * The total number of paid users listed
     */
    paidUsers: PropTypes.number,

    /**
     * The total number of denied users listed
     */
    deniedUsers: PropTypes.number,

    /**
     * The total number of deactivated users listed
     */
    deactivatedUsers: PropTypes.number,

    /**
     * The total number of users in the realm directory
     */
    totalRealmUsers: PropTypes.number,

    /**
     * The time at which the page finishes rendering/re-rendering from the time the user hit the page
     */
    pageLoadTime: PropTypes.number,

    /**
     * The time at which the users grid finished rendering/re-rendering with data (including after searches)
     */
    usersGridLoadTime: PropTypes.number,

    /**
     * The time at which the users grid finished rendering/re-rendering with data (including after searches)
     */
    usersGridRefreshTime: PropTypes.number,

    /**
     * Flag used to identify if the page has completed an initial load
     */
    pageLoaded: PropTypes.bool
};

const mapStateToProps = (state) => {
    let account = state.RequestContext.account;
    let currentUser = state.RequestContext.currentUser;
    return {
        accountId: account.id,
        subdomainName: state.RequestContext.realm.name,
        currentUserId: currentUser.id,
        isAccountAdmin: currentUser.isAccountAdmin,
        isRealmAdmin: currentUser.isRealmAdmin,
        isCSR: currentUser.isCSR,
        totalUsers: _.get(state, 'Grids.accountUsers.pagination.totalItems', 0),
        paidUsers: getTotalPaidUsers(state),
        deniedUsers: getTotalDeniedUsers(state),
        deactivatedUsers: getTotalDeactivatedUsers(state),
        totalRealmUsers: getTotalRealmUsers(state),
        pageLoadTime: getPageLoadTime(state),
        usersGridLoadTime: getGridLoadTime(state),
        usersGridRefreshTime: getGridRefreshTime(state)
    };
};

export default connect(mapStateToProps)(GovernanceAnalytics);
