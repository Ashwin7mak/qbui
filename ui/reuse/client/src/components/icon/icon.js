import React from 'react';
import QBToolTip from '../../../../../client-react/src/components/qbToolTip/qbToolTip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import './icon.scss';
import './uiIcons.css';
import './tableIcons.css';

/**
 * Constants for accessing different icon fonts
 */
export const AVAILABLE_ICON_FONTS = {
    DEFAULT: 'iconUISturdy',
    UI_STURDY: 'iconUISturdy',
    TABLE_STURDY: 'iconTableSturdy'
};

/**
 * # QuickBase Icon Font
 * An icon using a new qb icon font (from Lisa)
 * ## Usage
 * ```
 *   <Icon icon="accessibility" />
 * ```
 */
const Icon = React.createClass({
    propTypes: {
        /**
         * See QuickBase.design for full list of icons.
         */
        icon: React.PropTypes.string.isRequired,
        className: React.PropTypes.string,
        onClick: React.PropTypes.func,
        /**
         * A tooltip string title for icon in icon chooser
         */
        tooltipTitle: React.PropTypes.string,

        /**
         * Optionally set the font set to use for this icon
         * Import the iconConstants.AVAILABLE_ICON_FONTS constant for easy access to available fonts
         */
        iconFont: React.PropTypes.oneOf(Object.keys(AVAILABLE_ICON_FONTS).map(key => AVAILABLE_ICON_FONTS[key])),
    },
    getDefaultProps() {
        return {
            className: '',
            isTableIcon: false,
            tooltipTitle: '',
            iconFont: AVAILABLE_ICON_FONTS.DEFAULT
        };
    },
    render: function() {
        let {className, iconFont, icon} = this.props;
        let iconClassName = `${className} qbIcon ${iconFont}-${icon}`;
        return (this.props.tooltipTitle ?
            <QBToolTip location="bottom" tipId="toolTipTitle" className="toolTip-iconChooser" plainMessage={this.props.tooltipTitle}>
                <span className={iconClassName} onClick={this.props.onClick}>
                {this.props.children}
                </span>
            </QBToolTip> :
            <span className={iconClassName} onClick={this.props.onClick}>
                {this.props.children}
            </span>
        );
    }
});

export default Icon;
