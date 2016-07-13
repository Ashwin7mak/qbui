import React from 'react';

import {I18nNumber} from '../../../utils/i18nMessage';
import * as formats from '../../../constants/fieldFormats';

export const CellValueRenderer = React.createClass({

    propTypes: {
        display: React.PropTypes.any,
        value: React.PropTypes.any,
        attributes: React.PropTypes.object,
        isEditable : React.PropTypes.bool
    },

    render() {
        let className = "cellData" + (this.props.isEditable ? "" : " nonEditable cellEdit");
        switch (this.props.type) {
        case formats.NUMBER_FORMAT:
        case formats.RATING_FORMAT:
            return (<span className={className}>
                {this.props.value && <NumberCellValueRenderer value={this.props.value} attributes={this.props.attributes} />}
                </span>);

        case formats.USER_FORMAT:
            return (<span className={className}>
                <UserCellValueRenderer value={this.props.display} />
                </span>);

        case formats.DATE_FORMAT:
            return (<span className={className}>
                <DateCellValueRenderer value={this.props.display} />
                </span>);

        case formats.DATETIME_FORMAT: {
            return (<span className={className}>
                <DateCellValueRenderer value={this.props.display} />
                </span>);
        }

        case formats.TIME_FORMAT: {
            return (<span className={className}>
                <DateCellValueRenderer value={this.props.display} />
                </span>);
        }
        case formats.CHECKBOX_FORMAT:
            return (<span className={className}>
                    <input type="checkbox" disabled checked={this.props.value} />
                </span>);

        case formats.TEXT_FORMAT:
            return (<span className={className}>
                <MultiLineTextCellValueRenderer value={this.props.display} />
                </span>);

        case formats.PERCENT_FORMAT:
        case formats.CURRENCY_FORMAT:
        default: {
            return (<span className={className}>
                <TextCellValueRenderer value={this.props.display} />
                </span>);
        }
        }
    }
});
/**
 * placeholder for rendering users
 */
export const UserCellValueRenderer = React.createClass({

    propTypes: {
        value: React.PropTypes.string
    },

    render() {
        return <div className="userCell">{this.props.value}</div>;
    }
});

export const NumberCellValueRenderer = React.createClass({

    propTypes: {
        value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])
    },

    render() {
        return <div className="numberCell"><I18nNumber value={this.props.value}></I18nNumber></div>;
    }
});

export const DateCellValueRenderer = React.createClass({

    propTypes: {
        value: React.PropTypes.string
    },

    render() {
        return <div className="dateCell">{this.props.value}</div>;
    }
});

export const TextCellValueRenderer = React.createClass({

    propTypes: {
        value: React.PropTypes.any
    },

    render() {
        return <div className="textCell">{this.props.value}</div>;
    }
});

export const MultiLineTextCellValueRenderer = React.createClass({

    propTypes: {
        value: React.PropTypes.any
    },

    render() {
        return <pre className="multiLineTextCell">{this.props.value}</pre>;
    }
});
