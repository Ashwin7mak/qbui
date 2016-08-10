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
        classes: React.PropTypes.string,
        type: React.PropTypes.number,
        value: React.PropTypes.any,
        fieldDef: React.PropTypes.object,
        onChange: React.PropTypes.func,
        onBlur: React.PropTypes.func,
        onValidated: React.PropTypes.func,
        validateFieldValue: React.PropTypes.func,
        indicateRequired : React.PropTypes.bool,
        isInvalid: React.PropTypes.bool,
        invalidMessage: React.PropTypes.string,
    },

    getEditorForType(type) {
        switch (type) {
        case formats.CHECKBOX_FORMAT:
            return <CheckBoxFieldEditor value={this.props.value}
                                            onChange={this.props.onChange}
                                            onValidated={this.props.onValidated}
                                            onBlur={this.onExitField}
                />;

        case formats.DATE_FORMAT: {
            return <DateFieldEditor value={this.props.value} onChange={this.props.onChange}
                                        onBlur={this.onExitField}
                                        placeholder={this.props.fieldDef.placeholder}/>;
        }

        case formats.DATETIME_FORMAT: {
            return <DateTimeFieldEditor value={this.props.value} onChange={this.props.onChange}
                                            onBlur={this.onExitField}
                                            onValidated={this.props.onValidated}
                                            placeholder={this.props.fieldDef.placeholder}/>;
        }

        case formats.TIME_FORMAT: {
            return <TimeFieldEditor value={this.props.value} onChange={this.props.onChange}
                                        onBlur={this.onExitField}
                                        onValidated={this.props.onValidated}
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
                                           onBlur={this.onExitField}
                                           onValidated={this.props.onValidated}
                                           onChange={this.props.onChange} />;
        }

        case formats.USER_FORMAT: {
            return <UserFieldEditor value={this.props.value}
                                        placeholder={this.props.fieldDef.placeholder}
                                        onBlur={this.onExitField}
                                        onValidated={this.props.onValidated}
                                        onChange={this.props.onChange} />;
        }

        case formats.MULTI_LINE_TEXT_FORMAT: {
            return <MultiLineTextFieldEditor value={this.props.value}
                                                 placeholder={this.props.fieldDef.placeholder}
                                                 onBlur={this.onExitField}
                                                 onValidated={this.props.onValidated}
                                                 onChange={this.props.onChange} />;
        }
        case formats.TEXT_FORMAT:
        default: {

            if (this.props.fieldDef.choices) {
                return (
                        <ComboBoxFieldEditor choices={this.props.fieldDef.choices} value={this.props.value}
                                             placeholder={this.props.fieldDef.placeholder}
                                             onBlur={this.onExitField}
                                             onValidated={this.props.onValidated}
                                             onChange={this.props.onChange} />
                    );
            } else {
                return <TextFieldEditor value={this.props.value}
                                            onChange={this.props.onChange}
                                            onBlur={this.onExitField}
                                            isInvalid={this.props.isInvalid}
                                            invalidMessage={this.props.invalidMessage}
                                            onValidated={this.props.onValidated}
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

    onExitField(ev) {
        let results = this.props.validateFieldValue(this.props.fieldDef, ev.target.value);
        this.props.onValidated(results);
        // need to rerender this field with invalid state
        //on aggrid redraw on qbgrid set state in
    },

    render() {

        let classes = this.props.classes + " fieldEditor" + (this.props.isInvalid ? ' error' : '');
        let requiredIndication = (this.props.indicateRequired &&
                                    this.props.fieldDef.required) ? '*' : '\u00a0'; // u00a0 = non-breaking space

        return (
            <div className={classes}  >
                {/* show required symbol optionally */}
                {this.props.indicateRequired  ?
                    (<div className="requiredFlag requiredFlag-layout">{requiredIndication}</div>) :
                    null
                }

                {/* render type specific editor */
                    this.getEditorForType(this.props.type)
                }
            </div>
        );
    }
});

export default FieldEditor;

