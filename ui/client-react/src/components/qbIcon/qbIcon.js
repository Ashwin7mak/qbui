import React from 'react';
import './qbIcon.scss';
import './style.css';
import './tableIcons.css';

export const AVAILABLE_FONTS = {
    DEFAULT: 'iconTableUISturdy',
    UI_STURDY: 'iconTableUISturdy',
    TABLE_STURDY: 'iconTableSturdy'
};

/**
 * # QuickBase Icon Font
 * An icon using a new qb icon font (from Lisa)
 * ## Usage
 * ```
 *   <QBicon icon="accessibility" />
 * ```
 */
const QbIcon = React.createClass({
    propTypes: {
        /**
         * See QuickBase.design for full list of icons.
         */
        icon: React.PropTypes.string.isRequired,
        className: React.PropTypes.string,
        onClick: React.PropTypes.func,

        /**
         * Optionally set the font set to use for this icon
         * Import the AVAILABLE_FONTS constant for easy access to which fonts are available
         * `import QbIcon, {AVAILABLE_FONTS} from './qbIcon';
         */
        iconFont: React.PropTypes.oneOf(Object.keys(AVAILABLE_FONTS).map(key => AVAILABLE_FONTS[key])),
    },
    getDefaultProps() {
        return {
            className: '',
            isTableIcon: false,
            iconFont: AVAILABLE_FONTS.DEFAULT
        };
    },
    render: function() {
        let {className, iconFont, icon} = this.props;
        let qbIconClassName = `${className} qbIcon ${iconFont}-${icon}`;

        return (
            <span className={qbIconClassName} onClick={this.props.onClick}>
                {this.props.children}
            </span>
        );
    }
});

export default QbIcon;
