import React from 'react';
import {PropTypes} from 'react';
import QBToolTip from '../qbToolTip/qbToolTip';
import * as CompConstants from '../../constants/componentConstants';

import './tableFieldInput.scss';

class TableFieldInput extends React.Component {

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
        return !this.props.hasFocus && this.props.validationError && this.props.edited;
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
            onBlur: () => this.props.onBlur && this.props.onBlur(this.props.name),
            ref: (input) => {this.input = input;}
        };

        // create input (either input or textarea bsed on component)
        const input = React.createElement(this.props.component, inputProps);

        const classes = ["tableField"];

        const showValidationError = this.showValidationError();
        if (showValidationError) {
            classes.push("validationFailed");
        }

        return (
            <div className={classes.join(" ")}>
                <div className="tableFieldTitle">{this.props.required && "*"} {this.props.title}</div>
                <div className="tableFieldInput">
                    {showValidationError ? this.renderInvalidInput(input) : input}
                </div>
            </div>);
    }
}

TableFieldInput.propTypes = {
    component: PropTypes.any,
    title: PropTypes.string,
    value: PropTypes.string.isRequired,
    required: PropTypes.bool,
    rows: PropTypes.string,
    placeholder: PropTypes.string,
    validationError: PropTypes.string,
    autoFocus: PropTypes.bool,
    hasFocus: PropTypes.bool,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func
};

TableFieldInput.defaultProps = {
    component: 'input',
    required: false,
    placeholder: '',
    autoFocus: false,
    hasFocus: false,
};
export default TableFieldInput;
