import React, {PropTypes} from 'react';
import _ from 'lodash';
import QBPanel from '../QBPanel/qbpanel.js';
import Tabs, {TabPane} from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';
import FieldElement from './fieldElement';
import Locale from '../../locales/locales';
import Constants from '../../../../common/src/constants';
import UserFieldValueRenderer from '../fields/userFieldValueRenderer.js';
import DragAndDropField from '../formBuilder/dragAndDropField';
import RelatedChildReport from './relatedChildReport';
import FlipMove from 'react-flip-move';

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
        }),

        /**
         * Whether to display animation when reordering elements on a field in builder mode */
        hasAnimation: PropTypes.bool,
    },

    getDefaultProps() {
        return {
            activeTab: '0',
            hasAnimation: false,
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

    /**
     * Gets the current validation status of a field for display on the form
     * @param fieldId
     * @returns {{isInvalid: boolean, invalidMessage: string}}
     */
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
     * @param location
     * @returns {XML}
     */
    createTab(tab, numberOfTabs, location = {}) {
        location.tabIndex = tab.orderIndex;

        let sections = null;
        if (tab.sections && Array.isArray(tab.sections)) {
            sections = tab.sections.map(section => this.createSection(section, location));
        }

        if (numberOfTabs > 1) {
            return (
                <TabPane key={tab.orderIndex} tab={tab.title || `${Locale.getMessage('form.tab')} ${tab.orderIndex}`}>
                    <div className={`tabContent tab-${tab.orderIndex}`}>
                        {sections}
                    </div>
                </TabPane>
            );
        } else {
            return (
                <div key={0} className="noTabForm tabContent">
                    {sections}
                </div>
            );
        }
    },

    /**
     * create a section
     * @param section data
     * @param location
     */
    createSection(section, location) {
        let newLocation = Object.assign({}, location, {sectionIndex: section.orderIndex});

        // build the section header.
        let sectionTitle = '';
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
            columns = section.columns.map(column => this.createColumn(column, section.columns.length, newLocation));
        }

        return (
            <QBPanel className="formSection"
                     title={sectionTitle}
                     key={section.id}
                     isOpen={true}
                     panelNum={section.orderIndex}
                     collapsible={collapsible}
                     wrapLabels={wrapLabels}>
                <div className={`formTable section-${section.orderIndex}`}>
                    {columns}
                </div>
            </QBPanel>
        );
    },

    /**
     * Creates a column of rows on the form
     * @param column
     * @param numberOfColumns
     * @param location
     * @returns {XML}
     */
    createColumn(column, numberOfColumns, location) {
        let elements = null;

        let newLocation = Object.assign({}, location, {columnIndex: column.orderIndex});

        if (column.elements && Array.isArray(column.elements)) {
            elements = column.elements.map(element => this.createElement(element, newLocation));
        }

        let arrangedElements = elements;
        if (this.props.hasAnimation && this.props.editingForm) {
            // Adds animation when field elements are moved during form editing.
            // The animation also callbacks to update the animating state to make sure drop events are not called
            // when elements are passing each other during animation.
            arrangedElements = (
                <FlipMove
                    duration={200}
                    easing="ease"
                    appearAnimation="accordionVertical"
                    staggerDelayBy={0}
                    staggerDurationBy={0}
                    delay={0}
                    onStartAll={() => this.props.updateAnimationState(true)}
                    onFinishAll={() => this.props.updateAnimationState(false)}
                >
                    {elements}
                </FlipMove>
            );
        }

        return (
            <div key={column.id} className="sectionColumn" style={{width: `${100 / numberOfColumns}%`}}>
                {arrangedElements}
            </div>
        );
    },

    /**
     * Finds the location for the passed in element
     * @param element
     * @param location
     */
    findLocationOfElement(element, location) {
        if (!element) {return {};}

        if (_.has(element, 'props.children.props.location')) {
            return element.props.children.props.location;
        }
        return Object.assign({}, location, {elementIndex: element.props.orderIndex ? element.props.orderIndex : 0});
    },

    /**
     * Creates an element on the form
     * @param element
     * @param location
     * @returns {*}
     */
    createElement(element, location) {
        let formattedElement;
        let newLocation = Object.assign({}, location, {elementIndex: element.orderIndex});

        if (element.FormTextElement) {
            formattedElement = this.createTextElement(element.id, element.FormTextElement);
        } else if (element.FormFieldElement) {
            let validationStatus =  this.getFieldValidationStatus(element.FormFieldElement.fieldId);
            formattedElement = this.createFieldElement(element.FormFieldElement, validationStatus, element, newLocation);
        } else if (element.ReferenceElement) {
            formattedElement = this.createChildReportElement(element.id, element.ReferenceElement);
        }

        return formattedElement;
    },

    /**
     * create a form field element
     * @param FormFieldElement
     * @param validationStatus
     * @param style
     * @param containingElement
     * @param location
     * @returns {XML}
     */
    createFieldElement(FormFieldElement, validationStatus, containingElement, location) {

        let relatedField = this.getRelatedField(FormFieldElement.fieldId);
        let fieldRecord = this.getFieldRecord(relatedField);

        //if the form prop calls for element to be required update fieldDef accordingly
        if (relatedField) {
            relatedField.required = relatedField.required || FormFieldElement.required;
        }

        let CurrentFieldElement = (this.props.editingForm ? DragAndDropField(FieldElement) : FieldElement);
        let tabIndex = (this.props.editingForm ? "-1" : 0);
        return (
            <div key={containingElement.id} className="formElementContainer">
              <CurrentFieldElement
                  tabIndex={tabIndex}
                  location={location}
                  orderIndex={FormFieldElement.orderIndex}
                  handleFormReorder={this.props.handleFormReorder}
                  cacheDragElement={this.props.cacheDragElement}
                  clearDragElementCache={this.props.clearDragElementCache}
                  containingElement={containingElement}
                  element={FormFieldElement}
                  key={`fieldElement-${containingElement.id}`}
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
     * @param style
     */
    createTextElement(id, FormTextElement) {
        return <div key={id} className="formElementContainer formElement text">{FormTextElement.displayText}</div>;
    },

    /**
     * Create an element which wraps an embedded child report or a link to a child report.
     * @returns {XML}
     * @param id
     * @param ReferenceElement
     * @param style
     */
    createChildReportElement(id, ReferenceElement) {
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
            <div key={id} className="formElementContainer formElement referenceElement">
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

        let footerElements = fields.map((field, index) => {
            if (field.type === Constants.USER) {
                let user = {
                    screenName: field.screenName,
                    email: field.email
                };
                let display = field.screenName + ". ";

                return (
                    <div className="userInFooter" key={index}>
                        <span key={index} className="fieldNormalText">{field.name}</span>
                        <span key={`${index}-link`} className="fieldLinkText"><UserFieldValueRenderer value={user} display={display} /></span>
                    </div>
                );
            } else {
                return (
                    <div key={index} className="fieldNormalText">{`${field.name} ${field.value}. `}</div>
                );
            }
        });

        return (
            <div className="formFooter">
                {footerElements}
            </div>
        );
    },

    /**
     * Get built-in type fields from form fields collection
     */
    getBuiltInFieldsForFooter() {

        let fields = this.props.formData.fields;
        let values = this.props.formData.record;

        if (!fields || !values) {
            return [];
        }

        const {DATE_CREATED, DATE_MODIFIED, RECORD_OWNER, LAST_MODIFIED_BY} = Constants.BUILTIN_FIELD_ID;
        const footerFields = [DATE_CREATED, DATE_MODIFIED, RECORD_OWNER, LAST_MODIFIED_BY];

        let builtInFooterFields = fields.filter(field => footerFields.includes(field.id));

        return builtInFooterFields.map(builtInField => {
            let fieldValue = values.find(currentFieldValue => currentFieldValue.id === builtInField.id);

            switch (builtInField.id) {
            case LAST_MODIFIED_BY :
                return buildUserField(LAST_MODIFIED_BY, fieldValue, 'form.footer.lastUpdatedBy');

            case DATE_CREATED :
                return {
                    name: Locale.getMessage('form.footer.createdOn'),
                    value: fieldValue.display,
                    id: DATE_CREATED,
                    type: Constants.DATE
                };

            case DATE_MODIFIED :
                return {
                    name: Locale.getMessage('form.footer.lastUpdatedOn'),
                    value: fieldValue.display,
                    id: DATE_MODIFIED,
                    type: Constants.DATE
                };

            case RECORD_OWNER :
                return buildUserField(RECORD_OWNER, fieldValue, 'form.footer.ownedBy');
            }
        });
    },

    isEditingForm(formContent) {
        if (this.props.editingForm) {
            return (
                <form className={this.props.edit ? 'editForm' : 'viewForm'} tabIndex="0" role="buton" onKeyDown={this.props.formBuilderUpdateChildrenTabIndex}>
                    {formContent}
                </form>
            );
        } else {
            return (
                <form className='viewForm'>
                    {formContent}
                </form>
            );
        }
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

        let formContent;
        if (tabs.length < 2) {
            formContent = tabs;
        } else {
            formContent = (
                <Tabs
                    activeKey={this.props.activeTab}
                    renderTabBar={() => <ScrollableInkTabBar />}
                    renderTabContent={() => <TabContent />}
                >{tabs}</Tabs>
            );
        }

        return (
            <div className="formContainer">
                {this.isEditingForm(formContent)}
                <div>{formFooter}</div>
            </div>
        );
    }
});

/**
 * Creates a field object for a built in user type
 * @param id
 * @param fieldValue
 * @param name - The i18n message key for the field label
 */
function buildUserField(id, fieldValue, name) {
    return {
        name: Locale.getMessage(name),
        value: fieldValue.display,
        email: fieldValue.value.email,
        screenName: fieldValue.value.screenName,
        id: id,
        type: Constants.USER
    };
}

export default QBForm;
