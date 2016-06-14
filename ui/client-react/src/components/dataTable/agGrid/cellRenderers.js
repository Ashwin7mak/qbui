import React from 'react';

import {I18nNumber} from '../../../utils/i18nMessage';

/**
 * placeholder for rendering users
 */
export const UserCellRenderer = React.createClass({

    propTypes: {
        value: React.PropTypes.string
    },

    render() {
        return <div className="userCell">{this.props.value}</div>;
    }
});

export const NumberCellRenderer = React.createClass({

    propTypes: {
        value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])
    },

    render() {
        return <div className="numberCell"><I18nNumber value={this.props.value}></I18nNumber></div>;
    }
});

export const DateCellRenderer = React.createClass({

    propTypes: {
        value: React.PropTypes.string
    },

    render() {
        return <div className="dateCell">{this.props.value}</div>;
    }
});

export const TextCellRenderer = React.createClass({

    propTypes: {
        value: React.PropTypes.string
    },

    render() {
        return <div className="textCell">{this.props.value}</div>;
    }
});
