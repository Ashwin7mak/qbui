import React, {PropTypes} from 'react';
import './urlFormulaField.scss';
/**
 * # UrlFormulaFieldRenderer
 *
 * Renders url formula field values
 */
const UrlFormulaFieldRenderer = React.createClass({
    displayName: 'UrlFormulaFieldRenderer',
    propTypes: {
        value: PropTypes.string,
        display: PropTypes.string,
    },
    getDefaultProps() {
        return {
            display: '',
            value: null
        };
    },
    render() {
        let value = this.props.value;
        value = (value || this.props.display);

        const emptyValue = (<div className="emptyUrlFormula"/>);
        const filledValue = (<div className="filledUrlFormula">{value}</div>);
        return value && value !== "" ? filledValue : emptyValue;
    }
});

export default UrlFormulaFieldRenderer;
