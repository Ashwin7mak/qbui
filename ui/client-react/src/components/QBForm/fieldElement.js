import React from 'react';

import FieldLabelElement from './fieldLabelElement';
import FieldValueRenderer from '../fields/fieldValueRenderer';
import FieldValueEditor from '../fields/fieldValueEditor';
import FieldFormats from '../../utils/fieldFormats';
import FieldUtils from '../../utils/fieldUtils';
import constants from '../../../../common/src/constants';
import './qbform.scss';
import _ from 'lodash';
import {editRecordValidateField} from '../../actions/recordActions';
import {connect} from 'react-redux';

//TODO currently all fields have a default width of 50 defined by core. This needs to be fixed -- specific field types should have specific defaults
const DEFAULT_FIELD_WIDTH = 50;
/**s
 * render a form field value, optionally with its label
 */
export const FieldElement = React.createClass({
    displayName: 'FieldElement',
    propTypes: {
        element: React.PropTypes.object, // FormFieldElement from form API
        relatedField: React.PropTypes.object, // field from Form data
        fieldRecord: React.PropTypes.object, // the record data
        includeLabel: React.PropTypes.bool, // render label above field (otherwise ignore it)
        appUsers: React.PropTypes.array.isRequired, // app users,
        removeFieldFromForm: React.PropTypes.func,
        goToParent: React.PropTypes.func, //handles drill down to parent
        masterTableId: React.PropTypes.string,
        masterAppId: React.PropTypes.string,
        masterFieldId: React.PropTypes.number
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
        let fieldLabel = '';
        if (this.props.element.useAlternateLabel) {
            fieldLabel = this.props.element.displayText;
        } else {
            fieldLabel = this.props.relatedField ? this.props.relatedField.name : "";
        }

        this.props.editRecordValidateField(this.props.recId, this.props.relatedField, fieldLabel, theVals.value);
        let change = this.getChanges(theVals);
        if (this.props.onBlur) {
            this.props.onBlur(change);
        }
    },

    render() {
        let fieldDatatypeAttributes = this.props.relatedField && this.props.relatedField.datatypeAttributes ?
            this.props.relatedField.datatypeAttributes : {};
        let relatedField = this.props.relatedField;
        let fieldType = FieldFormats.getFormatType(relatedField);

        //catch the non-implemented pieces.
        let fieldDisplayValue = this.props.fieldRecord ? this.props.fieldRecord.display : "";
        let fieldRawValue = this.props.fieldRecord ? this.props.fieldRecord.value : "";

        let indicateRequiredOnField = !this.props.indicateRequiredOnLabel;

        // If the form element has showAsRadio prop - pass it down as a part of fieldDef
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
                                             isDisabled={this.props.isDisabled}
                                             classes={classes}
                                             appUsers={this.props.appUsers}
                                             app={this.props.app}
                                             tblId={this.props.tblId}
                                             location={this.props.location}
                                             label={FieldUtils.getFieldLabel(this.props.element, this.props.relatedField)}
                                             tabIndex={this.props.tabIndex}
                                             removeFieldFromForm={this.props.removeFieldFromForm}
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
                                               goToParent={this.props.goToParent}
                                               masterTableId={this.props.masterTableId}
                                               masterAppId={this.props.masterAppId}
                                               masterFieldId={this.props.masterFieldId}
            />;
        }

        return (
            <div className="formElement field">
                {this.props.includeLabel &&
                <FieldLabelElement
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

const mapStateToProps = (state) => {
    return {
        record: state.record
    };
};

// similarly, abstract out the Redux dispatcher from the presentational component
// (another bit of boilerplate to keep the component free of Redux dependencies)
const mapDispatchToProps = {
    editRecordValidateField
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FieldElement);
