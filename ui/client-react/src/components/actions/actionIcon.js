import React from 'react';
import QBicon from '../qbIcon/qbIcon';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

/**
 * an action icon link with a tooltip (icon is from quickbase icon font)
 */
let ActionIcon = React.createClass({

    propTypes: {
        tip: React.PropTypes.string,
        icon: React.PropTypes.string.isRequired,
        bsStyle: React.PropTypes.string,
        onClick: React.PropTypes.func,
        disabled: React.PropTypes.bool
    },

    render() {

        const tooltip = <Tooltip id={this.props.tip} positionTop={22}>{this.props.tip}</Tooltip>;

        return (
            <OverlayTrigger placement="top" overlay={tooltip} trigger={['hover', 'click']}>
                <a href="#" className={"iconLink icon-" + this.props.icon} onClick={this.props.onClick} disabled={this.props.disabled}>
                    <QBicon className={this.props.disabled ? "disabled" : ""} icon={this.props.icon}/>
                </a>
            </OverlayTrigger>);

    }
});

export default ActionIcon;
