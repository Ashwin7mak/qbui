import React, {PropTypes, Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {getLoggedInUserId, getLoggedInUserAdminStatus} from 'REUSE/reducers/userReducer';
import {getLoggedInUser} from 'REUSE/actions/userActions';

// IMPORT FROM CLIENT REACT
import Logger from 'APP/utils/logger';
// IMPORT FROM CLIENT REACT

// The id for the script tag that is created when this component mounts
export const ANALYTICS_SCRIPT_ID = 'evergage';

// This will rarely, if ever, change. Therefore it is set as a variable here, rather than adding unnecessary keys to our configs.
export const EVERGAGE_ACCOUNT_NAME = 'intuitquickbase';

/**
 * Currently we use Evergage for analytics. Use the component once per functional area to setup tracking.
 * NOTE: For best use of this component, be sure to add the user reducer to your root reducer. See reducer in reuse/client/src/components/user
 *
 * TODO: Create <AnalyticsEvent> component to track individual events when props change.
 * TODO: Place behind a feature switch once feature switches are fully implemented.
 */
export class Analytics extends Component {
    constructor(props) {
        super(props);

        // Evergage requires a global variable called _aaq
        this._aaq = window._aaq || (window._aaq = []);

        // logger is set here so that unit test rewire will work
        this.logger = new Logger();

        this.listOfEvergageUpdateFunctions = [
            this.updateEvergageUser,
            this.updateEvergageAdminStatus,
            this.updateAppManagerStatus,
            this.updateEvergageAccountId,
            this.updateEverageAppId,
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
        if (this.props.userId) {
            this._aaq.push(['setUser', this.props.userId]);
            this._aaq.push(['gReqUID', this.props.userId]);
        }

        if (this.props.email) {
            this._aaq.push(['gReqUserEmail', this.props.userEmail]);
        }
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
     * Updates Evergage about whether the user is the manager for the current app
     */
    updateAppManagerStatus = () => {
        if (this.props.userId && _.has(this.props, 'app.ownerId')) {
            const isAppManager = (this.props.userId === this.props.app.ownerId);
            this._aaq.push(['setCustomField', 'is_app_mgr', isAppManager, 'request']);
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
     * Updates the app id tracked by Evergage.
     */
    updateEverageAppId = () => {
        if (_.has(this.props, 'app.id')) {
            this._aaq.push(['setCustomField', 'appid', this.props.app.id, 'request']);
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

Analytics.propTypes = {
    /**
     * This is a reference to the Evergage dataset that should be used for this instance of the analytics component.
     * The evergage scripts will not be added if a dataset is not provided. I.e., this component won't do anything. Can be used to disable anlaytics.
     * Typically, this is set using app configuration.
     */
    dataset: PropTypes.string,

    /**
     * The id of the currently logged in user to be used with Evergage.
     * Typically this is passed as a prop from Redux (user reducer)
     */
    userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /**
     * The email of the currently logged in user to be used with Evergage.
     * Typically this is passed as a prop from Redux (user reducer)
     */
    userEmail: PropTypes.string,

    /**
     * Boolean indicating whether the current user is an admin.
     * Typically this is passed as a prop from Redux (user reducer)
     */
    isAdmin: PropTypes.bool,

    /**
     * A method used to obtain the userId
     * Typically this is a redux action. See pre-made actions in reuse/client/src/components/user.
     */
    getLoggedInUser: PropTypes.func,

    /**
     * The current app. Allows analytics to get information about the current app like the id and account.
     */
    app: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        ownerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        accountId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    })
};

const mapStateToProps = state => ({userId: getLoggedInUserId(state), isAdmin: getLoggedInUserAdminStatus(state)});

export default connect(mapStateToProps, {getLoggedInUser})(Analytics);
