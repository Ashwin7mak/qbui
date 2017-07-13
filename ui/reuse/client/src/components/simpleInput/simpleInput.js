import React, {PropTypes, Component} from 'react';

// IMPORT FROM CLIENT-REACT
import ErrorWrapper from '../../../../../client-react/src/components/fields/errorWrapper';
// IMPORT FROM CLIENT-REACT

import './simpleInput.scss';

/**
 * Shows basic QBUI text input with correct focus colors and validation errors.
 * Has a few advanced features like setting a maxLength and input mask.
 */
class SimpleInput extends Component {
    static propTypes = {
        /**
         * The string value of the text input box. */
        value: PropTypes.string,

        /**
         * The label for the input. */
        label: PropTypes.string,

        /**
         * The className for this component for custom styling.
         * Will also add your className to the label (myComponentLabel) and input (myComponentInput). */
        className: PropTypes.string,

        /**
         * Show the input box with the required asterisk. */
        isRequired: PropTypes.bool,

        /**
         * Callback when the input is changed. Will send the value of the input as the first argument and
         * optionally send the name you provide as the second argument. */
        onChange: PropTypes.func,

        /**
         * Callback when the input is blurred. Will send the value of the input as the first argument and
         * optionally send the name you provide as the second argument. */
        onBlur: PropTypes.func,

        /**
         * Placeholder text for the input box. */
        placeholder: PropTypes.string,

        /**
         * An optional name to send during onChange and onBlur. */
        name: PropTypes.string,

        /**
         * An error validation message that will appear as a tooltip.
         * Setting this value will also display the input as invalid. */
        validationErrorMessage: PropTypes.string,

        /**
         * Sets a max length for the number of characters that can be entered into the input */
        maxLength: PropTypes.number,

        /**
         * A regex that describes the characters that can be entered into the input box.
         * Characters not accepted by the regex will not appear in the input box and will not cause the onChange to fire.
         * E.g., <SimpleInput mask={/^[A-Z]*$/} /> will only allow uppercase letters to be entered.
         * The regex should usually take the form /^[validCharacters]*$/
         * See <ColorPicker> for an example. */
        mask: PropTypes.any,
    };

    getClasses = () => {
        const {validationErrorMessage, className} = this.props;

        let classes = ['simpleInput'];

        if (validationErrorMessage) {
            classes.push('isInvalid');
        }

        if (className) {
            classes.push(className);
        }

        return classes.join(' ');
    };

    getLabelClasses = () => {
        const {className} = this.props;

        let classes = ['label'];

        if (className) {
            classes.push(`${className}Label`);
        }

        return classes.join(' ');
    };

    getInputClasses = () => {
        const {className} = this.props;

        let classes = ['input'];

        if (className) {
            classes.push(`${className}Input`);
        }

        return classes.join(' ');
    };

    /**
     * Calls the onChange event with the value of the input box.
     * If a mask is provided, onChange will only be called if a valid character was entered.
     * @param event
     */
    onChange = event => {
        const value = event.target.value;

        // If there is a mask, and the current character is not valid for that mask,
        // don't fire the onChange event.
        if (this.props.mask && !this.props.mask.test(value)) {
            return;
        }

        if (this.props.onChange) {
            this.props.onChange(value);
        }
    };

    render() {
        return (
            <div className={this.getClasses()}>
                <label className={this.getLabelClasses()}>{this.props.isRequired && '* '}{this.props.label}</label>
                <ErrorWrapper isInvalid={!!this.props.validationErrorMessage} invalidMessage={this.props.validationErrorMessage}>
                    <input
                        className={this.getInputClasses()}
                        value={this.props.value}
                        placeholder={this.props.placeholder}
                        onChange={this.onChange}
                        onBlur={this.props.onBlur}
                        maxLength={this.props.maxLength}
                    />
                </ErrorWrapper>
            </div>
        );
    }
}

export default SimpleInput;
