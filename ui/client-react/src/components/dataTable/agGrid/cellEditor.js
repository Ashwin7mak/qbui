import React from 'react';

import {DefaultFieldEditor, MultiLineTextFieldEditor, ComboBoxFieldEditor, DateFieldEditor, DateTimeFieldEditor, TimeFieldEditor, UserFieldEditor, CheckBoxFieldEditor} from '../../fields/fieldEditors';
import TextFieldEditor from '../../fields/textFieldEditor';

import FieldFormats from '../../../utils/fieldFormats';

const CellEditor = React.createClass({

    propTypes: {
        type: React.PropTypes.number,
        value: React.PropTypes.any,
        colDef: React.PropTypes.object,
        onChange: React.PropTypes.func,
        onTabColumn: React.PropTypes.func
    },

    getEditorForType(type) {
        switch (type) {
        case FieldFormats.CHECKBOX_FORMAT:
            return <CheckBoxFieldEditor value={this.props.value} onChange={this.props.onChange}
                                        placeholder={this.props.colDef.placeholder}/>;

        case FieldFormats.DATE_FORMAT: {
            return <DateFieldEditor value={this.props.value} onChange={this.props.onChange}
                                    placeholder={this.props.colDef.placeholder}/>;
        }

        case FieldFormats.DATETIME_FORMAT: {
            return <DateTimeFieldEditor value={this.props.value} onChange={this.props.onChange}
                                        placeholder={this.props.colDef.placeholder}/>;
        }

        case FieldFormats.TIME_FORMAT: {
            return <TimeFieldEditor value={this.props.value} onChange={this.props.onChange}
                                    placeholder={this.props.colDef.placeholder} />;
        }

        case FieldFormats.NUMBER_FORMAT:
        case FieldFormats.RATING_FORMAT:
        case FieldFormats.DURATION_FORMAT:
        case FieldFormats.CURRENCY_FORMAT:
        case FieldFormats.PERCENT_FORMAT: {
            return <DefaultFieldEditor value={this.props.value}
                                       type="number"
                                       placeholder={this.props.colDef.placeholder}
                                       onChange={this.props.onChange} />;
        }

        case FieldFormats.USER_FORMAT: {
            return <UserFieldEditor value={this.props.value}
                                    placeholder={this.props.colDef.placeholder}
                                    onChange={this.props.onChange} />;
        }

        case FieldFormats.MULTI_LINE_TEXT_FORMAT: {
            return <MultiLineTextFieldEditor value={this.props.value}
                                             placeholder={this.props.colDef.placeholder}
                                    onChange={this.props.onChange} />;
        }
        case FieldFormats.TEXT_FORMAT:
        default: {

            if (this.props.colDef.choices) {
                return (
                    <ComboBoxFieldEditor choices={this.props.colDef.choices} value={this.props.value}
                                         placeholder={this.props.colDef.placeholder}
                                     onChange={this.props.onChange} />
                );
            } else {
                return <TextFieldEditor value={this.props.value}
                                        onChange={this.props.onChange}
                                        placeholder={this.props.colDef.placeholder}
                                        classes="cellEdit"
                                        tabIndex="0"
                                        ref="cellInput"
                                        />;
            //Drew's change TBD by Andrew if users want text box that
            // grows in height for single line text change TextFieldEditor to
            //  return <MultiLineTextFieldEditor value={this.props.value}
            //       placeholder={this.props.colDef.placeholder}
            //       onChange={this.props.onChange} />;
            }
        }
        }
    },

    /**
     * inform parent component of tabbing
     */
    onKeyDown(ev) {
        if (ev.key === "Tab" && !ev.shiftKey) {
            this.props.onTabColumn();
        }
    },

    render() {
        let requiredIndication = (this.props.colDef.required) ? '*' : '\u00a0'; // u00a0 = non-breaking space
        return (<div className="cellEditWrapper" onKeyDown={this.onKeyDown}>
                <div className="requiredFlag requiredFlag-layout">{requiredIndication}</div>
            {this.getEditorForType(this.props.type)}
            </div>);
    }
});

export default CellEditor;

