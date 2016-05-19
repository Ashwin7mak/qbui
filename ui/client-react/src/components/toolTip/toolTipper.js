import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

const QBToolTipWrapper = React.createClass({
    propTypes: {
        // optional name to use in classname
        tipId:  React.PropTypes.string,
        //message to render use if string has already been localized
        plainMessage:  React.PropTypes.string,
        //messageId to lookup in resource bundle for message to render pass in plainMessage
        // or i18nMessageKey. i18nMessageKey will render if both are supplied
        i18nMessageKey:  React.PropTypes.string,
        // override the default delay millisecond s for tooltip help
        delayShow: React.PropTypes.number // options
    },
    defaultDelayShow: 500,

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
        let itemTip = this.toolTipIt(this.props.tipId, this.props.plainMessage, this.props.i18nMessageKey);
        let startDelay = this.props.delayShow ? this.props.delayShow : this.defaultDelayShow;
        return (
            <OverlayTrigger placement={this.props.location ? this.props.location : "top"} overlay={itemTip} delayShow={startDelay}>
                    {this.props.children}
            </OverlayTrigger>
        );
    }
});

export default QBToolTipWrapper;

