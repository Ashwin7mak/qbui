import React, {PropTypes} from 'react';
import _ from 'lodash';
import QBPanel from '../QBPanel/qbpanel.js';
import Tabs, {TabPane} from 'rc-tabs';
import FieldElement from './fieldElement';
import Locale from '../../locales/locales';
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

    propTypes: {
        /**
         * Boolean that indicates whether to display the form in edit mode or view mode */
        edit: PropTypes.bool,

        /**
         * Boolean that indicates whether the form itself is currently being edited */
        editingForm: PropTypes.bool,

        /**
         * The order index of the tab to display */
        activeTab: PropTypes.string,

        /**
         * Data used to display the form. Expect formMeta to be in an array based structure. */
        formData: PropTypes.shape({
            record: PropTypes.array,
            fields: PropTypes.array,
            formMeta: PropTypes.object
        })
    },

    getDefaultProps() {
        return {
            activeTab: '0'
        };
    },

    /**
     * get the form data field
     * @param fieldId
     * @returns the field from formdata fields with the field ID
     */
    getRelatedField(fieldId) {
        let fields = this.props.formData.fields || [];

        return _.find(fields, field => field.id === fieldId);
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

    getFieldValidationStatus(fieldId) {
        let validationResult = {
            isInvalid : false,
            invalidMessage: ''
        };

        if (_.has(this.props, 'pendEdits.editErrors.errors') && this.props.pendEdits.editErrors.errors.length) {
            let relatedError = _.find(this.props.pendEdits.editErrors.errors, error => error.id === fieldId);

            if (relatedError) {
                validationResult.isInvalid = relatedError.isInvalid;
                validationResult.invalidMessage = relatedError.invalidMessage;
            }
        }

        return validationResult;
    },

    /**
     * create a tab pane
     * @param tab tab data (sections)
     * @param numberOfTabs
     * @returns {XML}
     */
    createTab(tab, numberOfTabs) {
        let sections = null;
        if (tab.sections && Array.isArray(tab.sections)) {
            sections = tab.sections.map(section => this.createSection(section));
        }

        if (numberOfTabs > 1) {
            return (
                <TabPane key={tab.orderIndex} tab={tab.title || `${Locale.getMessage('form.tab')} ${tab.orderIndex}`}>
                    <div className="tabContent">
                        {sections}
                    </div>
                </TabPane>
            );
        } else {
            return (
                <div className="noTabForm tabContent">
                    {sections}
                </div>
            );
        }
    },

    /**
     * create a section
     * @param section data
     */
    createSection(section) {
        let sectionTitle = '';

        // build the section header.
        if (_.has(section, 'headerElement.FormHeaderElement.displayText')) {
            sectionTitle = section.headerElement.FormHeaderElement.displayText;
        }

        /*
         A section is marked as pseudo if its the user did not select a set of elements to be part of a section but for uniformity of structure core
         adds a section around these elements. In this case the interface is similar to a section except for collapsible behavior.
         A section is also treated non-collapsible if its the first section and has no elements or no header
         */

        const collapsible = !(section.pseudo || (section.orderIndex === 0 && (!sectionTitle.length || section.isEmpty)));

        const wrapLabels = !_.has(this.props, "formData.formMeta.wrapLabel") || this.props.formData.formMeta.wrapLabel;

        let columns = null;
        if (section.columns && Array.isArray(section.columns)) {
            columns = section.columns.map(column => this.createColumn(column, section.columns.length));
        }

        return (
            <QBPanel className="formSection"
                     title={sectionTitle}
                     key={section.id}
                     isOpen={true}
                     panelNum={section.orderIndex}
                     collapsible={collapsible}
                     wrapLabels={wrapLabels}>
                <div className="formTable">
                    {columns}
                </div>
            </QBPanel>
        );
    },

    createColumn(column, numberOfColumns) {
        let rows = null;
        if (column.rows && Array.isArray(column.rows)) {
            rows = column.rows.map(row => this.createRow(row));
        }

        return (
            <div key={column.id} className="sectionColumn" style={{width: `${100 / numberOfColumns}%`}}>
                <div className="sectionRows">
                    {rows}
                </div>
            </div>
        );
    },

    createRow(row) {
        let elements = null;
        if (row.elements && Array.isArray(row.elements)) {
            elements = row.elements.map(element => this.createElement(element, row.elements.length));
        }

        return (
            <div key={row.id} className="sectionRow">
                {elements}
            </div>
        );
    },

    createElement(element, numberOfChildren) {
        let formattedElement;
        let width = {width: `${100 / numberOfChildren}%`};

        if (element.FormTextElement) {
            formattedElement = this.createTextElement(element.id, element.FormTextElement, width);
        } else if (element.FormFieldElement) {
            let validationStatus =  this.getFieldValidationStatus(element.FormFieldElement.fieldId, width);
            formattedElement = this.createFieldElement(element.id, element.FormFieldElement, validationStatus, width, element.location);
        } else if (element.ReferenceElement) {
            formattedElement = this.createChildReportElement(element.id, element.ReferenceElement, width);
        }

        return formattedElement;
    },

    /**
     * create a form field element
     * @param id
     * @param FormFieldElement
     * @param validationStatus
     * @returns {XML}
     */
    createFieldElement(id, FormFieldElement, validationStatus, style, location) {

        let relatedField = this.getRelatedField(FormFieldElement.fieldId);
        let fieldRecord = this.getFieldRecord(relatedField);

        //if the form prop calls for element to be required update fieldDef accordingly
        if (relatedField) {
            relatedField.required = relatedField.required || FormFieldElement.required;
        }

        let CurrentFieldElement = (this.props.editingForm ? DragAndDropField(FieldElement) : FieldElement);

        return (
            <div key={id} className="formElementContainer" style={style}>
              <CurrentFieldElement
                  location={location}
                  orderIndex={FormFieldElement.orderIndex}
                  handleFormReorder={this.props.handleFormReorder}
                  element={FormFieldElement}
                  key={`element-${FormFieldElement.id}`}
                  idKey={"fe-" + this.props.idKey}
                  relatedField={relatedField}
                  fieldRecord={fieldRecord}
                  includeLabel={true}
                  indicateRequiredOnLabel={this.props.edit}
                  edit={this.props.edit && !FormFieldElement.readOnly}
                  onChange={this.props.onFieldChange}
                  onBlur={this.props.onFieldChange}
                  isInvalid={validationStatus.isInvalid}
                  invalidMessage={validationStatus.invalidMessage}
                  appUsers={this.props.appUsers}
              />
            </div>
        );
    },

    /**
     * create a text element
     * @returns {XML}
     * @param id
     * @param FormTextElement
     */
    createTextElement(id, FormTextElement, style) {
        return <div key={id} className="formElementContainer formElement text" style={style}>{FormTextElement.displayText}</div>;
    },

    /**
     * Create an element which wraps an embedded child report or a link to a child report.
     * @returns {XML}
     * @param id
     * @param ReferenceElement
     * @param style
     */
    createChildReportElement(id, ReferenceElement, style) {
        // Find the relationship object for this element.
        // This element represents a single relationship from the `formMeta.relationships` array.
        // The `element.relationshipId` is the index offset within the relationship array.
        const relationship = _.get(this, `props.formData.formMeta.relationships[${ReferenceElement.relationshipId}]`, {});

        // Find the foreign key value. This is the value stored in one of the master record's fields
        // the field id is specified as 'masterFieldId' in the relationship object.
        const relatedField = this.getRelatedField(relationship.masterFieldId);
        const fieldRecord = this.getFieldRecord(relatedField);
        const detailKeyValue = _.get(fieldRecord, 'value');

        // Find the child table's name.
        const tables = _.get(this, 'props.selectedApp.tables');
        const childTable = _.find(tables, {id: relationship.detailTableId}) || {};
        const childTableName = childTable.name;

        return (
            <div key={id} className="formElementContainer formElement referenceElement" style={style}>
                <RelatedChildReport
                    appId={_.get(relationship, "appId")}
                    childTableId={_.get(relationship, "detailTableId")}
                    childReportId={_.get(relationship, 'childDefaultReportId')}
                    childTableName={childTableName}
                    detailKeyFid={_.get(relationship, "detailFieldId")}
                    detailKeyValue={detailKeyValue}
                />
            </div>
        );
    },

    /**
     * Create a form footer with built-in fields
     */
    createFormFooter() {
        let fields = this.getBuiltInFieldsForFooter();

        let message = [];
        fields.forEach((field, index) => {
            if (field.type === Constants.USER) {
                let user = {
                    screenName: field.screenName,
                    email: field.email
                };
                let display = field.screenName + ". ";

                message.push(<span key={index} className="fieldNormalText">{field.name}</span>);
                message.push(<span key={`${index}-link`} className="fieldLinkText"><UserFieldValueRenderer value={user} display={display} /></span>);
            } else {
                message.push(<span key={index} className="fieldNormalText">{`${field.name} ${field.value}. `}</span>);
            }
        });

        return (
            <div className="formFooter">
                {message}
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
        let formFooter = [];
        if (this.props.formData && this.props.formData.formMeta.includeBuiltIns) {
            formFooter = this.createFormFooter();
        }

        let tabs = [];
        if (_.has(this.props, 'formData.formMeta.tabs') && Array.isArray(this.props.formData.formMeta.tabs)) {
            tabs = this.props.formData.formMeta.tabs.map(tab => this.createTab(tab, this.props.formData.formMeta.tabs.length));
        }

        const formContent = tabs.length < 2 ? tabs : <Tabs activeKey={this.props.activeTab}>{tabs}</Tabs>;

        return (
            <div className="formContainer">
                <form className={this.props.edit ? 'editForm' : 'viewForm'}>
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
