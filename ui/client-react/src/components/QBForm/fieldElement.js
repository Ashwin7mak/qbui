import React from 'react';

import FieldLabelElement from './fieldLabelElement';
import FieldValueRenderer from '../fields/fieldValueRenderer';
import FieldValueEditor from '../fields/fieldValueEditor';
import FieldFormats from '../../utils/fieldFormats';
import './qbform.scss';

/**s
 * render a field value, optionally with its label
 */
const FieldElement = React.createClass({
    displayName: 'FieldElement',
    propTypes: {
        element: React.PropTypes.object, // FormFieldElement from form API
        relatedField: React.PropTypes.object, // field from Form data
        fieldRecord: React.PropTypes.object, // the record data
        includeLabel: React.PropTypes.bool // render label above field (otherwise ignore it)
    },

    onChange(newVal) {
        //validate the field change and show error if any.
        //ValidationUtils.checkFieldValue()

        //bubble up onChange with the old/new values
        let fid = this.props.relatedField.id;
        let change = {
            values: {
                oldVal: this.props.fieldRecord,
                newVal: {value: newVal, display: newVal}
            },
            fid: +fid,
            fieldName: this.props.relatedField.name
        };
        if (this.props.onChange) {
            this.props.onChange(change);
        }
    },

    onBlur(theVals) {
        let fid = this.props.relatedField.id;
        let change = {
            values: {
                oldVal: this.props.fieldRecord,
                newVal: theVals
            },
            fid: +fid,
            fieldName: this.props.relatedField.name
        };
        if (this.props.onBlur) {
            this.props.onChange(change);
        }
    },

    render() {
        let fieldDatatypeAttributes = this.props.relatedField && this.props.relatedField.datatypeAttributes ?
            this.props.relatedField.datatypeAttributes : {};
        let fieldType = FieldFormats.getFormatType(fieldDatatypeAttributes.type);

        //catch the non-implemented pieces.
        let fieldDisplayValue = this.props.fieldRecord ? this.props.fieldRecord.display : "display value";
        let fieldRawValue = this.props.fieldRecord ? this.props.fieldRecord.value : "raw value";

        let fieldElement = this.props.edit ?
            <FieldValueEditor type={fieldType}
                            value={fieldRawValue}
                            display={fieldDisplayValue}
                            attributes={fieldDatatypeAttributes}
                            fieldDef = {this.props.relatedField}
                            indicateRequired={true}
                            onChange={this.onChange}
                            onBlur={this.onBlur}
                            onKeyDown={this.onKeyDown}
                            onValidated={this.props.onValidated}
                            isInvalid={this.props.isInvalid}
                            key={'fve-' + this.props.idKey}
                            idKey={this.props.idKey}
                            invalidMessage={this.props.invalidMessage}/> :
            <FieldValueRenderer type={fieldType}
                                           value={fieldRawValue}
                                           display={fieldDisplayValue}
                                           attributes={fieldDatatypeAttributes}
                                           fieldDef = {this.props.relatedField} />;
        return (
            <div className="formElement field">
                {this.props.includeLabel && <FieldLabelElement element={this.props.element} relatedField={this.props.relatedField} /> }

                <span className="cellWrapper">
                    { (fieldDisplayValue !== null || fieldRawValue !== null) && fieldElement }
                </span>
            </div>);
    }
});

export default FieldElement;
