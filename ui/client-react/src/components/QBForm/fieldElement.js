import React from 'react';

import FieldLabelElement from './fieldLabelElement';
import {CellValueRenderer} from '../dataTable/agGrid/cellValueRenderers';
import './qbform.scss';

const serverTypeConsts = require('../../../../common/src/constants');

const FieldElement = React.createClass({
    propTypes: {
        element: React.PropTypes.object,
        relatedField: React.PropTypes.object,
        fieldRecord: React.PropTypes.object,
        includeLabel: React.PropTypes.bool
    },

    render() {
        let fieldDatatypeAttributes = this.props.relatedField && this.props.relatedField.datatypeAttributes ?
            this.props.relatedField.datatypeAttributes : {};
        let fieldType = fieldDatatypeAttributes.type;

        //catch the non-implemented pieces.
        let fieldDisplayValue = this.props.fieldRecord ? this.props.fieldRecord.display : "display value";
        let fieldRawValue = this.props.fieldRecord ? this.props.fieldRecord.value : "raw value";

        return (
            <div className="formElement field">
                {this.props.includeLabel && <FieldLabelElement element={this.props.element} relatedField={this.props.relatedField} /> }

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
