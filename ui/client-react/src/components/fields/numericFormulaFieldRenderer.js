import React, {PropTypes} from 'react';
import './formulaField.scss';

/**
 * # NumericFormulaFieldValueRenderer
 *
 * Renders numeric formula field values
 */
const NumericFormulaFieldRenderer = React.createClass({
    displayName: 'NumericFormulaFieldRenderer',
    propTypes: {
        value: PropTypes.any.isRequired,
        display: PropTypes.any.isRequired
    },
    getDefaultProps() {
        return {
            value: '',
            display: ''
        };
    },
    render() {
        let value = this.props.display;

        const emptyValue = (<div className="emptyFormula"/>);
        const filledValue = (<div className="filledFormula">{value}</div>);
        return value && value !== '' ? filledValue : emptyValue;
    }
});

export default NumericFormulaFieldRenderer;
