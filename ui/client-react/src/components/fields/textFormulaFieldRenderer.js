import React, {PropTypes} from 'react';
import TextFieldValueRenderer from './textFieldValueRenderer';
import './formulaField.scss';

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
            value: '',
            display: '',
        };
    },
    render() {
        let value = this.props.display ? this.props.display : this.props.value;

        const emptyValue = (<div className="emptyFormula"/>);
        const filledValue = (<div className="filledFormula">
                                <TextFieldValueRenderer value={value}
                                                        attributes={this.props.attributes}
                                                        key={'tfvr-' + this.props.idKey}
                                />
                            </div>);
        return value && value !== "" ? filledValue : emptyValue;
    }
});

export default TextFormulaFieldRenderer;
