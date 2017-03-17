import React from 'react';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import BsToolTip from 'react-bootstrap/lib/Tooltip';
import _ from 'lodash';
import './tooltip.scss';

// CLIENT REACT IMPORT
import {I18nMessage} from '../../../../../client-react/src/utils/i18nMessage';
// CLIENT REACT IMPORT

const Tooltip = React.createClass({
    propTypes: {
        /**
         * Added to the classes on the tooltip */
        tipId:  React.PropTypes.string,

        /**
         * Message to render in the tooltip. Use this prop if string has already been localized. */
        plainMessage:  React.PropTypes.string,

        /**
         * The i18nMessage key to lookup in the current language bundle.
         * i18nMessageKey will be rendered instead of plainMessage if an i18nMessageKey if both props are passed in */
        i18nMessageKey:  React.PropTypes.string,

        /**
         * Override the default delay in milliseconds for tooltip help.
         * Recommend using default to maintain consistency between tooltips across the qbase ecosystem. */
        delayShow: React.PropTypes.number,

        /**
         * Where the tooltip displays relative to the child elements */
        location: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
    },

    getDefaultProps() {
        return {
            defaultDelayShow: 300,
            location: 'top'
        };
    },

    toolTipIt(tooltipId, plainMessage, i18nMessageKey) {
        let label = plainMessage ? plainMessage : '';

        if (i18nMessageKey) {
            label = (<I18nMessage message={i18nMessageKey} {...this.props}/>);
        }

        let tipClassName = tooltipId ? `qbtooltip  ${tooltipId}` : 'qbtooltip';

        return (
            <BsToolTip className={tipClassName} id={_.uniqueId('qbtooltip_')} >{label}</BsToolTip>
        );
    },

    render() {
        let itemTip = this.toolTipIt(this.props.tipId, this.props.plainMessage, this.props.i18nMessageKey);

        return (
            <OverlayTrigger rootClose={true} placement={this.props.location} overlay={itemTip} delayShow={this.props.delayShow} {...this.props}>
                <div className="tipChildWrapper">
                    {this.props.children}
                </div>
            </OverlayTrigger>
        );
    }
});

export default Tooltip;
