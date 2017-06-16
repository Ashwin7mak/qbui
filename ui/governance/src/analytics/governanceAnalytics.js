import React, {PropTypes, Component} from 'react';
import {connect} from "react-redux";
import {getTotalPaidUsers, getTotalDeniedUsers, getTotalDeactivatedUsers, getTotalRealmUsers} from "../../src/account/users/AccountUsersReducer";
import Analytics from "../../../reuse/client/src/components/analytics/analytics";
import Config from '../../../client-react/src/config/app.config';


export class GovernanceAnalytics extends Component {
    // Evergage requires a global variable called _aaq
    _aaq = window._aaq || (window._aaq = []);

    /**
     * Updates Evergage about whether the user is a realm admin
     */
    updateEvergageRealmAdminStatus = () => {
        if (this.props.currentUserId && _.has(this.props, 'isRealmAdmin')) {
            _aaq.push(['setCustomField', 'is_realm_admin', this.props.isRealmAdmin, 'request']);
        }
    };

    // /**
    //  * Updates the accountId tracked by Evergage
    //  */
    // updateEvergageAccountId = () => {
    //     if (_.has(this.props, 'accountId')) {
    //         this._aaq.push(['setCompany', this.props.accountId]);
    //     }
    // };

    /**
     * Updates the subdomain name tracked by Evergage
     */
    updateEvergageSubdomainName = () => {
        if (_.has(this.props, 'subdomainName')) {
            _aaq.push(['setCustomField', 'subdomainName', this.props.subdomainName, 'request']);
        }
    };

    /**
     * Updates the totalItems tracked by Evergage
     */
    updateEvergageTotalItems = () => {
        if (_.has(this.props, 'totalItems')) {
            _aaq.push(['setCustomField', 'totalItems', this.props.totalItems, 'request']);
        }
    };

    /**
     * Updates the paidUsers tracked by Evergage
     */
    updateEvergagePaidUsers = () => {
        if (_.has(this.props, 'paidUsers')) {
            _aaq.push(['setCustomField', 'paidUsers', this.props.paidUsers, 'request']);
        }
    };

    /**
     * Updates the deniedUsers tracked by Evergage
     */
    updateEvergageDeniedUsers = () => {
        if (_.has(this.props, 'deniedUsers')) {
            _aaq.push(['setCustomField', 'deniedUsers', this.props.paidUsers, 'request']);
        }
    };

    /**
     * Updates the totalRealmUsers tracked by Evergage
     */
    updateEvergageTotalRealmUsers = () => {
        if (_.has(this.props, 'totalRealmUsers')) {
            _aaq.push(['setCustomField', 'totalRealmUsers', this.props.paidUsers, 'request']);
        }
    };

    governanceUpdateFunctions = [
        this.updateEvergageRealmAdminStatus,
        this.updateEvergageSubdomainName,
        this.updateEvergageTotalItems,
        this.updateEvergagePaidUsers,
        this.updateEvergageDeniedUsers,
        this.updateEvergageTotalRealmUsers
    ];

    // This component does not display anything.
    render() {
        return (
            <Analytics dataset={Config.evergageDataset}
                       // userId={null}
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
     * A method used to obtain the userId
     * Typically this is a redux action. See pre-made actions in reuse/client/src/components/user.
     */
    // getLoggedInUser: PropTypes.func,

    /**
     * The current app. Allows analytics to get information about the current app like the id and account.
     */
    user: PropTypes.shape({
        accountId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        subdomainName: PropTypes.string,
        currentUserId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        isAdmin: PropTypes.boolean,
        isRealmAdmin: PropTypes.boolean,
        totalItems: PropTypes.number,
        paidUsers: PropTypes.number,
        deniedUsers: PropTypes.number,
        deactivatedUsers: PropTypes.number,
        totalRealmUsers: PropTypes.number
    })
};

const mapStateToProps = (state) => {
    let account = state.RequestContext.account;
    let currentUser = state.RequestContext.currentUser;
    return {
        accountId: account.id,
        subdomainName: state.RequestContext.realm.name,
        currentUserId: currentUser.id,
        isAdmin: currentUser.isAccountAdmin,
        isRealmAdmin: currentUser.isRealmAdmin,
        totalItems: _.get(state, 'Grids.accountUsers.pagination.totalItems', 0),
        paidUsers: getTotalPaidUsers(state),
        deniedUsers: getTotalDeniedUsers(state),
        deactivatedUsers: getTotalDeactivatedUsers(state),
        totalRealmUsers: getTotalRealmUsers(state)
    };
};

export default connect(mapStateToProps)(GovernanceAnalytics);
