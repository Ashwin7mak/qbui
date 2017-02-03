// import React, {PropTypes, Component} from 'react';
// import DraggableField from '../formBuilder/draggableField';
// import FieldElement from './fieldElement';
// import _ from 'lodash';
//
// function FieldElementContainer(props) {
//     /**
//      * get the form data field
//      * @param fieldId
//      * @returns the field from formdata fields with the field ID
//      */
//     function getRelatedField(fieldId) {
//         let fields = props.formData.fields || [];
//
//         return _.find(fields, field => {
//             if (field.id === fieldId) {
//                 return true;
//             }
//         });
//     }
//
//     /**
//      * get the form record
//      * @param fieldId
//      * @returns the record entry from formdata record array with the field ID
//      */
//     function getFieldRecord(field) {
//         if (field) {
//             const fieldId = field.id;
//             if (props.pendEdits && props.pendEdits.recordChanges && props.pendEdits.recordChanges[fieldId]) {
//                 let vals = {};
//                 vals.id = fieldId;
//                 vals.value = props.pendEdits.recordChanges[fieldId].newVal.value;
//                 vals.display = props.pendEdits.recordChanges[fieldId].newVal.display;
//                 return vals;
//             }
//
//             let record = props.formData.record || [];
//
//             let fieldRecord = _.find(record, val => {
//                 if (val.id === fieldId) {
//                     return true;
//                 }
//             });
//
//             // If the fieldRecord.value exists or is a boolean (for checkbox fields), then return the field record
//             // otherwise set the default values if available
//             if (fieldRecord && (fieldRecord.value || typeof fieldRecord.value === "boolean" || fieldRecord.value === 0)) {
//                 return fieldRecord;
//             } else if (field.defaultValue && field.defaultValue.coercedValue) {
//                 fieldRecord = {};
//                 fieldRecord.display = field.defaultValue.displayValue;
//                 fieldRecord.value = field.defaultValue.coercedValue.value;
//                 return fieldRecord;
//             }
//         }
//     }
//
//     /**
//      * create TD for a text element
//      * @param element section element
//      * @param sectionIndex
//      * @param colSpan
//      * @returns {XML}
//      */
//     function createTextElementCell(element, sectionIndex, colSpan) {
//         let key = "field" + sectionIndex + "-" + element.orderIndex;
//         return <td key={key} colSpan={colSpan}><div className="formElement text">{element.displayText}</div></td>;
//     }
//
//     /**
//      * create a TD with a field label
//      * @param element
//      * @param sectionIndex
//      * @param validationStatus
//      * @returns {XML}
//      */
//     function createFieldLabelCell(element, sectionIndex, validationStatus) {
//
//         let relatedField = getRelatedField(element.fieldId);
//
//         let key = "fieldLabel" + sectionIndex + "-" + element.orderIndex;
//
//         return (
//             <td key={key}>
//                 <FieldLabelElement
//                     element={element}
//                     relatedField={relatedField}
//                     indicateRequiredOnLabel={props.edit}
//                     isInvalid={validationStatus.isInvalid}
//                     label={FieldUtils.getFieldLabel(element, relatedField)}
//                 />
//             </td>);
//     }
//
//     /**
//      * create a TD with a fielv value
//      * @param element
//      * @param sectionIndex
//      * @param includeLabel
//      * @param colSpan
//      * @returns {XML}
//      */
//     function createFieldElementCell(element, sectionIndex, includeLabel, colSpan, validationStatus) {
//
//         let relatedField = getRelatedField(element.fieldId);
//
//         let fieldRecord = getFieldRecord(relatedField);
//
//         let key = "field" + sectionIndex + "-" + element.orderIndex;
//
//         //if the form prop calls for element to be required update fieldDef accordingly
//         if (relatedField) {
//             relatedField.required = relatedField.required || element.required;
//         }
//
//         return (
//             <td key={key} colSpan={colSpan}>
//                 <FieldElement element={element}
//                                      key={"fe-" + props.idKey}
//                                      idKey={"fe-" + props.idKey}
//                                      relatedField={relatedField}
//                                      fieldRecord={fieldRecord}
//                                      includeLabel={includeLabel}
//                                      indicateRequiredOnLabel={props.edit}
//                                      edit={props.edit && !element.readOnly}
//                                      onChange={props.onFieldChange}
//                                      onBlur={props.onFieldChange}
//                                      isInvalid={validationStatus.isInvalid}
//                                      invalidMessage={validationStatus.invalidMessage}
//                                      appUsers={props.appUsers}
//                 />
//             </td>);
//     }
//
//     function getFieldValidationStatus(fieldId) {
//         let validationResult = {
//             isInvalid : false,
//             invalidMessage: ""
//         };
//         if (_.has(props, 'pendEdits.editErrors.errors') && props.pendEdits.editErrors.errors.length) {
//             let relatedError = _.find(props.pendEdits.editErrors.errors, (error) =>{
//                 return error.id === fieldId;
//             });
//             if (relatedError) {
//                 validationResult.isInvalid = relatedError.isInvalid;
//                 validationResult.invalidMessage = relatedError.invalidMessage;
//             }
//         }
//         return validationResult;
//     }
//
//     /**
//      * TODO: actually render the child report as an embedded report.
//      * @param {Object} element section element
//      * @param {Number} sectionIndex this element's index within this section
//      * @param {Number} colSpan used to set the width of the Element
//      * @returns {Component}
//      */
//     createChildReportElementCell(element, sectionIndex, colSpan) {
//         let key = 'field' + sectionIndex + '-' + element.orderIndex;
//         // TODO: don't use globals
//         const relationship = window.relationships[element.relationshipId];
//         const relatedField = this.getRelatedField(relationship.masterFieldId);
//         const fieldRecord = this.getFieldRecord(relatedField);
//         const appId = _.get(relationship, 'appId');
//         const childTableId = _.get(relationship, 'detailTableId');
//         // TODO: this default report ID should be sent from the node layer, defaulting to 0 for now
//         const childReportId = _.get(relationship, 'childDefaultReportId', 0);
//         const fieldWithParentId = _.get(relationship, 'detailFieldId');
//         const parentRecordId = _.get(fieldRecord, 'value');
//
//         const link = UrlUtils.getRelatedChildReportLink(appId, childTableId, childReportId, fieldWithParentId, parentRecordId);
//         return <td key={key}><Link to={link}>Child Table</Link></td>;
//     }
//
//     /**
//      * get table cell (or 2 table cells) for the section element
//      * @param element section element
//      * @param orderIndex
//      * @param labelPosition above or left
//      * @param isLast is this the last cell in the row?
//      * @returns {Array}
//      */
//     function getTableCells(element, orderIndex, labelPosition, isLast) {
//
//         const colSpan = isLast ? 100 : 1;
//
//         const cells = [];
//         if (element.FormTextElement) {
//             cells.push(createTextElementCell(element.FormTextElement, orderIndex, colSpan));
//         }else if (element.FormFieldElement) {
//             let validationStatus = getFieldValidationStatus(element.FormFieldElement.fieldId);
//             // if we are positioning labels on the left, use a separate TD for the label and value so all columns line up
//             if (labelPosition === QBForm.LABEL_LEFT) {
//                 cells.push(createFieldLabelCell(element.FormFieldElement, orderIndex, validationStatus));
//             }
//             cells.push(createFieldElementCell(element.FormFieldElement, orderIndex, labelPosition === QBForm.LABEL_ABOVE, colSpan, validationStatus));
//         }else if (element.ReferenceElement) {
//             if (labelPosition === QBForm.LABEL_LEFT) {
//                 cells.push(createFieldLabelCell(element.ReferenceElement, orderIndex, {}));
//             }
//             cells.push(createChildReportElementCell(element.ReferenceElement, orderIndex, colSpan));
//         }
//
//         return cells;
//     }
//
//     return getTableCells(props.sectionElement, props.orderIndex, props.labelPosition, props.isLast);
//
// }
//
// FieldElementContainer.propTypes = {
//     sectionElement: PropTypes.any,
//     orderIndex: PropTypes.number,
//     labelPosition: PropTypes.string,
//     isLast: PropTypes.bool
// };
//
// export default FieldElementContainer;
