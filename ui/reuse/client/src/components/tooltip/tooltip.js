import React from 'react';
import {I18nMessage} from '../../../../../client-react/src/utils/i18nMessage';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import BsToolTip from 'react-bootstrap/lib/Tooltip';
import _ from 'lodash';
import './tooltip.scss';

const Tooltip = React.createClass({
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
    defaultDelayShow: 300,

    toolTipIt(tooltipId, plainMessage, i18nMessageKey) {
        let label = plainMessage ? plainMessage : '';
        if (i18nMessageKey) {
            label = (<I18nMessage message={i18nMessageKey} {...this.props}/>);
        }
        let tipClassName = tooltipId ? "qbtooltip " + tooltipId : " qbtooltip";
        return (
            <BsToolTip className={tipClassName} id={_.uniqueId("qbtooltip_")} >{label}</BsToolTip>
        );
    },

    render() {
        let itemTip = this.toolTipIt(this.props.tipId, this.props.plainMessage, this.props.i18nMessageKey);
        let startDelay = this.props.delayShow ? this.props.delayShow : this.defaultDelayShow;
        return (
            <OverlayTrigger rootClose={true} placement={this.props.location ? this.props.location : "top"} overlay={itemTip} delayShow={startDelay} {...this.props}>
                <div className="tipChildWrapper">
                    {this.props.children}
                </div>
            </OverlayTrigger>
        );
    }
});

export default Tooltip;

