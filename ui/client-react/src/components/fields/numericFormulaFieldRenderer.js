import React, {PropTypes} from 'react';

/**
 * # NumericFormulaFieldValueRenderer
 *
 * Renders numeric formula field values
 */
const NumericFormulaFieldRenderer = React.createClass({
    displayName: 'NumericFormulaFieldRenderer',
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
        return (
            <div>
                Numeric Formula Field
            </div>
        );
    }
});

export default NumericFormulaFieldRenderer;
