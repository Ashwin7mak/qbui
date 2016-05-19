import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

const ToolTipWrapper = React.createClass({

    toolTipIt(tooltipId, plainMessage, i18nMessageKey) {
        let label = plainMessage ? plainMessage : '...';
        if (i18nMessageKey) {
            label = (<I18nMessage message={i18nMessageKey}/>);
        }
        return (
            <Tooltip className={tooltipId + "tooltip"} id={tooltipId}>{label}</Tooltip>
        );
    },

    render() {
        //this.props contains
        //tipId, msg, i18nMsg, location
        let itemTip = this.toolTipIt(this.props.tipId, this.props.plainMessage, this.props.i18nMessageKey);
        return (
            <OverlayTrigger placement={this.props.location ? this.props.location : "top"} overlay={itemTip}>
                    {this.props.children}
            </OverlayTrigger>
        );
    }
});

export default ToolTipWrapper;

