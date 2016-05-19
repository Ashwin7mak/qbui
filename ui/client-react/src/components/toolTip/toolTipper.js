import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

const QBToolTipWrapper = React.createClass({
    propTypes: {
        tipId:  React.PropTypes.string, // optional name to use in classname; 
        plainMessage:  React.PropTypes.string, //message to render use if string has already been localized
        i18nMessageKey:  React.PropTypes.string, //messageId to lookup in resource bundle for message to render
    },

    toolTipIt(tooltipId, plainMessage, i18nMessageKey) {
        let label = plainMessage ? plainMessage : '...';
        if (i18nMessageKey) {
            label = (<I18nMessage message={i18nMessageKey}/>);
        }
        let tipClassName = tooltipId ? "qbtooltip " + tooltipId : " qbtooltip";
        return (
            <Tooltip className={tipClassName}>{label}</Tooltip>
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

export default QBToolTipWrapper;

