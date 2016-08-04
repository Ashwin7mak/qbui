import React from 'react';

import {I18nNumber} from '../../../utils/i18nMessage';
import * as formats from '../../../constants/fieldFormats';
import TextField from '../../fields/textField';

export const CellValueRenderer = React.createClass({

    propTypes: {
        display: React.PropTypes.any,
        value: React.PropTypes.any,
        attributes: React.PropTypes.object,
        isEditable: React.PropTypes.bool
    },

    render() {

        let className = "cellData" + (this.props.isEditable ? "" : " nonEditable");
        switch (this.props.type) {
        case formats.NUMBER_FORMAT:
        case formats.RATING_FORMAT:
            return (<span className={className}>
                {this.props.value &&
                <NumberCellValueRenderer value={this.props.value} attributes={this.props.attributes}/>}
                </span>);

        case formats.USER_FORMAT:
            return (<span className={className}>
                <UserCellValueRenderer value={this.props.display}/>
                </span>);

        case formats.DATE_FORMAT:
            return (<span className={className}>
                <DateCellValueRenderer value={this.props.display}/>
                </span>);

        case formats.DATETIME_FORMAT: {
                return (<span className={className}>
                <DateCellValueRenderer value={this.props.display}/>
                </span>);
            }

        case formats.TIME_FORMAT: {
                return (<span className={className}>
                <DateCellValueRenderer value={this.props.display}/>
                </span>);
            }
        case formats.CHECKBOX_FORMAT:
            return (<span className={className}>
                    <input type="checkbox" disabled checked={this.props.value}/>
                </span>);

        case formats.MULTI_LINE_TEXT_FORMAT:
            return (<span className={className}>
                <MultiLineTextCellValueRenderer value={this.props.display}/>
                </span>);

        case formats.TEXT_FORMAT:
        case formats.PERCENT_FORMAT:
        case formats.DURATION_FORMAT:
        case formats.CURRENCY_FORMAT:
        default: {
                return (<span className={className}>
                <TextCellValueRenderer value={this.props.display}/>
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
        return <div className="userCell data">{this.props.value}</div>;
    }
});

export const NumberCellValueRenderer = React.createClass({

    propTypes: {
        value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])
    },

    render() {
        return <div className="numberCell data"><I18nNumber value={this.props.value}></I18nNumber></div>;
    }
});


export const DateCellValueRenderer = React.createClass({

    propTypes: {
        value: React.PropTypes.string
    },

    render() {
        return <div className="dateCell data">{this.props.value}</div>;
    }
});

export const TextCellValueRenderer = React.createClass({

    propTypes: {
        value: React.PropTypes.any
    },

    render() {
        return <TextField classes="textCell data" {...this.props} />;
    }
});

// like a text cell but use a PRE tag to preserve whitespace
export const MultiLineTextCellValueRenderer = React.createClass({

    propTypes: {
        value: React.PropTypes.any
    },

    render() {
        return <pre className="multiLineTextCell data">{this.props.value}</pre>;
    }
});
