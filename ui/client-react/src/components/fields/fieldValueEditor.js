import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import {DEFAULT_RECORD_KEY_ID} from '../../constants/schema';
import {NumberFieldValueRenderer} from './fieldValueRenderers';

import FieldFormats from '../../utils/fieldFormats' ;

import {DefaultFieldValueEditor} from './fieldValueEditors';

import CheckBoxFieldValueEditor from './checkBoxFieldValueEditor';
import DateFieldValueEditor from './dateFieldValueEditor';
import DateTimeFieldValueEditor from './dateTimeFieldValueEditor';
import MultiChoiceFieldValueEditor from './multiChoiceFieldValueEditor';
import MultiLineTextFieldValueEditor from './multiLineTextFieldValueEditor';
import NumericFieldValueEditor from './numericFieldValueEditor';
import TextFieldValueEditor from './textFieldValueEditor';
import TimeFieldValueEditor from './timeFieldValueEditor';
import UrlFieldValueEditor from './urlFieldValueEditor';
import UserFieldValueEditor from './userFieldValueEditor';

/**
 * # FieldValueEditor
 *
 *
 * This wraps the various field editor components. It contains a editor for a field defined by type and fieldDef and the value supplied. It passed on whether the value is isInvalid.
 *
 * This wrapper handles the external common field editor rendering. It calls supplied callback validateFieldValue to check if the field is valid onBlur
 *
 * If the fieldDef has required:true and the indicateRequired prop is true the wrap will show that field is required
 *  */
