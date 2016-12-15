import React, {PropTypes} from 'react';
import './textFormulaField.scss';

/**
 * # TextFormulaFieldValueRenderer
 *
 * Renders text formula field values
 */
const TextFormulaFieldRenderer = React.createClass({
    displayName: 'TextFormulaFieldRenderer',
    propTypes: {
        value: PropTypes.string
    },
    getDefaultProps() {
        return {
            value: ''
        };
    },
    render() {
        let value = this.props.value;

        const emptyValue = (<div className="emptyTextFormula"/>);
        const filledValue = (<div className="filledTextFormula">{value}</div>);
        return value && value !== "" ? filledValue : emptyValue;
    }
});

export default TextFormulaFieldRenderer;
