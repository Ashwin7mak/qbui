import React from 'react';
import {PropTypes} from 'react';
import QBToolTip from '../tooltip/tooltip';
import ErrorWrapper from '../../../../../client-react/src/components/fields/errorWrapper';
import * as CompConstants from '../../../../../client-react/src/constants/componentConstants';

import './dialogFieldInput.scss';

export const DIALOG_FIELD_INPUT_COMPONENT_TYPE = {
    textarea: 'textarea'
};

/**
 * DialogFieldInput is used for the multiStepDialog which is currently being used to create
 * new tables and new apps.
 **/

class DialogFieldInput extends React.Component {

    /**
     * set focus to the input field if autofocus=true
     */
    componentDidMount() {

        if (this.props.autofocus && this.input) {
            this.input.focus();
        }
    }

    /**
     * grab focus if hasFocus=true
     * since getting focus can result in replacing
     * the wrapped error input with a new input we
     * need to explicitly grab the focus again
     */
    componentDidUpdate() {
        if (this.props.hasFocus) {
            this.input.focus();
        }
    }

    /**
     * wrap the input in a tooltip if validation error should be shown
     * @param input
     * @returns {XML}
     */
    renderInvalidInput(input) {
        return (
            <QBToolTip location="top"
                       tipId="invalidInput"
                       delayHide={CompConstants.ERROR_TIP_TIMEOUT}
                       plainMessage={this.props.validationError}>
                {input}
            </QBToolTip>);
    }

    /**
     * should validation error be shown
     * @returns true only if we have a validation error AND we don't have focus AND the user has edited the field
     */
    showValidationError() {

        return this.props.validationError && this.props.edited;
    }

    /**
     * render an validated input field
     * @returns {XML}
     */
    render() {

        const inputProps = {
            type: "text",
            value: this.props.value,
            rows: this.props.rows,
            placeholder: this.props.placeholder,
            onChange: (e) => this.props.onChange(this.props.name, e.target.value),
            onFocus: () => this.props.onFocus && this.props.onFocus(this.props.name),
            onBlur: (e) => this.props.onBlur && this.props.onBlur(this.props.name, e.target.value),
            ref: (input) => this.input = input,
            maxLength: this.props.maxLength
        };

        // create input (either input or textarea bsed on component)
        const input = React.createElement(this.props.component, inputProps);

        const classes = [this.props.className, "dialogField"];

        const showValidationError = this.showValidationError();
        if (showValidationError) {
            classes.push("validationFailed");
        }

        return (
            <div className={classes.join(" ")}>
                <div className="dialogFieldTitle">{this.props.required && "*"} {this.props.title}</div>
                <div className="dialogFieldInput">

                    <ErrorWrapper isInvalid={showValidationError}
                                    invalidMessage={this.props.validationError}>
                        {input}
                    </ErrorWrapper>
                </div>
            </div>);
    }
}

DialogFieldInput.propTypes = {
    component: PropTypes.any,
    title: PropTypes.string,
    value: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    required: PropTypes.bool,
    rows: PropTypes.string,
    placeholder: PropTypes.string,
    validationError: PropTypes.string,
    autoFocus: PropTypes.bool,
    hasFocus: PropTypes.bool,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    maxLength: PropTypes.number
};

DialogFieldInput.defaultProps = {
    component: 'input',
    required: false,
    placeholder: '',
    autoFocus: false,
    hasFocus: false,
};
export default DialogFieldInput;
