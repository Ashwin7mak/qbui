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

        return (
            <div>
                {value}
            </div>
        );
    }
});

export default TextFormulaFieldRenderer;
