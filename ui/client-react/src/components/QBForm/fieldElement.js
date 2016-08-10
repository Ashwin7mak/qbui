import React from 'react';
import './qbform.scss';
const serverTypeConsts = require('../../../../common/src/constants');
import {CellValueRenderer} from '../dataTable/agGrid/cellValueRenderers';

const FieldElement = React.createClass({
    propTypes: {
        element: React.PropTypes.object,
        relatedField: React.PropTypes.object,
        fieldRecord: React.PropTypes.object
    },

    render() {
        let fieldDatatypeAttributes = this.props.relatedField && this.props.relatedField.datatypeAttributes ?
            this.props.relatedField.datatypeAttributes : {};
        let fieldType = fieldDatatypeAttributes.type;

        //catch the non-implemented pieces.
        let fieldDisplayValue = this.props.fieldRecord ? this.props.fieldRecord.display : "display value";
        let fieldRawValue = this.props.fieldRecord ? this.props.fieldRecord.value : "raw value";

        let fieldLabel = "";
        if (this.props.element.useAlternateLabel) {
            fieldLabel = this.props.element.displayText;
        } else {
            fieldLabel = this.props.relatedField ? this.props.relatedField.name : "display label";
        }

        return (
            <div className="fieldElement">
                <span className="fieldLabel">{fieldLabel}</span>
                <span className="cellWrapper">
                    {fieldDisplayValue !== null &&
                    <CellValueRenderer type={fieldType}
                                       value={fieldRawValue}
                                       display={fieldDisplayValue}
                                       attributes={fieldDatatypeAttributes}
                    />  }
                </span>
            </div>);
    }
});

export default FieldElement;
