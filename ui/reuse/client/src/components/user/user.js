import React, {PropTypes, Component} from 'react';
import Loader from 'react-loader';
import Locale from 'REUSE/locales/locale';

// IMPORTING FROM CLIENT REACT
import {INLINE_UPDATING} from 'APP/constants/spinnerConfigurations';
// IMPORTING FROM CLIENT REACT

/**
 * A simple User component that displays the name of the currently logged in user.
 * TODO: Word with XD to flesh out this component and use it in menus where the currently logged in user should be displayed
 */
export class User extends Component {
    componentDidMount() {
        if (this.props.getLoggedInUser) {
            this.props.getLoggedInUser();
        }
    }

    /**
     * Renders the user information
     * Includes a hidden div with a data attributes that can be targeted by javascript (e.g., to integrate with Evergage)
     * Data atributes include:
     * - data-user-id
     * - data-user-screen-name
     * - data-user-administrator
     */
    render() {
        const {isLoading, firstName, lastName, id, administrator, screenName} = this.props.user;

        return (
            <div className="user">
                <Loader loaded={!isLoading} {...INLINE_UPDATING}>
                    {id && <div className="userInfo">
                        <span className="hiddenUserInfo" data-user-id={id} />
                        <span className="userFirstName">{firstName} </span>
                        <span className="userLastName">{lastName} </span>
                        <span className="userScreenName">({screenName})</span>
                    </div>}

                    {!id && <div className="user notLoggedIn">{Locale.getMessage('user.notLoggedIn')}</div>}
                </Loader>
            </div>
        );
    }
}

User.propTypes = {
    /**
     * Must pass in a user object.
     * Typically, this object is passed in as a prop from the user redux store. */
    user: PropTypes.shape({
        /**
         * Indicates whether or not the user data is loading */
        isLoading: PropTypes.bool,

        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        administrator: PropTypes.bool,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        screeName: PropTypes.string
    }).isRequired,

    /**
     * Optionally pass in a method to load the currently logged in user
     * Typically, this comes from connecting a redux action. */
    getLoggedInUser: PropTypes.func
};

User.defaultProps = {
    user: {}
};


export default User;
