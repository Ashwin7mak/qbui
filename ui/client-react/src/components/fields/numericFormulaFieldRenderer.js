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
        value: PropTypes.number,
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

        return (
            <div>
                {value}
            </div>
        );
    }
});

export default NumericFormulaFieldRenderer;
