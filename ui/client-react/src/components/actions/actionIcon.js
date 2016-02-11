import React from 'react';

import QBicon from '../qbIcon/qbIcon';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

/**
 * an action icon link with a tooltip (icon is from quickbase icon font)
 */
let ActionIcon = React.createClass({

    defaultProps: {
        bsRole: ""
    },

    propTypes: {
        tip:React.PropTypes.string,
        icon:React.PropTypes.string.isRequired,
        bsStyle:React.PropTypes.string,
        onClick:React.PropTypes.func
    },

    render() {

        const tooltip = <Tooltip id={this.props.tip} positionTop={22}>{this.props.tip}</Tooltip>;

        return (
            <OverlayTrigger placement="top" overlay={tooltip}>
                <a href="#" className={"iconLink icon-" + this.props.icon} onClick={this.props.onClick} bsStyle={this.props.bsRole}>
                    <QBicon icon={this.props.icon}/>
                </a>
            </OverlayTrigger>);

    }
});

export default ActionIcon;
