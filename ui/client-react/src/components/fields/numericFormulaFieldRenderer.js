import React, {PropTypes} from 'react';
import './numericFormulaField.scss';

/**
 * # NumericFormulaFieldValueRenderer
 *
 * Renders numeric formula field values
 */
const NumericFormulaFieldRenderer = React.createClass({
    displayName: 'NumericFormulaFieldRenderer',
    propTypes: {
        value: PropTypes.any.isRequired,
        display: PropTypes.string,
    },
    getDefaultProps() {
        return {
            display: '',
            value: ''
        };
    },
    render() {
        let value = (this.props.value && this.props.value.numberStr) ? this.props.value.numberStr : '';
        value = (value || this.props.display);

        const emptyValue = (<div className="emptyNumericFormula"/>);
        const filledValue = (<div className="filledNumericFormula">{value}</div>);
        return value && value !== "" ? filledValue : emptyValue;
    }
});

export default NumericFormulaFieldRenderer;
