import React from 'react';
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
         * Optionally set the font set to use for this icon
         * Import the iconConstants.AVAILABLE_ICON_FONTS constant for easy access to available fonts
         */
        iconFont: React.PropTypes.oneOf(Object.keys(AVAILABLE_ICON_FONTS).map(key => AVAILABLE_ICON_FONTS[key])),
    },
    getDefaultProps() {
        return {
            className: '',
            isTableIcon: false,
            iconFont: AVAILABLE_ICON_FONTS.DEFAULT
        };
    },
    render: function() {
        let {className, iconFont, icon} = this.props;
        let iconClassName = `${className} qbIcon ${iconFont}-${icon}`;

        return (
            <span className={iconClassName} onClick={this.props.onClick}>
                {this.props.children}
            </span>
        );
    }
});

export default Icon;
