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
        type: React.PropTypes.number,   //field types see ../../constants/fieldFormats
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
        let placeholder = undefined;
        if (_.has(this.props, 'fieldDef.placeholder')) {
            placeholder = this.props.fieldDef.placeholder;
        }

        let commonProps = {
            value: this.props.value,
            onChange: this.props.onChange,
            onBlur: this.onExitField,
            onValidated: this.props.onValidated,
            placeholder : placeholder,
            tabIndex: "0",
            ref:"cellInput"
        };

        switch (type) {
        case formats.CHECKBOX_FORMAT:
            return <CheckBoxFieldEditor {...commonProps}
                />;

        case formats.DATE_FORMAT: {
            return <DateFieldEditor  {...commonProps}/>;
        }

        case formats.DATETIME_FORMAT: {
            return <DateTimeFieldEditor  {...commonProps}/>;
        }

        case formats.TIME_FORMAT: {
            return <TimeFieldEditor  {...commonProps} />;
        }

        case formats.NUMBER_FORMAT:
        case formats.RATING_FORMAT:
        case formats.DURATION_FORMAT:
        case formats.CURRENCY_FORMAT:
        case formats.PERCENT_FORMAT: {
            return <DefaultFieldEditor type="number"
                                       {...commonProps} />;
        }

        case formats.USER_FORMAT: {
            return <UserFieldEditor  {...commonProps}/>;
        }

        case formats.MULTI_LINE_TEXT_FORMAT: {
            return <MultiLineTextFieldEditor {...commonProps} />;
        }
        case formats.TEXT_FORMAT:
        default: {

            if (_.has(this.props, 'fieldDef.choices')) {
                return (
                        <ComboBoxFieldEditor choices={this.props.fieldDef.choices}
                                             {...commonProps} />
                    );
            } else {
                return <TextFieldEditor {...commonProps}
                                            onChange={this.props.onChange ? this.props.onChange : ()=>{}}
                                            isInvalid={this.props.isInvalid}
                                            invalidMessage={this.props.invalidMessage}
                                            onValidated={this.props.onValidated}
                                            classes="cellEdit"
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
        // need to rerender this field with invalid state
        //on aggrid redraw, and on qbgrid set state
        if (this.props.validateFieldValue && this.props.onValidated) {
            let results = this.props.validateFieldValue(this.props.fieldDef, ev.target.value);
            this.props.onValidated(results);
        }
    },

    render() {

        // the css classes
        let classes = 'fieldEditor';
        if (this.props.classes) {
            classes += ' ' + this.props.classes;
        }
        // error state css class
        if (this.props.isInvalid) {
            classes += ' error';
        }

        // symbol that a value required
        let requiredIndication = '\u00a0'; // u00a0 = non-breaking space
        if (this.props.fieldDef && this.props.fieldDef.required) {
            requiredIndication = '*';
        }

        //show required symbol
        let requiredDiv = null;
        if (this.props.indicateRequired) {
            requiredDiv = <div className="requiredFlag requiredFlag-layout">{requiredIndication}</div>;
        }

        let renderedType = null;
        if (this.props.type) {
            renderedType =  this.getEditorForType(this.props.type);
        }

        return (
            <div className={classes}  >
                {/* optionally show required symbol */}
                {requiredDiv}

                {/* render type specific editor */}
                {renderedType}
            </div>
        );
    }
});

export default FieldEditor;

