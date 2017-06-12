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
import ChildReport from './childReport';
import {CONTEXT} from "../../actions/context";
import FlipMove from 'react-flip-move';
import {FORM_ELEMENT_ENTER, FORM_ELEMENT_LEAVE} from '../../constants/animations';
import {getParentRelationshipsForSelectedFormElement} from '../../reducers/forms';
import {removeFieldFromForm} from '../../actions/formActions';
import {updateFormAnimationState} from '../../actions/animationActions';

import * as FieldsReducer from '../../reducers/fields';

import {connect} from 'react-redux';

import './qbform.scss';
import './tabs.scss';

/*
 Custom QuickBase Form component that has 1 property.
 activeTab: the tab we want to display first when viewing the form, defaults to the first tab
 */
export const QBForm = React.createClass({
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
         * formBuilderUpdateChildrenTabIndex is used for form builder. It is used to toggle the tab indices of form builder's children.
         */
        formBuilderUpdateChildrenTabIndex: PropTypes.func,

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

        /**
         * By default, the form uses FieldElement to render each field. You can optionally pass in a different renderer. */
        alternateFieldRenderer: PropTypes.object,

        /** handles drill down to parent */
        goToParent: React.PropTypes.func,

        uniqueId: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            activeTab: '0',
            hasAnimation: false
        };
    },

    shouldComponentUpdate: function(nextProps) {
        //  TODO: look at implementing a loading spinner code when rendering and remove this.
        //
        // if the fields store is being initialized, stop the component from re-rendering with any updates.  A
        // subsequent state change(success or failure) when the action that fetch's the fields data is complete
        // will be triggered and the component will re-render at that time.
        const tableFields = this.getTableFieldsObj(nextProps);
        if (tableFields && tableFields.fieldsLoading === true) {
            return false;
        }

        return true;
    },

    /**
     * Retrieve the fields on the table from the fields redux store
     *
     * @param props
     * @returns {*}
     */
    getTableFieldsObj: function(props) {
        const formMeta = _.has(props, 'formData.formMeta') ? props.formData.formMeta : {};
        return FieldsReducer.tableFieldsObj(props.fields, formMeta.appId, formMeta.tableId);
    },

    getTableFields: function(props) {
        const tableFields = this.getTableFieldsObj(props);
        return tableFields ? tableFields.fields : [];
    },

    /**
     * Retrieve the field object from the fields redux store for this appId/tblId
     *
     * @param fieldId
     * @returns field object or null if not found
     */
    getRelatedField(fieldId) {
        const fields = this.getTableFields(this.props);
        const field = _.find(fields, fld => fld.id === fieldId);
        return field || null;
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

    setAnimationRunning() {
        return this.props.updateAnimationState(true);
    },

    setAnimationStopped() {
        return this.props.updateAnimationState(false);
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
            elements = column.elements.map((element, index) => this.createElement(element, newLocation, index));
        }

        let arrangedElements = elements;
        if (this.props.hasAnimation && this.props.editingForm) {
            // Adds animation when field elements are moved during form editing.
            // The animation also callbacks to update the animating state to make sure drop events are not called
            // when elements are passing each other during animation.
            arrangedElements = (
                <FlipMove
                    duration={100}
                    easing="ease"
                    appearAnimation="fade"
                    enterAnimation={FORM_ELEMENT_ENTER}
                    leaveAnimation={FORM_ELEMENT_LEAVE}
                    staggerDelayBy={0}
                    staggerDurationBy={0}
                    delay={0}
                    onStartAll={this.setAnimationRunning}
                    onFinishAll={this.setAnimationStopped}
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
     * @param index - NOTE: We ignore the order index because the array is already ordered correctly. This improves performance on Form Builder.
     * @returns {*}
     */
    createElement(element, location, index) {
        let formattedElement;
        let newLocation = Object.assign({}, location, {elementIndex: index});

        if (element.FormTextElement) {
            formattedElement = this.createTextElement(element.id, element.FormTextElement);
        } else if (element.FormFieldElement) {
            let validationStatus =  this.getFieldValidationStatus(element.FormFieldElement.fieldId);
            formattedElement = this.createFieldElement(element.FormFieldElement, validationStatus, element, newLocation);
        } else if (element.ChildReportElement) {
            formattedElement = this.createChildReportElement(element.id, element.ChildReportElement);
        }

        return formattedElement;
    },

    /***
     * find if the current field is the detailKeyField, if true return relationship
     * @param fieldId
     */
    getRelationshipIfReferenceFieldToParent(fieldId) {
        return _.get(this.props, 'relationships') && this.props.relationships.find((relationship) => relationship.detailFieldId === fieldId);
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
        let formId = this.props.formId || CONTEXT.FORM.VIEW;
        let goToParent, masterTableId, masterAppId, masterFieldId;
        let relatedField = this.getRelatedField(FormFieldElement.fieldId);
        let fieldRecord = this.getFieldRecord(relatedField);
        let recId = _.has(this.props.formData, 'recordId') ? this.props.formData.recordId : null;

        const relationship = relatedField !== null ? this.getRelationshipIfReferenceFieldToParent(relatedField.id) : {};
        if (relationship) {
            goToParent = this.props.goToParent;
            masterTableId = relationship.masterTableId;
            masterAppId = relationship.masterAppId;
            masterFieldId = relationship.masterFieldId;
        }

        /* if the form prop calls for element to be required update fieldDef accordingly
         * This isn't functionality that currently exists in newstack. Its causing issues with updating field properties
         * in form builder. Once we had support for forms to have required fields,etc we will need to address this
        if (relatedField) {
            relatedField.required = relatedField.required || FormFieldElement.required;
        }
        */

        let CurrentFieldElement = this.props.alternateFieldRenderer || FieldElement;

        // This isDisable is used to disable the input and controls in form builder.
        let isDisabled = !(this.props.edit && !this.props.editingForm);

        //This tabIndex is for form builder keyboard navigation. It is removing all field value editors from the tabbing flow
        let tabIndex = (this.props.editingForm ? "-1" : 0);
        return (
            <div key={containingElement.id} className="formElementContainer">
                <CurrentFieldElement
                    tabIndex={tabIndex}
                    element={FormFieldElement}
                    key={`fieldElement-${containingElement.id}`}
                    idKey={"fe-" + this.props.idKey}
                    relatedField={relatedField}
                    fieldId={_.get(relatedField, 'id', null)}
                    fieldRecord={fieldRecord}
                    includeLabel={true}
                    indicateRequiredOnLabel={this.props.edit}
                    isDisabled={isDisabled}
                    edit={this.props.edit && !FormFieldElement.readOnly}
                    onChange={this.props.onFieldChange}
                    onBlur={this.props.onFieldChange}
                    isInvalid={validationStatus.isInvalid}
                    invalidMessage={validationStatus.invalidMessage}
                    app={this.props.app}
                    tblId={this.props.tblId}
                    appUsers={this.props.appUsers}
                    recId={recId}
                    goToParent={goToParent}
                    masterTableId={masterTableId}
                    masterAppId={masterAppId}
                    masterFieldId={masterFieldId}
                    location={location}

                    selectedField={this.props.selectedField}
                    isTokenInMenuDragging={this.props.isTokenInMenuDragging}
                    removeFieldFromForm={() => {this.props.removeFieldFromForm(formId, relatedField, location);}}
                    formBuilderContainerContentElement={this.props.formBuilderContainerContentElement}
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
        const detailKeyValue = _.get(fieldRecord, 'value', null);

        // Find the child table's name.
        const tables = _.get(this, 'props.selectedApp.tables');
        const childTable = _.find(tables, {id: relationship.detailTableId}) || {};
        const childTableName = childTable.name;
        const childTableNoun = childTable.tableNoun;
        const parentIsBeingEdited = this.props.edit;

        // Handler for clicking on a record in an embedded report. Drilling down to a child should open the clicked
        // child record in a drawer.
        // When this.props.edit is true, this form is inside a trowser. Disable drilling down to child records when an
        // embedded report is in a trowser.
        const handleDrillIntoChild = this.props.edit ? () => {} : this.props.handleDrillIntoChild;

        return (
            <div key={id} className="formElementContainer formElement referenceElement">
                <ChildReport
                    appId={_.get(relationship, "appId")}
                    childAppId={_.get(relationship, "detailAppId")}
                    childTableId={_.get(relationship, "detailTableId")}
                    childReportId={_.get(relationship, 'childDefaultReportId')}
                    childTableName={childTableName}
                    childTableNoun={childTableNoun}
                    detailKeyFid={_.get(relationship, "detailFieldId")}
                    detailKeyValue={detailKeyValue}
                    relationshipId={ReferenceElement.relationshipId}
                    relationship={relationship}
                    type={ReferenceElement.type}
                    appUsers={this.props.appUsers}
                    parentIsBeingEdited={parentIsBeingEdited}
                    handleDrillIntoChild={handleDrillIntoChild}
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
                    <span className="userInFooter" key={index}>
                        <span key={index} className="fieldNormalText">{field.name}</span>
                        <span key={`${index}-link`} className="fieldLinkText"><UserFieldValueRenderer value={user} display={display}/></span>
                    </span>
                );
            } else {
                return (
                    <span key={index} className="fieldNormalText">{`${field.name} ${field.value}.`}</span>
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

        let fields = this.getTableFields(this.props);
        if (fields.length === 0) {
            return [];
        }

        let values = this.props.formData.record;
        if (!values) {
            return [];
        }

        const {DATE_CREATED, DATE_MODIFIED, RECORD_OWNER, LAST_MODIFIED_BY} = Constants.BUILTIN_FIELD_ID;

        //  these are the list of built in fields to include on the footer
        const footerBuiltIns = [DATE_CREATED, DATE_MODIFIED, RECORD_OWNER, LAST_MODIFIED_BY];

        //  return a list of the built in fields included on this form
        let builtInFooterFields = _.filter(fields, (field) => _.includes(footerBuiltIns, field.id));

        return builtInFooterFields.map(builtInField => {
            let fieldValue = values.find(currentFieldValue => currentFieldValue.id === builtInField.id);

            switch (builtInField.id) {
            case LAST_MODIFIED_BY :
                return buildUserField(LAST_MODIFIED_BY, fieldValue, 'form.footer.lastUpdatedBy');

            case DATE_CREATED :
                return {
                    name: Locale.getMessage('form.footer.createdOn'),
                    value: fieldValue ? fieldValue.display : '',
                    id: DATE_CREATED,
                    type: Constants.DATE
                };

            case DATE_MODIFIED :
                return {
                    name: Locale.getMessage('form.footer.lastUpdatedOn'),
                    value: fieldValue ? fieldValue.display : '',
                    id: DATE_MODIFIED,
                    type: Constants.DATE
                };

            case RECORD_OWNER :
                return buildUserField(RECORD_OWNER, fieldValue, 'form.footer.ownedBy');
            }
        });
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
                <form className={this.props.edit ? "editForm" : "viewForm"}>
                    {formContent}
                </form>
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
        value: _.has(fieldValue, 'display') ? fieldValue.display : '',
        email: _.has(fieldValue, 'value.email') ? fieldValue.value.email : '',
        screenName: _.has(fieldValue, 'value.screenName') ? fieldValue.value.screenName : '',
        id: id,
        type: Constants.USER
    };
}

const mapStateToProps = (state, ownProps) => {
    let formId = (ownProps.formId || ownProps.uniqueId || CONTEXT.FORM.VIEW);
    let currentForm = _.get(state, `forms[${formId}]`, {});
    return {
        fields: state.fields,
        isTokenInMenuDragging: (_.has(currentForm, 'isDragging') ? currentForm.isDragging : undefined),
        relationships: formId ? getParentRelationshipsForSelectedFormElement(state, formId) : []
    };
};

export default connect(
    mapStateToProps, {removeFieldFromForm, updateFormAnimationState}
)(QBForm);
