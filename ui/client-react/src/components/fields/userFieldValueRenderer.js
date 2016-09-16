import React from 'react';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

const UserFieldValueRenderer = React.createClass({
    displayName: 'UserFieldValueRenderer',

    propTypes: {
        display: React.PropTypes.string,
        value: React.PropTypes.object
    },

    render() {

        if (this.props.value && (this.props.value.screenName || this.props.value.email)) {

            const tooltip = (
                <Tooltip id="tooltip" style={{"whiteSpace":"nowrap"}} >
                    {this.props.value && this.props.value.screenName && <div>User Name: {this.props.value.screenName}</div>}
                    {this.props.value && this.props.value.email && <div>Email: {this.props.value.email}</div>}
                </Tooltip>
            );

            return (
                <OverlayTrigger className="userCell data" placement="top" overlay={tooltip}>
                    <div>{this.props.display}</div>
                </OverlayTrigger>);
        }

        return <div className="userCell data" >{this.props.display}</div>;
    }
});

export default UserFieldValueRenderer;