const FieldValueEditor = React.createClass({
    displayName: 'FieldValueEditor',
    propTypes: {
        /**
         * the value to render */
        value: React.PropTypes.any,

        /* the display value */
        display: React.PropTypes.any,

        /**
         * optional additional classes for the input to customize styling */
        classes: React.PropTypes.string,

        /**
         * a field data type see ../../utils/fieldFormats defaults to text
         * - TEXT_FORMAT = 1;
         * - NUMBER_FORMAT = 2;
         * - DATE_FORMAT = 3;
         * - DATETIME_FORMAT = 4;
         * - TIME_FORMAT = 5;
         * - CHECKBOX_FORMAT = 6;
         * - USER_FORMAT = 7;
         * - CURRENCY_FORMAT = 8;
         * - PERCENT_FORMAT = 9;
         * - RATING_FORMAT = 10;
         * - DURATION_FORMAT = 11;
         * - PHONE_FORMAT = 12;
         * - MULTI_LINE_TEXT_FORMAT = 13;
         * - URL = 14;
         **/
        type: React.PropTypes.number,

        /**
         * a field definition see swagger field & coldef */
        fieldDef: React.PropTypes.object,

        /**
         * listen for changes by setting a callback to the onChange prop.  */
        onChange: React.PropTypes.func,

        /**
         * listen for losing focus by setting a callback to the onBlur prop. */
        onBlur: React.PropTypes.func,

        /**
         * when the field has been validated this callback is made with the results of the validation. */
        onValidated: React.PropTypes.func,

        /**
         * the field validation callback method. */
        validateFieldValue: React.PropTypes.func,

        /**
         * if true shows an asterisk to indicate input is required . */
        indicateRequired : React.PropTypes.bool,

        /**
         * if true the field is rendered with a red border  */
        isInvalid: React.PropTypes.bool,

        /**
         * message to display in the tool tip when isInvalid */
        invalidMessage: React.PropTypes.string,

        /**
         * how to identify the field input
         */
        idKey : React.PropTypes.any
    },

    getDefaultProps() {
        return {
            isInvalid: false,
            type : FieldFormats.TEXT_FORMAT
        };
    },

    /**
     *  gets the markup for editing a field of the type specified
     *  adds placeholder text if supplied
     *  adds tabindex
     */
    getEditorForType(type) {
        let placeholder = undefined;
        if (_.has(this.props, 'fieldDef.placeholder')) {
            placeholder = this.props.fieldDef.placeholder;
        }

        let commonProps = {
            value: this.props.value,
            display: this.props.display,
            type: this.props.type,
            onChange: this.props.onChange,
            onBlur: this.onBlur,
            onValidated: this.props.onValidated,
            placeholder : placeholder,
            tabIndex: "0",
            idKey : this.props.idKey,
            ref:"fieldInput",
            required: (this.props.fieldDef ? this.props.fieldDef.required : false),
            readOnly: (this.props.fieldDef ? !this.props.fieldDef.userEditableValue : false),
            invalid: this.props.isInvalid,
            invalidMessage: this.props.invalidMessage,
            fieldDef: this.props.fieldDef
        };

        // Only allow the Record ID field to be a renderer, not an editor
        // Record ID is found based on the ID of the fieldDef (should be built in as always 3)
        let fieldId = (typeof this.props.fieldDef === 'undefined' ? '' : this.props.fieldDef.id);
        if (typeof fieldId !== 'undefined' && fieldId === DEFAULT_RECORD_KEY_ID) {
            return <NumberFieldValueRenderer isEditable={false} type="number" {...commonProps} />;
        }

        switch (type) {
        case FieldFormats.CHECKBOX_FORMAT: {
            return <CheckBoxFieldValueEditor {...commonProps} />;
        }

        case FieldFormats.DATE_FORMAT: {
            let attributes = this.props.fieldDef ? this.props.fieldDef.datatypeAttributes : null;
            return <DateFieldValueEditor key={'dfve-' + this.props.idKey} attributes={attributes} {...commonProps}/>;
        }

        case FieldFormats.DATETIME_FORMAT: {
            let attributes = this.props.fieldDef ? this.props.fieldDef.datatypeAttributes : null;
            return <DateTimeFieldValueEditor key={'dtfve-' + this.props.idKey} attributes={attributes} {...commonProps}/>;
        }

        case FieldFormats.TIME_FORMAT: {
            let attributes = this.props.fieldDef ? this.props.fieldDef.datatypeAttributes : null;
            return <TimeFieldValueEditor key={'tfve-' + this.props.idKey} attributes={attributes} {...commonProps} />;
        }

        case FieldFormats.NUMBER_FORMAT:
        case FieldFormats.RATING_FORMAT:
        case FieldFormats.DURATION_FORMAT:
        case FieldFormats.CURRENCY_FORMAT:
        case FieldFormats.PERCENT_FORMAT: {
            if (_.has(this.props, 'fieldDef.multipleChoice.choices')) {
                return (
                    <MultiChoiceFieldValueEditor choices={this.props.fieldDef.multipleChoice.choices}
                        {...commonProps} />
                );
            } else {
                return <NumericFieldValueEditor {...commonProps}
                    key={'nfve-' + this.props.idKey}
                    onChange={this.props.onChange ? this.props.onChange : ()=>{}}
                    classes="cellEdit"
                />;
            }
        }

        case FieldFormats.USER_FORMAT: {
            return <UserFieldValueEditor {...commonProps} appUsers={this.props.appUsers}/>;
        }

        case FieldFormats.MULTI_LINE_TEXT_FORMAT: {
            return <MultiLineTextFieldValueEditor {...commonProps} showScrollForMultiLine={this.props.showScrollForMultiLine}/>;
        }
        case FieldFormats.URL: {
            return <UrlFieldValueEditor {...commonProps} />;
        }
        case FieldFormats.TEXT_FORMAT:
        default: {

            if (_.has(this.props, 'fieldDef.multipleChoice.choices')) {
                return (
                        <MultiChoiceFieldValueEditor choices={this.props.fieldDef.multipleChoice.choices}
                                             {...commonProps}/>
                    );
            } else {
                return <TextFieldValueEditor {...commonProps}
                                            onChange={this.props.onChange ? this.props.onChange : ()=>{}}
                                            key={'tfve-' + this.props.idKey}
                                            classes="cellEdit"
                    />;
                    //Drew's change per Andrew if users want text box that
                    // grows in height use a multiline not single line text
                    //  return <MultiLineTextFieldValueEditor value={this.props.value}
                    //       placeholder={this.props.fieldDef.placeholder}
                    //       onChange={this.props.onChange} />;
            }
        }
        }
    },
    onBlur(vals) {
        if (this.props.onBlur) {
            this.props.onBlur(vals);
        }
        this.onExitField(vals.value);
    },
    /**
     * onExitField called on Blur to check if the field is valid and send the validation results to onValidated
     */
    onExitField(value) {
        // need to rerender this field with invalid state
        //on aggrid redraw, and on qbgrid set state
        if (this.props.validateFieldValue && this.props.onValidated) {
            let fldValue = value ? value : ReactDOM.findDOMNode(this.refs.fieldInput).value;
            let results = this.props.validateFieldValue(this.props.fieldDef, fldValue);
            this.props.onValidated(results);
        }
    },

    render() {
        // the css classes
        let classes = 'fieldValueEditor';
        /**
         * This checks to see if the type is 'MultiLineTextFieldValueEditor', if it is, the class assigned will be 'multiLineCellEditWrapper.'
         * The purpose for this is to make sure the top of the textarea box stays aligned with the rest of the fields. This is accomplished by
         * not including the css align-items: center (align-items centered is used with the class cellEditWrapper, which was what the component
         * MultiLineTextFieldValueEditor was using, and it prevented it from lining up correctly).
         */
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

export default FieldValueEditor;
