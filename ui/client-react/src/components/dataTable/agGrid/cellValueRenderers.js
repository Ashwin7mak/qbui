import React from 'react';

import {I18nNumber} from '../../../utils/i18nMessage';
import FieldFormats from '../../../utils/fieldFormats';
import TextField from '../../fields/textField';

export const CellValueRenderer = React.createClass({

    propTypes: {
        display: React.PropTypes.any,
        value: React.PropTypes.any,
        attributes: React.PropTypes.object,
        isEditable: React.PropTypes.bool,
        type: React.PropTypes.string
    },

    render() {

        let className = "cellData" + (this.props.isEditable ? "" : " nonEditable");
        let commonProperties = {};
        if (_.has(this.props, 'this.props.attributes.clientSideAttributes.bold') &&
                this.props.attributes.clientSideAttributes.bold) {
            commonProperties.isBold = true;
            className += ' bold';
        }
        if (_.has(this.props, 'this.props.attributes.clientSideAttributes.word-wrap') &&
            !this.props.attributes.clientSideAttributes.word_wrap) {
            commonProperties.NoWrap = true;
            className += ' NoWrap';
        }

        switch (this.props.type) {
        case FieldFormats.NUMBER_FORMAT:
        case FieldFormats.RATING_FORMAT:
            return (<span className={className}>
                {this.props.value &&
                <NumberCellValueRenderer value={this.props.value}
                                         attributes={this.props.attributes}
                                         {...commonProperties}/>}
                </span>);

        case FieldFormats.USER_FORMAT:
            return (<span className={className}>
                <UserCellValueRenderer value={this.props.display}
                                       {...commonProperties}/>
                </span>);

        case FieldFormats.DATE_FORMAT:
            return (<span className={className}>
                <DateCellValueRenderer value={this.props.display}
                                       {...commonProperties}/>
                </span>);

        case FieldFormats.DATETIME_FORMAT: {
            return (<span className={className}>
                <DateCellValueRenderer value={this.props.display}
                                       {...commonProperties}/>
                </span>);
        }

        case FieldFormats.TIME_FORMAT: {
            return (<span className={className}>
                <DateCellValueRenderer value={this.props.display}
                                       {...commonProperties}/>
                </span>);
        }
        case FieldFormats.CHECKBOX_FORMAT:
            return (<span className={className}>
                    <input type="checkbox" disabled checked={this.props.value}/>
                </span>);

        case FieldFormats.MULTI_LINE_TEXT_FORMAT:
            return (<span className={className}>
                <MultiLineTextCellValueRenderer value={this.props.display ? this.props.display : this.props.value}
                                                {...commonProperties}/>
                </span>);

        case FieldFormats.TEXT_FORMAT:
        case FieldFormats.PERCENT_FORMAT:
        case FieldFormats.DURATION_FORMAT:
        case FieldFormats.CURRENCY_FORMAT:
        default: {
            return (<span className={className}>
                <TextCellValueRenderer value={this.props.display ? this.props.display : this.props.value}
                                       attributes={this.props.attributes}
                                       {...commonProperties}/>
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
        return <TextField classes="textCell data"
                          isBold={this.props.attributes.clientSideAttributes.bold}
                          {...this.props} />;
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
