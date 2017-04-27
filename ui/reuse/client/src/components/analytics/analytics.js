import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {getLoggedInUserId} from '../user/userReducer';
import {getLoggedInUser} from '../user/userActions';

// IMPORT FROM CLIENT REACT
import Logger from '../../../../../client-react/src/utils/logger';
// IMPORT FROM CLIENT REACT

// Evergage requires a global variable called _aaq to function
let _aaq = window._aaq || (window._aaq = []);

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

        // logger is set here so that unit test rewire will work
        this.logger = new Logger();
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
     * Sets the currently logged in user to be tracked by Evergage
     */
    updateEvergageUser = (userId = null) => {
        if (userId || this.props.userId) {
            _aaq.push(['setUser', userId || this.props.userId]);
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

            this.updateEvergageUser();
            this.setupEvergage();
        } catch (error) {
            this.logger.error('There was a problem loading analytics. ', error);
        }
    }

    /**
     * Removes the analytics script when the component unmounts
     */
    componentWillUnmount() {
        document.getElementById(ANALYTICS_SCRIPT_ID).remove();
    }

    /**
     * Update the Evergage user if it has changed since the last update
     * @param prevProps
     */
    componentWillUpdate(nextProps) {
        if (nextProps.userId !== this.props.userId) {
            this.updateEvergageUser(nextProps.userId);
        }
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
     * Typically this is passed as a prop from Redux
     */
    userId: PropTypes.string,

    /**
     * A method used to obtain the userId
     * Typically this is a redux action. See pre-made actions in reuse/client/src/components/user.
     */
    getLoggedInUser: PropTypes.func
};

const mapStateToProps = state => ({userId: getLoggedInUserId(state)});

export default connect(mapStateToProps, {getLoggedInUser})(Analytics);
