import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import QBPanel from '../QBPanel/qbpanel.js';
import Tabs, {TabPane} from 'rc-tabs';
import FieldElement from './fieldElement';
import FieldLabelElement from './fieldLabelElement';
import Breakpoints from '../../utils/breakpoints';
import Locale from '../../locales/locales';
import FieldUtils from '../../utils/fieldUtils';
import Constants from '../../../../common/src/constants';
import UserFieldValueRenderer from '../fields/userFieldValueRenderer.js';
import DragAndDropField from '../formBuilder/dragAndDropField';
import RelatedChildReport from './relatedChildReport';

import './qbform.scss';
import './tabs.scss';

/*
 Custom QuickBase Form component that has 1 property.
 activeTab: the tab we want to display first when viewing the form, defaults to the first tab
 */
let QBForm = React.createClass({
    displayName: 'QBForm',

    statics: {
        LABEL_ABOVE: "ABOVE", // label is in same cell as field value, above it
        LABEL_LEFT: "LEFT"    // label is in a separate cell as the fielv value, to its left
    },

    propTypes: {
        editingForm: React.PropTypes.bool,
        activeTab: React.PropTypes.string,
        formData: React.PropTypes.shape({
            record: React.PropTypes.array,
            fields: React.PropTypes.array,
            formMeta: React.PropTypes.object
        })
    },

    getDefaultProps() {
        return {
            activeTab: '0'
        };
    },

    /**
     * helper function to get object props from this craptastical JSON we get from the server
     * @param element
     * @returns FormTextElement, FormFieldElement, or ChildReportElement object properties
     *          (whichever is present)
     */
    getElementProps(element) {
        return _.values(element)[0] || {};
    },

    /**
     * get table cell (or 2 table cells) for the section element
     * @param element section element
     * @param orderIndex
     * @param labelPosition above or left
     * @param isLast is this the last cell in the row?
     * @returns {Array}
     */
    getTableCells(element, orderIndex, labelPosition, isLast) {

        const colSpan = isLast ? 100 : 1;

        // Turn off left labels to get Drag & Drop Working.
        // Fix with: https://quickbase.atlassian.net/browse/MC-171
        const leftLabel = false;

        const cells = [];
        if (element.FormTextElement) {
            cells.push(this.createTextElementCell(element.FormTextElement, orderIndex, colSpan));
        } else if (element.FormFieldElement) {
            let validationStatus =  this.getFieldValidationStatus(element.FormFieldElement.fieldId);
            // if we are positioning labels on the left, use a separate TD for the label and value so all columns line up
            if (leftLabel) {
                cells.push(this.createFieldLabelCell(element.FormFieldElement, orderIndex, validationStatus));
            }
            cells.push(this.createFieldElementCell(element.FormFieldElement, orderIndex, !leftLabel, colSpan, validationStatus));
        } else if (element.ReferenceElement) {
            if (leftLabel) {
                cells.push(this.createFieldLabelCell(element.ReferenceElement, orderIndex, {}));
            }
            cells.push(this.createChildReportElementCell(element.ReferenceElement, orderIndex, colSpan));
        }

        return cells;
    },

    /**
     * get the form data field
     * @param fieldId
     * @returns the field from formdata fields with the field ID
     */
    getRelatedField(fieldId) {
        let fields = this.props.formData.fields || [];

        return _.find(fields, field => {
            if (field.id === fieldId) {
                return true;
            }
        });
    },

    /**
     * get the form record
     * @param fieldId
     * @returns the record entry from formdata record array with the field ID
     */
    getFieldRecord(field) {
        if (field) {
            const fieldId = field.id;
            if (this.props.pendEdits && this.props.pendEdits.recordChanges && this.props.pendEdits.recordChanges[fieldId]) {
                let vals = {};
                vals.id = fieldId;
                vals.value = this.props.pendEdits.recordChanges[fieldId].newVal.value;
                vals.display = this.props.pendEdits.recordChanges[fieldId].newVal.display;
                return vals;
            }

            let record = this.props.formData.record || [];

            let fieldRecord = _.find(record, val => {
                if (val.id === fieldId) {
                    return true;
                }
            });

            // If the fieldRecord.value exists or is a boolean (for checkbox fields), then return the field record
            // otherwise set the default values if available
            if (fieldRecord && (fieldRecord.value || typeof fieldRecord.value === "boolean" || fieldRecord.value === 0)) {
                return fieldRecord;
            } else if (field.defaultValue && field.defaultValue.coercedValue) {
                fieldRecord = {};
                fieldRecord.display = field.defaultValue.displayValue;
                fieldRecord.value = field.defaultValue.coercedValue.value;
                return fieldRecord;
            }
        }
    },

    /**
     * create a TD with a field label
     * @param element
     * @param sectionIndex
     * @param validationStatus
     * @returns {XML}
     */
    createFieldLabelCell(element, sectionIndex, validationStatus) {

        let relatedField = this.getRelatedField(element.fieldId);

        let key = "fieldLabel" + sectionIndex + "-" + element.orderIndex;

        return (
            <td key={key}>
                <FieldLabelElement
                    element={element}
                    relatedField={relatedField}
                    indicateRequiredOnLabel={this.props.edit}
                    isInvalid={validationStatus.isInvalid}
                    label={FieldUtils.getFieldLabel(element, relatedField)}
                />
            </td>);
    },

    getFieldValidationStatus(fieldId) {
        let validationResult = {
            isInvalid : false,
            invalidMessage: ""
        };
        if (_.has(this.props, 'pendEdits.editErrors.errors') && this.props.pendEdits.editErrors.errors.length) {
            let relatedError = _.find(this.props.pendEdits.editErrors.errors, (error) =>{
                return error.id === fieldId;
            });
            if (relatedError) {
                validationResult.isInvalid = relatedError.isInvalid;
                validationResult.invalidMessage = relatedError.invalidMessage;
            }
        }
        return validationResult;
    },

    /**
     * create a TD with a fielv value
     * @param element
     * @param sectionIndex
     * @param includeLabel
     * @param colSpan
     * @param validationStatus
     * @returns {XML}
     */
    createFieldElementCell(element, sectionIndex, includeLabel, colSpan, validationStatus) {

        let relatedField = this.getRelatedField(element.fieldId);

        let fieldRecord = this.getFieldRecord(relatedField);

        let key = "field" + sectionIndex + "-" + element.orderIndex;

        //if the form prop calls for element to be required update fieldDef accordingly
        if (relatedField) {
            relatedField.required = relatedField.required || element.required;
        }

        let CurrentFieldElement = (this.props.editingForm ? DragAndDropField(FieldElement) : FieldElement);

        return (
            <td key={key} colSpan={colSpan}>
              <CurrentFieldElement
                  tabIndex={0}
                  sectionIndex={sectionIndex}
                  orderIndex={element.orderIndex}
                  handleFormReorder={this.props.handleFormReorder}
                  element={element}
                  key={`fe-${element.fieldId}`}
                  idKey={"fe-" + this.props.idKey}
                  relatedField={relatedField}
                  fieldRecord={fieldRecord}
                  includeLabel={includeLabel}
                  indicateRequiredOnLabel={this.props.edit}
                  edit={this.props.edit && !element.readOnly}
                  onChange={this.props.onFieldChange}
                  onBlur={this.props.onFieldChange}
                  isInvalid={validationStatus.isInvalid}
                  invalidMessage={validationStatus.invalidMessage}
                  appUsers={this.props.appUsers}
              />
            </td>);
    },

    /**
     * create TD for a text element
     * @param element section element
     * @param sectionIndex
     * @param colSpan
     * @returns {XML}
     */
    createTextElementCell(element, sectionIndex, colSpan) {
        let key = "field-" + sectionIndex + "-" + element.orderIndex;
        return <td key={key} colSpan={colSpan}><div className="formElement text">{element.displayText}</div></td>;
    },

    /**
     * Create a TD element which wraps an embedded child report or a link to a child report.
     * @param {Object} element section element
     * @param {Number} sectionIndex this element's index within this section
     * @param {Number} colSpan used to set the width of the Element
     * @returns {Component}
     */
    createChildReportElementCell(element, sectionIndex, colSpan) {
        let key = 'relatedField-' + sectionIndex + '-' + element.orderIndex;
        const relationship = _.get(this, `props.formData.formMeta.relationships[${element.relationshipId}]`, {});
        const relatedField = this.getRelatedField(relationship.masterFieldId);
        const fieldRecord = this.getFieldRecord(relatedField);
        // TODO: this default report ID should be sent from the node layer, defaulting to 0 for now
        const childReportId = _.get(relationship, 'childDefaultReportId', 0);

        // find the child table so we can retrieve its table name
        const tables = _.get(this, 'props.selectedApp.tables');
        const childTable = _.find(tables, {id: relationship.detailTableId}) || {};
        return <td key={key}>
            <RelatedChildReport
                appId={_.get(relationship, "appId")}
                childTableId={_.get(relationship, "detailTableId")}
                childReportId={childReportId}
                childTableName={childTable.name}
                detailKeyFid={_.get(relationship, "detailFieldId")}
                detailKeyValue={_.get(fieldRecord, "value")}
            />
        </td>;
    },

    /**
     * create the <TR> elements
     * @param section section data
     * @param singleColumn force single column
     * @returns {Array} of TR elements
     */
    createSectionTableRows(section, singleColumn, tabIndex) {
        let rows = [];                  // the TR components
        let currentRowElements = [];    // the TD elements for the current row

        // label position is determined by the section settings unless we're in single column mode

        let labelPosition = singleColumn ? QBForm.LABEL_ABOVE : QBForm.LABEL_LEFT;

        if (!singleColumn && section.headerElement && section.headerElement.FormHeaderElement) {
            labelPosition = section.headerElement.FormHeaderElement.labelPosition;
        }

        Object.keys(section.elements).forEach((key, index, arr) => {

            // get the next section element
            let sectionElement = section.elements[key];

            let props = this.getElementProps(sectionElement);


            let formFieldId;
            if (_.has(sectionElement, 'FormFieldElement.fieldId')) {
                formFieldId = sectionElement.FormFieldElement.fieldId;
            } else {
                formFieldId = _.uniqueId('fieldContainer_');
            }

            let idKey = buildIdKey(tabIndex, section.orderIndex, formFieldId);

            if (singleColumn) {
                // just one TR containing the current element (a single TD)
                rows.push(
                    <tr key={idKey} className="fieldRow">
                        {this.getTableCells(sectionElement, section.orderIndex, labelPosition, true)}
                    </tr>
                );
                return;
            }

            if (index === arr.length - 1) {
                // the last element - add the final cell(s) to the row
                if (!props.positionSameRow) {
                    rows.push(<tr key={idKey} className="fieldRow">{currentRowElements}</tr>);
                    currentRowElements = [];
                }
                currentRowElements = currentRowElements.concat(this.getTableCells(sectionElement, section.orderIndex, labelPosition, true));
                rows.push(<tr key={buildIdKey(tabIndex, section.orderIndex, formFieldId + 1)} className="fieldRow">{currentRowElements}</tr>);
            } else {
                // look at the next element to see if it's on the same row - if not the current element is the last one on the row
                const nextSectionElement = section.elements[arr[index + 1]];
                const isLast = !this.getElementProps(nextSectionElement).positionSameRow;
                if (currentRowElements.length > 0 && !props.positionSameRow) {
                    // current element is not on the same row so save the current row and start a new one
                    rows.push(<tr key={idKey} className="fieldRow">{currentRowElements}</tr>);
                    currentRowElements = [];
                }
                // append the table cell(s) for the current element to the current row
                currentRowElements = currentRowElements.concat(this.getTableCells(sectionElement, section.orderIndex, labelPosition, isLast));
            }
        });
        return rows;
    },

    /**
     * create a section
     * @param section data
     * @param singleColumn force single column
     *
     */
    createSection(section, singleColumn, isFirstSection, tabIndex) {
        let sectionTitle = "";

        // build the section header.
        if (section.headerElement && section.headerElement.FormHeaderElement && section.headerElement.FormHeaderElement.displayText) {
            sectionTitle = section.headerElement.FormHeaderElement.displayText;
        }

        /*
        A section is marked as pseudo if its the user did not select a set of elements to be part of a section but for uniformity of structure core
        adds a section around these elements. In this case the interface is similar to a section except for collapsible behavior.
        A section is also treated non-collapsible if its the first section and has no elements or no header
         */

        const collapsible = !(section.pseudo || (isFirstSection && (!sectionTitle.length || !Object.keys(section.elements).length)));

        const wrapLabels = !_.has(this.props, "formData.formMeta.wrapLabel") || this.props.formData.formMeta.wrapLabel;

        return (
            <QBPanel className="formSection"
                     title={sectionTitle}
                     key={"section" + section.orderIndex}
                     isOpen={true}
                     panelNum={section.orderIndex}
                     collapsible={collapsible}
                     wrapLabels={wrapLabels}>
                <table className="formTable">
                    <tbody>
                        {this.createSectionTableRows(section, singleColumn, tabIndex)}
                    </tbody>
                </table>
            </QBPanel>
        );
    },

    /**
     * create a tab pane
     * @param tab tab data (sections)
     * @param singleColumn force single column (small screens)
     *
     */
    createTab(tab, singleColumn) {
        let sections = [];
        if (tab.sections) {
            Object.keys(tab.sections).forEach((key, index) => {
                sections.push(this.createSection(tab.sections[key], singleColumn, index === 0, tab.orderIndex));
            });
        }

        return (
            <TabPane key={tab.orderIndex} tab={tab.title || Locale.getMessage("form.tab") + ' ' + tab.orderIndex}>
                {sections}
            </TabPane>
        );
    },

    /**
     * Create a form footer with built-in fields
     */
    createFormFooter() {

        let fields = this.getBuiltInFieldsForFooter();
        var msg = [];
        for (var i = 0; i < fields.length; i++) {
            if (fields[i].type === Constants.USER) {
                let user = {
                    screenName: fields[i].screenName,
                    email: fields[i].email
                };
                let display = fields[i].screenName + ". ";
                msg.push(<span key={i} className="fieldNormalText">{fields[i].name}</span>);
                msg.push(<span key={i + "a"} className="fieldLinkText"><UserFieldValueRenderer value={user} display={display} /></span>);
            } else {
                msg.push(<span key={i} className="fieldNormalText">{fields[i].name + " " + fields[i].value + ". "}</span>);
            }

        }
        return (
            <div className="formFooter">
                {msg}
            </div>
        );
    },

    /**
     * Get built-in type fields from form fields collection
     */
    getBuiltInFieldsForFooter() {

        let fields = this.props.formData.fields;
        let values = this.props.formData.record;
        let biFields = _.filter(fields, function(fld) {return fld.builtIn && fld.name !== Constants.BUILTIN_FIELD_NAME.RECORD_ID;});
        const result = [];

        for (var fld in biFields) {
            let fldVal = _.find(values, ['id', biFields[fld].id]);

            if (fldVal && fldVal.value) {
                if (biFields[fld].name === Constants.BUILTIN_FIELD_NAME.LAST_MODIFIED_BY) {
                    result.push({
                        name: Locale.getMessage("form.footer.lastUpdatedBy"),
                        value: fldVal.display,
                        email: fldVal.value.email,
                        screenName: fldVal.value.screenName,
                        id: 1,
                        type: Constants.USER
                    });
                }
                if (biFields[fld].name === Constants.BUILTIN_FIELD_NAME.DATE_CREATED) {
                    result.push({
                        name: Locale.getMessage("form.footer.createdOn"),
                        value: fldVal.display,
                        id: 2,
                        type: Constants.DATE
                    });
                }
                if (biFields[fld].name === Constants.BUILTIN_FIELD_NAME.RECORD_OWNER) {
                    result.push({
                        name: Locale.getMessage("form.footer.ownedBy"),
                        value: fldVal.display,
                        email: fldVal.value.email,
                        screenName: fldVal.value.screenName,
                        id: 3,
                        type: Constants.USER
                    });
                }
            }
        }

        return result;
    },

    /**
     * render a form as an set of tabs containing HTML tables (a la legacy QuickBase)
     */
    render() {
        const tabChildren = [];
        const singleColumn = Breakpoints.isSmallBreakpoint();
        let formFooter = [];
        if (this.props.formData && this.props.formData.formMeta.includeBuiltIns) {
            let frm = this.props.formData;

            formFooter = this.createFormFooter();
        }

        // if (frm && <frm className="formMeta includeBuiltIns"></frm>) {
        //     formFooter = this.createFormFooter();
        // }
        if (this.props.formData &&  this.props.formData.formMeta && this.props.formData.formMeta.tabs) {
            let tabs = this.props.formData.formMeta.tabs;
            Object.keys(tabs).forEach(key => {
                tabChildren.push(this.createTab(tabs[key], singleColumn));
            });
        }
        const formContent = tabChildren.length < 2 ? tabChildren : <Tabs activeKey={this.props.activeTab}>{tabChildren}</Tabs>;
        return (
            <div className="formContainer">
                <form className={this.props.edit ? "editForm" : "viewForm"}>
                    {formContent}
                </form>
                <div>{formFooter}</div>
            </div>
        );
    }
});

/**
 * Build a consistent key that will be used anytime a form element appears on the page so
 * that it can be tracked by React.
 * @param tabIndex
 * @param sectionIndex
 * @param fieldId
 * @returns {string}
 */
function buildIdKey(tabIndex, sectionIndex, fieldId) {
    return `fieldContainer-tab-${tabIndex}-section-${sectionIndex}-field-${fieldId}`;
}

export default QBForm;
