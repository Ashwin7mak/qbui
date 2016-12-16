import React, {PropTypes} from 'react';
import UrlFieldValueRenderer from './urlFieldValueRenderer';
import './formulaField.scss';
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
            value: '',
            display: '',
        };
    },
    render() {
        let value = this.props.value;

        const emptyValue = (<div className="emptyFormula"/>);
        const filledValue = (<UrlFieldValueRenderer
                                value={this.props.value}
                                display={this.props.display}
                                openInNewWindow={false}
                                showAsButton={false}
                                key={'ufvr-' + this.props.idKey}
                            />);
        return value && value !== "" ? filledValue : emptyValue;
    }
});

export default UrlFormulaFieldRenderer;
