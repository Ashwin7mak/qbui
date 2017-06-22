import React, {PropTypes, Component} from 'react';
import {connect} from "react-redux";
import {getTotalPaidUsers, getTotalDeniedUsers, getTotalDeactivatedUsers, getTotalRealmUsers} from "../../src/account/users/AccountUsersReducer";
import {Analytics} from "../../../reuse/client/src/components/analytics/analytics";
import Config from '../../../client-react/src/config/app.config';
import {getPageLoadTime, getGridLoadTime} from "../analytics/performanceTimingReducer";

export class GovernanceAnalytics extends Component {
    // Evergage requires a global variable called _aaq
    _aaq = window._aaq || (window._aaq = []);

    /**
     * Updates Evergage about the account ID of the user
     */
    updateEvergageAccountID = () => {
        if (_.has(this.props, 'accountId')) {
            this._aaq.push(['setCustomField', 'accountId', this.props.accountId, 'request']);
        }
    };

    /**
     * Updates Evergage about whether the user is an Account admin
     */
    updateEvergageAccountAdminStatus = () => {
        if (this.props.currentUserId && _.has(this.props, 'isAccountAdmin')) {
            this._aaq.push(['setCustomField', 'has_account_admin', this.props.isAccountAdmin, 'request']);
        }
    };

    /**
     * Updates Evergage about whether the user is a realm admin
     */
    updateEvergageRealmAdminStatus = () => {
        if (this.props.currentUserId && _.has(this.props, 'isRealmAdmin')) {
            this._aaq.push(['setCustomField', 'is_realm_admin', this.props.isRealmAdmin, 'request']);
        }
    };

    /**
     * Updates Evergage about whether the user is a CSR
     */
    updateEvergageCSRStatus = () => {
        if (this.props.currentUserId && _.has(this.props, 'isCSR')) {
            this._aaq.push(['setCustomField', 'is_CSR', this.props.isCSR, 'request']);
        }
    };

    /**
     * Updates the subdomain name tracked by Evergage
     */
    updateEvergageSubdomainName = () => {
        if (_.has(this.props, 'subdomainName')) {
            this._aaq.push(['setCustomField', 'subdomainName', this.props.subdomainName, 'request']);
        }
    };

    /**
     * Updates the totalUsers tracked by Evergage
     */
    updateEvergageTotalUsers = () => {
        if (_.has(this.props, 'totalUsers')) {
            this._aaq.push(['setCustomField', 'totalUsers', this.props.totalUsers, 'request']);
        }
    };

    /**
     * Updates the paidUsers tracked by Evergage
     */
    updateEvergagePaidUsers = () => {
        if (_.has(this.props, 'paidUsers')) {
            this._aaq.push(['setCustomField', 'paidUsers', this.props.paidUsers, 'request']);
        }
    };

    /**
     * Updates the deniedUsers tracked by Evergage
     */
    updateEvergageDeniedUsers = () => {
        if (_.has(this.props, 'deniedUsers')) {
            this._aaq.push(['setCustomField', 'deniedUsers', this.props.deniedUsers, 'request']);
        }
    };

    /**
     * Updates the totalRealmUsers tracked by Evergage
     */
    updateEvergageTotalRealmUsers = () => {
        if (_.has(this.props, 'totalRealmUsers')) {
            this._aaq.push(['setCustomField', 'totalRealmUsers', this.props.totalRealmUsers, 'request']);
        }
    };

    /**
     * Gets the total time taken from page load to fetching grid data
     */
    updateEvergagePageLoadTime = () => {
        if (_.has(this.props, 'pageLoadTime')) {
            this._aaq.push(['setCustomField', 'pageLoadTime', this.props.pageLoadTime, 'request']);
        }
    };

    /**
     * Gets the total time taken from grid load to fetching grid data
     */
    updateEvergageTotalGridTimeTaken = () => {
        if (_.has(this.props, 'gridLoadTime')) {
            this._aaq.push(['setCustomField', 'totalGridLoadTime', this.props.gridLoadTime, 'request']);
        }
    };

    governanceUpdateFunctions = [
        this.updateEvergageAccountID,
        this.updateEvergageAccountAdminStatus,
        this.updateEvergageRealmAdminStatus,
        this.updateEvergageCSRStatus,
        this.updateEvergageSubdomainName,
        this.updateEvergageTotalUsers,
        this.updateEvergagePaidUsers,
        this.updateEvergageDeniedUsers,
        this.updateEvergageTotalRealmUsers,
        this.updateEvergagePageLoadTime,
        this.updateEvergageTotalGridTimeTaken
    ];

    render() {
        return (
            <Analytics dataset={Config.evergageDataset}
                       userId={this.props.currentUserId}
                       accountId={this.props.accountId}
                       subdomainName={this.props.subdomainName}
                       isAccountAdmin={this.props.isAccountAdmin}
                       isRealmAdmin={this.props.isRealmAdmin}
                       isCSR={this.props.isCSR}
                       totalUsers={this.props.totalUsers}
                       paidUsers={this.props.paidUsers}
                       deniedUsers={this.props.deniedUsers}
                       deactivatedUsers={this.props.deactivatedUsers}
                       totalRealmUsers={this.props.totalRealmUsers}
                       pageLoadTime={this.props.pageLoadTime}
                       gridLoadTime={this.props.gridLoadTime}
                       additionalUpdateFunctions={this.governanceUpdateFunctions} />
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
     * The total time taken for the page to load until the grid is fully loaded
     */
    pageLoadTime: PropTypes.number,

    /**
     * The total time for the grid to load
     */
    gridLoadTime: PropTypes.number

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
        gridLoadTime: getGridLoadTime(state)
    };
};

export default connect(mapStateToProps)(GovernanceAnalytics);
