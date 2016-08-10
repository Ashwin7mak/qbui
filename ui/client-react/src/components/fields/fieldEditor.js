import React from 'react';

import {DefaultFieldEditor, MultiLineTextFieldEditor, ComboBoxFieldEditor, DateFieldEditor, DateTimeFieldEditor, TimeFieldEditor, UserFieldEditor, CheckBoxFieldEditor} from './fieldEditors';
import TextFieldEditor from './textFieldEditor';

import * as formats from '../../constants/fieldFormats';

/**
 * creates a editor for a field defined my type and fieldDef with the value supplied
 * optional to include indicator that the field is required
 */
const FieldEditor = React.createClass({

    propTypes: {
        type: React.PropTypes.number,
        value: React.PropTypes.any,
        fieldDef: React.PropTypes.object,
        onChange: React.PropTypes.func,
        indicateRequired : React.bool,
    },

    getEditorForType(type) {
        switch (type) {
            case formats.CHECKBOX_FORMAT:
                return <CheckBoxFieldEditor value={this.props.value} onChange={this.props.onChange} />;

            case formats.DATE_FORMAT: {
                return <DateFieldEditor value={this.props.value} onChange={this.props.onChange}
                                        placeholder={this.props.fieldDef.placeholder}/>;
            }

            case formats.DATETIME_FORMAT: {
                return <DateTimeFieldEditor value={this.props.value} onChange={this.props.onChange}
                                            placeholder={this.props.fieldDef.placeholder}/>;
            }

            case formats.TIME_FORMAT: {
                return <TimeFieldEditor value={this.props.value} onChange={this.props.onChange}
                                        placeholder={this.props.fieldDef.placeholder} />;
            }

            case formats.NUMBER_FORMAT:
            case formats.RATING_FORMAT:
            case formats.DURATION_FORMAT:
            case formats.CURRENCY_FORMAT:
            case formats.PERCENT_FORMAT: {
                return <DefaultFieldEditor value={this.props.value}
                                           type="number"
                                           placeholder={this.props.fieldDef.placeholder}
                                           onChange={this.props.onChange} />;
            }

            case formats.USER_FORMAT: {
                return <UserFieldEditor value={this.props.value}
                                        placeholder={this.props.fieldDef.placeholder}
                                        onChange={this.props.onChange} />;
            }

            case formats.MULTI_LINE_TEXT_FORMAT: {
                return <MultiLineTextFieldEditor value={this.props.value}
                                                 placeholder={this.props.fieldDef.placeholder}
                                                 onChange={this.props.onChange} />;
            }
            case formats.TEXT_FORMAT:
            default: {

                if (this.props.fieldDef.choices) {
                    return (
                        <ComboBoxFieldEditor choices={this.props.fieldDef.choices} value={this.props.value}
                                             placeholder={this.props.fieldDef.placeholder}
                                             onChange={this.props.onChange} />
                    );
                } else {
                    return <TextFieldEditor value={this.props.value}
                                            onChange={this.props.onChange}
                                            placeholder={this.props.fieldDef.placeholder}
                                            classes="cellEdit"
                                            tabIndex="0"
                                            ref="cellInput"
                    />;
                    //Drew's change TBD by Andrew if users want text box that
                    // grows in height for single line text change TextFieldEditor to
                    //  return <MultiLineTextFieldEditor value={this.props.value}
                    //       placeholder={this.props.fieldDef.placeholder}
                    //       onChange={this.props.onChange} />;
                }
            }
        }
    },


    render() {
        let classes = this.props.classes + " fieldEditor";
        let requiredIndication = (this.props.indicateRequired &&
                                    this.props.fieldDef.required) ? '*' : '\u00a0'; // u00a0 = non-breaking space

        return (
            <div className={classes}  onBlur={this.props.validate}>
                {/* show required symbol optionally */}
                {this.props.indicateRequired  ?
                    (<div className="requiredFlag requiredFlag-layout">{requiredIndication}</div>) :
                    null}

                {/* render type specific editor */}
                {this.getEditorForType(this.props.type)}
            </div>
        );
    }
});

export default FieldEditor;

