import React from 'react';
import './reIcon.scss';
import './style.css';
import './tableIcons.css';

/**
 * Constants for accessing different icon fonts
 */
export const RE_AVAILABLE_ICON_FONTS = {
    DEFAULT: 'iconTableUISturdy',
    UI_STURDY: 'iconTableUISturdy',
    TABLE_STURDY: 'iconTableSturdy'
};

/**
 * # QuickBase Icon Font
 * An icon using a new qb icon font (from Lisa)
 * ## Usage
 * ```
 *   <ReIcon icon="accessibility" />
 * ```
 */
const ReIcon = React.createClass({
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
        iconFont: React.PropTypes.oneOf(Object.keys(RE_AVAILABLE_ICON_FONTS).map(key => RE_AVAILABLE_ICON_FONTS[key])),
    },
    getDefaultProps() {
        return {
            className: '',
            isTableIcon: false,
            iconFont: RE_AVAILABLE_ICON_FONTS.DEFAULT
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

export default ReIcon;
