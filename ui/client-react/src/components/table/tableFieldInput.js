import React from 'react';
import {PropTypes} from 'react';
import QBToolTip from '../qbToolTip/qbToolTip';
import * as CompConstants from '../../constants/componentConstants';

import './tableFieldInput.scss';

class TableFieldInput extends React.Component {

    componentDidMount() {

        if (this.props.autofocus && this.input) {
            this.input.focus();
        }
    }
    componentDidUpdate(prevProps) {

        if (this.props.validationError !== prevProps.validationError) {
            this.input.focus();
        }
    }

    renderInvalidInput(input) {
        return (
            <QBToolTip location="top"
                       tipId="invalidInput"
                       delayHide={CompConstants.ERROR_TIP_TIMEOUT}
                       plainMessage={this.props.validationError}>
                {input}
            </QBToolTip>);
    }

    render() {

        const inputProps = {
            type: "text",
            value: this.props.value,
            rows: this.props.rows,
            ref: (input) => this.input = input,
            onChange: (e) => this.props.onChange(this.props.name, e.target.value)
        };

        const input = React.createElement(this.props.component, inputProps);

        const classes = ["tableField"];

        if (this.props.validationError) {
            classes.push("validationFailed");
        }

        return (
            <div className={classes.join(" ")}>
                <div className="tableFieldTitle">{this.props.required && "*"} {this.props.title}</div>
                <div className="tableFieldInput">
                    {this.props.validationError ? this.renderInvalidInput(input) : input}
                </div>
            </div>);
    }
}

TableFieldInput.propTypes = {
    component: PropTypes.any,
    validationError: PropTypes.string

};

TableFieldInput.defaultProps = {
    component: 'input'
};
export default TableFieldInput;
