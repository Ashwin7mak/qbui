import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import _ from 'lodash';
import './qbToolTip.scss';

const QBToolTip = React.createClass({
    propTypes: {
        // optional name to use in classname
        tipId:  React.PropTypes.string,
        //message to render use if string has already been localized
        plainMessage:  React.PropTypes.string,
        //messageId to lookup in resource bundle for message to render pass in plainMessage
        // or i18nMessageKey. i18nMessageKey will render if both are supplied
        i18nMessageKey:  React.PropTypes.string,
        // override the default delay millisecond s for tooltip help
        delayShow: React.PropTypes.number, // options

        /**
         * The location of the tooltip relative the the wrapped component */
        location: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
    },

    defaultProps: {
        location: 'top'
    },

    defaultDelayShow: 300,

    toolTipIt(tooltipId, plainMessage, i18nMessageKey) {
        let label = plainMessage ? plainMessage : '';
        if (i18nMessageKey) {
            label = (<I18nMessage message={i18nMessageKey} {...this.props}/>);
        }
        let tipClassName = tooltipId ? "qbtooltip " + tooltipId : " qbtooltip";
        return (
            <Tooltip className={tipClassName} id={_.uniqueId("qbtooltip_")} >{label}</Tooltip>
        );
    },

    render() {
        let itemTip = this.toolTipIt(this.props.tipId, this.props.plainMessage, this.props.i18nMessageKey);
        let startDelay = this.props.delayShow ? this.props.delayShow : this.defaultDelayShow;
        return (
            <OverlayTrigger rootClose={true} placement={this.props.location} overlay={itemTip} delayShow={startDelay} {...this.props}>
                <div className="tipChildWrapper">
                    {this.props.children}
                </div>
            </OverlayTrigger>
        );
    }
});

export default QBToolTip;

