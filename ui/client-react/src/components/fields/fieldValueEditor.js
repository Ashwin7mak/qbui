import React from 'react';
import ReactDOM from 'react-dom';

import FieldFormats from '../../utils/fieldFormats' ;
import {DefaultFieldValueEditor, MultiLineTextFieldValueEditor, ComboBoxFieldValueEditor, DateFieldValueEditor,
    DateTimeFieldValueEditor, TimeFieldValueEditor, CheckBoxFieldValueEditor} from './fieldValueEditors';
import TextFieldValueEditor from './textFieldValueEditor';
import UserFieldValueEditor from './userFieldValueEditor';
import _ from 'lodash';

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
            onChange: this.props.onChange,
            onBlur: this.onExitField,
            onValidated: this.props.onValidated,
            placeholder : placeholder,
            tabIndex: "0",
            idKey : this.props.idKey,
            ref:"fieldInput"
        };

        switch (type) {
        case FieldFormats.CHECKBOX_FORMAT:
            return <CheckBoxFieldValueEditor {...commonProps}
                />;

        case FieldFormats.DATE_FORMAT: {
            return <DateFieldValueEditor  {...commonProps}/>;
        }

        case FieldFormats.DATETIME_FORMAT: {
            return <DateTimeFieldValueEditor  {...commonProps}/>;
        }

        case FieldFormats.TIME_FORMAT: {
            return <TimeFieldValueEditor  {...commonProps} />;
        }

        case FieldFormats.NUMBER_FORMAT:
        case FieldFormats.RATING_FORMAT:
        case FieldFormats.DURATION_FORMAT:
        case FieldFormats.CURRENCY_FORMAT:
        case FieldFormats.PERCENT_FORMAT: {
            return <DefaultFieldValueEditor type="number"
                                       {...commonProps} />;
        }

        case FieldFormats.USER_FORMAT: {
            return <UserFieldValueEditor  {...commonProps} appUsers={this.props.appUsers}/>;
        }

        case FieldFormats.MULTI_LINE_TEXT_FORMAT: {
            return <MultiLineTextFieldValueEditor {...commonProps} />;
        }
        case FieldFormats.TEXT_FORMAT:
        default: {

            if (_.has(this.props, 'fieldDef.choices')) {
                return (
                        <ComboBoxFieldValueEditor choices={this.props.fieldDef.choices}
                                             {...commonProps} />
                    );
            } else {
                return <TextFieldValueEditor {...commonProps}
                                            onChange={this.props.onChange ? this.props.onChange : ()=>{}}
                                            isInvalid={this.props.isInvalid}
                                            invalidMessage={this.props.invalidMessage}
                                            onValidated={this.props.onValidated}
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

    /**
     * onExitField called on Blur to check if the field is valid and send the validation results to onValidated
     */
    onExitField(ev) {
        // need to rerender this field with invalid state
        //on aggrid redraw, and on qbgrid set state
        if (this.props.validateFieldValue && this.props.onValidated) {
            let fldValue = ev ? ev.target.value : ReactDOM.findDOMNode(this.refs.fieldInput).value;
            let results = this.props.validateFieldValue(this.props.fieldDef, fldValue);
            this.props.onValidated(results);
        }
    },

    render() {

        // the css classes
        let classes = 'fieldValueEditor';
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

