import React from 'react';

import Fluxxor from 'fluxxor';
import FieldLabelElement from './fieldLabelElement';
import FieldValueRenderer from '../fields/fieldValueRenderer';
import FieldValueEditor from '../fields/fieldValueEditor';
import FieldFormats from '../../utils/fieldFormats';
import './qbform.scss';

let FluxMixin = Fluxxor.FluxMixin(React);
/**s
 * render a form field value, optionally with its label
 */
const FieldElement = React.createClass({
    mixins: [FluxMixin],
    displayName: 'FieldElement',
    propTypes: {
        element: React.PropTypes.object, // FormFieldElement from form API
        relatedField: React.PropTypes.object, // field from Form data
        fieldRecord: React.PropTypes.object, // the record data
        includeLabel: React.PropTypes.bool // render label above field (otherwise ignore it)
    },

    getChanges(theVals) {
        let fid = this.props.relatedField.id;
        let change = {
            values: {
                oldVal: this.props.fieldRecord,
                newVal: {value: theVals.value, display: theVals.display}
            },
            fid: +fid,
            fieldName: this.props.relatedField.name
        };
        return change;
    },

    onChange(newVal) {
        //bubble up onChange with the old/new values
        let rawValue = this.props.fieldRecord ? this.props.fieldRecord.value : "";
        let change = this.getChanges({value: rawValue, display: newVal});
        if (this.props.onChange) {
            this.props.onChange(change);
        }
    },

    onBlur(theVals) {
        const flux = this.getFlux();
        flux.actions.recordPendingValidateField(this.props.relatedField, theVals.value);
        let change = this.getChanges(theVals);
        if (this.props.onBlur) {
            this.props.onBlur(change);
        }
    },

    render() {
        let fieldDatatypeAttributes = this.props.relatedField && this.props.relatedField.datatypeAttributes ?
            this.props.relatedField.datatypeAttributes : {};
        let fieldType = FieldFormats.getFormatType(fieldDatatypeAttributes.type);

        //catch the non-implemented pieces.
        let fieldDisplayValue = this.props.fieldRecord ? this.props.fieldRecord.display : "";
        let fieldRawValue = this.props.fieldRecord ? this.props.fieldRecord.value : "";

        let indicateRequiredOnField = !this.props.indicateRequiredOnLabel;

        //if the field prop has a width defined this affected the element's layout so add the class to indicate
        let classes = '';
        if (_.has(this.props, 'relatedField.datatypeAttributes.clientSideAttributes.width') && this.props.relatedField.datatypeAttributes.clientSideAttributes.width !== 50) {
            classes = 'fieldInputWidth';
        }

        let fieldElement = this.props.edit ?
            <FieldValueEditor type={fieldType}
                            value={fieldRawValue}
                            display={fieldDisplayValue}
                            attributes={fieldDatatypeAttributes}
                            fieldDef = {this.props.relatedField}
                            indicateRequired={indicateRequiredOnField}
                            onChange={this.onChange}
                            onBlur={this.onBlur}
                            onKeyDown={this.onKeyDown}
                            onValidated={this.props.onValidated}
                            isInvalid={this.props.isInvalid}
                            key={'fve-' + this.props.idKey}
                            idKey={'fve-' + this.props.idKey}
                            invalidMessage={this.props.invalidMessage}
                            classes={classes}/> :
            ((fieldDisplayValue !== null || fieldRawValue !== null) && <FieldValueRenderer type={fieldType}
                            key={'fvr-' + this.props.idKey}
                            idKey={'fvr-' + this.props.idKey}
                            value={fieldRawValue}
                            display={fieldDisplayValue}
                            attributes={fieldDatatypeAttributes}
                            fieldDef = {this.props.relatedField} />);
        return (
            <div className="formElement field">
                {this.props.includeLabel && <FieldLabelElement element={this.props.element} relatedField={this.props.relatedField} indicateRequiredOnLabel={this.props.indicateRequiredOnLabel} /> }

                <span className="cellWrapper">
                    { fieldElement }
                </span>
            </div>);
    }
});

export default FieldElement;
