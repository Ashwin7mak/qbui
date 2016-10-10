import React from 'react';
import './qbIcon.scss';
import './style.scss';

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
        onClick: React.PropTypes.func
    },
    getDefaultProps() {
        return {
            className: ""
        };
    },
    render: function() {
        let className = this.props.className + ' qbIcon iconTableUISturdy-' + this.props.icon;

        return (
            <span className={className} onClick={this.props.onClick}>
                {this.props.children}
            </span>
        );
    }
});

export default QBicon;

