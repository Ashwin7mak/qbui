import React from 'react';
import AVAILABLE_ICON_FONTS from '../../constants/iconConstants';
import './qbIcon.scss';
import './style.css';
import './tableIcons.css';

/**
 * # QuickBase Icon Font
 * An icon using a new qb icon font (from Lisa)
 * ## Usage
 * ```
 *   <QBicon icon="accessibility" />
 * ```
 */
const QBicon = React.createClass({
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
        let qbIconClassName = `${className} qbIcon ${iconFont}-${icon}`;

        return (
            <span className={qbIconClassName} onClick={this.props.onClick}>
                {this.props.children}
            </span>
        );
    }
});

export default QBicon;
