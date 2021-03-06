import React from 'react';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

/**
 * # UserFieldValueRenderer
 *
 * A UserFieldValueRenderer is a read only rendering of the field containing a user
 *
 */
const UserFieldValueRenderer = React.createClass({
    displayName: 'UserFieldValueRenderer',

    propTypes: {
        /**
         * the label to display
         */
        display: React.PropTypes.string,
        /**
         * the user object
         */
        value: React.PropTypes.shape({
            screenName: React.PropTypes.string,
            email: React.PropTypes.string
        })
    },

    /**
     * render the user display name with a tooltip containing screen name and/or email
     */
    render() {

        if (this.props.value && (this.props.value.screenName || this.props.value.email)) {

            // we have info to place in a tooltip
            const tooltip = (
                <Tooltip id="tooltip" className="tipUserFieldValue" style={{"whiteSpace":"nowrap"}} >
                    {this.props.value && this.props.value.screenName && <div className="tipScreenName">User Name: {this.props.value.screenName}</div>}
                    {this.props.value && this.props.value.email && <div className="tipEmail">Email: {this.props.value.email}</div>}
                </Tooltip>
            );

            return (
                <OverlayTrigger placement="top" overlay={tooltip} >
                    <div className="userDisplayValue">{this.props.display}</div>
                </OverlayTrigger>);
        }

        return <div className="userDisplayValue">{this.props.display}</div>;
    }
});

export default UserFieldValueRenderer;
