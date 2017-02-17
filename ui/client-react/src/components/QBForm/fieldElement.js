import React from 'react';

import Fluxxor from 'fluxxor';
import FieldLabelElement from './fieldLabelElement';
import FieldValueRenderer from '../fields/fieldValueRenderer';
import FieldValueEditor from '../fields/fieldValueEditor';
import FieldFormats from '../../utils/fieldFormats';
import FieldUtils from '../../utils/fieldUtils';
import './qbform.scss';

import getFlux from '../../scripts/fluxxor';
let fluxxor = getFlux();

let FluxMixin = Fluxxor.FluxMixin(React);
//TODO currently all fields have a default width of 50 defined by core. This needs to be fixed -- specific field types should have specific defaults
const DEFAULT_FIELD_WIDTH = 50;
/**s
 * render a form field value, optionally with its label
 */
export const FieldElement = React.createClass({
    mixins: [FluxMixin],
    displayName: 'FieldElement',
    propTypes: {
        element: React.PropTypes.object, // FormFieldElement from form API
        relatedField: React.PropTypes.object, // field from Form data
        fieldRecord: React.PropTypes.object, // the record data
        includeLabel: React.PropTypes.bool, // render label above field (otherwise ignore it)
        appUsers: React.PropTypes.array.isRequired // app users
    },

    getChanges(theVals) {
        let fid = this.props.relatedField.id;
        let fieldLabel = '';
        if (this.props.element.useAlternateLabel) {
            fieldLabel = this.props.element.displayText;
        } else {
            fieldLabel = this.props.relatedField ? this.props.relatedField.name : "";
        }
        let change = {
            values: {
                oldVal: this.props.fieldRecord,
                newVal: {value: theVals.value, display: theVals.display}
            },
            fid: +fid,
            fieldName: fieldLabel,
            fieldDef: this.props.relatedField
        };
        return change;
    },

    onChange(newVal) {
        //bubble up onChange with the old/new values
        let change = this.getChanges({value: newVal, display: newVal});
        if (this.props.onChange) {
            this.props.onChange(change);
        }
    },

    onBlur(theVals) {
        const flux = this.getFlux();
        let fieldLabel = '';
        if (this.props.element.useAlternateLabel) {
            fieldLabel = this.props.element.displayText;
        } else {
            fieldLabel = this.props.relatedField ? this.props.relatedField.name : "";
        }
        flux.actions.recordPendingValidateField(this.props.relatedField, fieldLabel, theVals.value);
        let change = this.getChanges(theVals);
        if (this.props.onBlur) {
            this.props.onBlur(change);
        }
    },

    render() {
        let fieldDatatypeAttributes = this.props.relatedField && this.props.relatedField.datatypeAttributes ?
            this.props.relatedField.datatypeAttributes : {};
        let fieldType = FieldFormats.getFormatType(fieldDatatypeAttributes);

        //catch the non-implemented pieces.
        let fieldDisplayValue = this.props.fieldRecord ? this.props.fieldRecord.display : "";
        let fieldRawValue = this.props.fieldRecord ? this.props.fieldRecord.value : "";

        let indicateRequiredOnField = !this.props.indicateRequiredOnLabel;

        // If the form element has showAsRadio prop - pass it down as a part of fieldDef
        let relatedField = this.props.relatedField;
        if (this.props.element && this.props.element.showAsRadio) {
            relatedField.showAsRadio = true;
        }

        //if the field prop has a width defined this affected the element's layout so add the class to indicate
        // TODO: this needs to be fixed on core to NOT send 50 for defaults. Defaults should be only set on client side.
        // So for now if an element doesnt have the default width respect it otherwise not.
        let classes = '';
        if (_.has(this.props, 'relatedField.datatypeAttributes.clientSideAttributes.width') && this.props.relatedField.datatypeAttributes.clientSideAttributes.width !== DEFAULT_FIELD_WIDTH) {
            classes = 'fieldInputWidth';
        }
        let isEditable = this.props.edit && FieldUtils.isFieldEditable(this.props.relatedField);

        let fieldElement = null;
        if (isEditable) {
            fieldElement = <FieldValueEditor type={fieldType}
                                             value={fieldRawValue}
                                             display={fieldDisplayValue}
                                             attributes={fieldDatatypeAttributes}
                                             fieldDef = {relatedField}
                                             indicateRequired={indicateRequiredOnField}
                                             onChange={this.onChange}
                                             onBlur={this.onBlur}
                                             onKeyDown={this.onKeyDown}
                                             onValidated={this.props.onValidated}
                                             isInvalid={this.props.isInvalid}
                                             isFormView={true}
                                             includeUnits={true}
                                             key={'fve-' + this.props.idKey}
                                             idKey={'fve-' + this.props.idKey}
                                             invalidMessage={this.props.invalidMessage}
                                             classes={classes}
                                             appUsers={this.props.appUsers}
                                             label={FieldUtils.getFieldLabel(this.props.element, this.props.relatedField)}
            />;
        } else if (fieldDisplayValue !== null || fieldRawValue !== null) { //if there is no value do not render the field
            fieldElement = <FieldValueRenderer type={fieldType}
                                               key={'fvr-' + this.props.idKey}
                                               idKey={'fvr-' + this.props.idKey}
                                               value={fieldRawValue}
                                               display={fieldDisplayValue}
                                               attributes={fieldDatatypeAttributes}
                                               includeUnits={true}
                                               fieldDef={this.props.relatedField}
                                               label={FieldUtils.getFieldLabel(this.props.element, this.props.relatedField)}
            />;
        }

        return (
            <div className="formElement field">
                {this.props.includeLabel &&
                    <FieldLabelElement
                        element={this.props.element}
                        relatedField={this.props.relatedField}
                        indicateRequiredOnLabel={this.props.indicateRequiredOnLabel}
                        isInvalid={this.props.isInvalid}
                        label={FieldUtils.getFieldLabel(this.props.element, this.props.relatedField)}
                    /> }

                <span className="cellWrapper">
                    { fieldElement }
                </span>
            </div>);
    }
});

/**
 * We need to create an HOC with flux, because upper level components are now connected to redux
 * and no longer pass down flux. Can be removed once pending edits store is in Redux
 * https://quickbase.atlassian.net/browse/MB-2183
 * @param FieldElementComponent
 * @returns {function(*): XML}
 * @constructor
 */
const FieldElementWithFlux = FieldElementComponent => {
    return (props) => <FieldElementComponent flux={fluxxor} {...props}/>;
};

export default FieldElementWithFlux(FieldElement);
