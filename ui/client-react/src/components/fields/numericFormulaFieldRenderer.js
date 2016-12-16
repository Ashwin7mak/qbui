import React, {PropTypes} from 'react';
import NumericFieldValueRenderer from './numericFieldValueRenderer';
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
        let value = this.props.display ? this.props.display : this.props.value;

        const emptyValue = (<div className="emptyFormula"/>);
        const filledValue = (<div className="filledFormula">
                                <NumericFieldValueRenderer
                                    value={value}
                                    attributes={this.props.attributes}
                                    key={'nfvr-' + this.props.idKey}
                                />
                            </div>);
        return value && value !== '' ? filledValue : emptyValue;
    }
});

export default NumericFormulaFieldRenderer;
