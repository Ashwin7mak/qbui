import React from 'react';
import ReactDOM from 'react-dom';
import {DefaultFieldEditor, MultiLineTextFieldEditor, ComboBoxFieldEditor, DateFieldEditor, DateTimeFieldEditor, TimeFieldEditor, UserFieldEditor, CheckBoxFieldEditor} from './fieldEditors';
import TextFieldEditor from './textFieldEditor';
import * as formats from '../../constants/fieldFormats';

/**
 * # FieldEditor
 *
 * This wraps the various field editor components. It contains a editor for a field defined by type and fieldDef and
 * the value supplied. It passed on whether the value is isInvalid.
 *
 * This wrapper handles the external common field editor rendering
 * It calls supplied callback validateFieldValue to check if the field is valid onBlur
 *
 * if the fieldDef has required:true and the indicateRequired prop is true the wrap
 * will show that field is required
 */
const FieldEditor = React.createClass({

    propTypes: {
        /**
         * the value to render */
        value: React.PropTypes.any,

        /**
         * optional additional classes for the input to customize styling */
        classes: React.PropTypes.string,

        /**
         * a field data type see ../../constants/fieldFormats defaults to text
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
    },

    getDefaultProps() {
        return {
            isInvalid: false,
            type : formats.TEXT_FORMAT
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
                    //Drew's change per Andrew if users want text box that
                    // grows in height use a multiline not single line text
                    //  return <MultiLineTextFieldEditor value={this.props.value}
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
            let fldValue = ev ? ev.target.value : ReactDOM.findDOMNode(this.refs.cellInput).value;
            let results = this.props.validateFieldValue(this.props.fieldDef, fldValue);
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

