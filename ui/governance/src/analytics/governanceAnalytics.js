import React, {PropTypes, Component} from 'react';
import {connect} from "react-redux";
import {getTotalPaidUsers, getTotalDeniedUsers, getTotalDeactivatedUsers, getTotalRealmUsers} from "../../src/account/users/AccountUsersReducer";

// IMPORT FROM CLIENT REACT
import Logger from 'APP/utils/logger';
// IMPORT FROM CLIENT REACT

// The id for the script tag that is created when this component mounts
export const ANALYTICS_SCRIPT_ID = 'evergage';

// This will rarely, if ever, change. Therefore it is set as a variable here, rather than adding unnecessary keys to our configs.
export const EVERGAGE_ACCOUNT_NAME = 'intuitquickbase';


export class GovernanceAnalytics extends Component {

    constructor(props) {
        super(props);

        // Evergage requires a global variable called _aaq
        this._aaq = window._aaq || (window._aaq = []);

        // logger is set here so that unit test rewire will work
        this.logger = new Logger();

        this.listOfEvergageUpdateFunctions = [
            this.updateEvergageUser,
            this.updateEvergageAdminStatus,
            this.updateEvergageAccountAdminStatus,
            this.updateEvergageAccountId,
            this.updateEvergageSubdomainName,
            this.updateEvergageTotalItems,
            this.updateEvergagePaidUsers,
            this.updateEvergageDeniedUsers,
            this.updateEvergageTotalRealmUsers
        ];
    }

    /**
     * Setup script copied from the Evergage documentation.
     * Setup script available in Evergage Account -> Choose Dataset -> Settings -> Javascript
     * This setup creates a new script tag with the Evergage bundle and inserts it before the first script tag on the page.
     */
    setupEvergage = () => {
        if (document.getElementById(ANALYTICS_SCRIPT_ID)) {
            return this.logger.debug('Analytics script has already been loaded for this page. Will not load again.');
        }

        const analyticsScript = document.createElement('script');
        analyticsScript.id = ANALYTICS_SCRIPT_ID;
        analyticsScript.type = 'text/javascript';
        analyticsScript.defer = true;
        analyticsScript.async = true;
        analyticsScript.src = `${document.location.protocol}//cdn.evergage.com/beacon/${EVERGAGE_ACCOUNT_NAME}/${this.props.dataset}/scripts/evergage.min.js`;
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(analyticsScript, firstScript);
    };

    /**
     * Calls each of the functions that will update evergage when the props change.
     * Remember to add new update functions to `listOfEvergageUpdateFunctions` in the constructor.
     */
    updateEvergage = () => {
        this.listOfEvergageUpdateFunctions.forEach(updateFunction => updateFunction());
    };

    /**
     * Sets the currently logged in user to be tracked by Evergage
     */
    updateEvergageUser = () => {
        if (this.props.currentUserId) {
            this._aaq.push(['setUser', this.props.currentUserId]);
            this._aaq.push(['gReqUID', this.props.currentUserId]);
        }

        // if (this.props.email) {
        //     this._aaq.push(['gReqUserEmail', this.props.userEmail]);
        // }
    };

    /**
     * Sets the administrator status of the user in Evergage
     */
    updateEvergageAdminStatus = () => {
        if (_.has(this.props, 'isAdmin')) {
            this._aaq.push(['setCustomField', 'has_app_admin', this.props.isAdmin, 'request']);
        }
    };

    /**
     * Updates Evergage about whether the user is a realm admin
     */
    updateEvergageAccountAdminStatus = () => {
        if (this.props.currentUserId && _.has(this.props, 'isRealmAdmin')) {
            this._aaq.push(['setCustomField', 'is_realm_admin', this.props.isRealmAdmin, 'request']);
        }
    };

    /**
     * Updates the accountId tracked by Evergage
     */
    updateEvergageAccountId = () => {
        if (_.has(this.props, 'app.accountId')) {
            this._aaq.push(['setCompany', this.props.app.accountId]);
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
     * Updates the totalItems tracked by Evergage
     */
    updateEvergageTotalItems = () => {
        if (_.has(this.props, 'totalItems')) {
            this._aaq.push(['setCustomField', 'totalItems', this.props.totalItems, 'request']);
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
            this._aaq.push(['setCustomField', 'deniedUsers', this.props.paidUsers, 'request']);
        }
    };

    /**
     * Updates the totalRealmUsers tracked by Evergage
     */
    updateEvergageTotalRealmUsers = () => {
        if (_.has(this.props, 'totalRealmUsers')) {
            this._aaq.push(['setCustomField', 'totalRealmUsers', this.props.paidUsers, 'request']);
        }
    };

    /**
     * Tracks the current user and places the Evergage script on the page.
     */
    componentDidMount() {
        try {
            if (!this.props.dataset) {
                return this.logger.debug('Dataset was not provided to analytics component. Analytics have not been loaded.');
            }

            if (this.props.getLoggedInUser) {
                this.props.getLoggedInUser();
            }

            this.updateEvergage();
            this.setupEvergage();
        } catch (error) {
            this.logger.error('There was a problem loading analytics. ', error);
        }
    }

    /**
     * Removes the analytics script when the component unmounts
     */
    componentWillUnmount() {
        let analyticsScript = document.getElementById(ANALYTICS_SCRIPT_ID);
        if (analyticsScript) {
            analyticsScript.remove();
        }
    }

    /**
     * Update Everage with the changes to the props
     */
    componentDidUpdate() {
        this.updateEvergage();
    }

    // This component does not display anything.
    render() {
        return null;
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
    getLoggedInUser: PropTypes.func,

    /**
     * The current app. Allows analytics to get information about the current app like the id and account.
     */
    user: PropTypes.shape({
        accountId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        subdomainName: PropTypes.string,
        currentUserId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        // currentUserEmail: PropTypes.string,
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
        // currentUserEmail: getLoggedInUserEmail(state),
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
