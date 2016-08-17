import React from 'react';
import QBPanel from '../QBPanel/qbpanel.js';
import Tabs, {TabPane} from 'rc-tabs';
import Fluxxor from 'fluxxor';
import FieldElement from './fieldElement';
import FieldLabelElement from './fieldLabelElement';
import Breakpoints from '../../utils/breakpoints';
import Locale from '../../locales/locales';

import './qbform.scss';
import './tabs.scss';

let FluxMixin = Fluxxor.FluxMixin(React);
/*
 Custom QuickBase Form component that has 1 property.
 activeTab: the tab we want to display first when viewing the form, defaults to the first tab
 */
let QBForm = React.createClass({

    statics: {
        LABEL_ABOVE: "ABOVE", // label is in same cell as field value, above it
        LABEL_LEFT: "LEFT"    // label is in a separate cell as the fielv value, to its left
    },

    mixins: [FluxMixin],

    propTypes: {

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
     * @returns the FormTextElement or FormFieldElement object properties (whichever is present)
     */
    getElementProps(element) {

        if (element.FormTextElement) {
            return element.FormTextElement;
        }
        if (element.FormFieldElement) {
            return element.FormFieldElement;
        }
        return {};
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

        const cells = [];

        if (element.FormTextElement) {
            cells.push(this.createTextElementCell(element.FormTextElement, orderIndex, colSpan));
        }
        if (element.FormFieldElement) {
            // if we are positioning labels on the left, use a separate TD for the label and value so all columns line up
            if (labelPosition === QBForm.LABEL_LEFT) {
                cells.push(this.createFieldLabelCell(element.FormFieldElement, orderIndex, colSpan));
            }
            cells.push(this.createFieldElementCell(element.FormFieldElement, orderIndex, labelPosition === QBForm.LABEL_ABOVE, colSpan));
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
    getFieldRecord(fieldId) {
        let record = this.props.formData.record || [];

        return _.find(record, val => {
            if (val.id === fieldId) {
                return true;
            }
        });
    },

    /**
     * create a TD with a field label
     * @param element
     * @param sectionIndex
     * @returns {XML}
     */
    createFieldLabelCell(element, sectionIndex) {

        let relatedField = this.getRelatedField(element.fieldId);

        let key = "fieldLabel" + sectionIndex + "-" + element.orderIndex;
        return (
            <td key={key}>
                <FieldLabelElement element={element} relatedField={relatedField} />
            </td>);
    },

    /**
     * create a TD with a fielv value
     * @param element
     * @param sectionIndex
     * @param includeLabel
     * @param colSpan
     * @returns {XML}
     */
    createFieldElementCell(element, sectionIndex, includeLabel, colSpan) {

        let relatedField = this.getRelatedField(element.fieldId);

        let fieldRecord = this.getFieldRecord(element.fieldId);

        let key = "field" + sectionIndex + "-" + element.orderIndex;
        return (
            <td key={key} colSpan={colSpan}>
              <FieldElement element={element} relatedField={relatedField} fieldRecord={fieldRecord} includeLabel={includeLabel}/>
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
        let key = "field" + sectionIndex + "-" + element.orderIndex;
        return <td key={key} colSpan={colSpan}><div className="formElement text">{element.displayText}</div></td>;
    },

    /**
     * create the <TR> elements
     * @param section section data
     * @param singleColumn force single column
     * @returns {Array} of TR elements
     */
    createSectionTableRows(section, singleColumn) {
        let rows = [];                  // the TR components
        let currentRowElements = [];    // the TD elements for the current row

        // label position is determined by the section settings unless we're in single column mode
        const labelPosition = singleColumn ? QBForm.LABEL_ABOVE : section.headerElement.FormHeaderElement.labelPosition;

        Object.keys(section.elements).forEach((key, index, arr) => {

            // get the next section element
            let sectionElement = section.elements[key];

            let props = this.getElementProps(sectionElement);

            if (singleColumn) {
                // just one TR containing the current element (a single TD)
                rows.push(<tr key={key++} className="fieldRow">{this.getTableCells(sectionElement, section.orderIndex, labelPosition, true)}</tr>);
                return;
            }

            if (index === arr.length - 1) {
                // the last element - add the final cell(s) to the row
                currentRowElements = currentRowElements.concat(this.getTableCells(sectionElement, section.orderIndex, labelPosition, true));
                rows.push(<tr key={key++} className="fieldRow">{currentRowElements}</tr>);
            } else {
                // look at the next element to see if it's on the same row - if not the current element is the last one on the row
                const nextSectionElement = section.elements[arr[index + 1]];
                const isLast = !this.getElementProps(nextSectionElement).positionSameRow;
                if (currentRowElements.length > 0 && !props.positionSameRow) {
                    // current element is not on the same row so save the current row and start a new one
                    rows.push(<tr key={key++} className="fieldRow">{currentRowElements}</tr>);
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
    createSection(section, singleColumn) {
        let sectionTitle = "";

        // build the section header.
        if (section.headerElement && section.headerElement.FormHeaderElement && section.headerElement.FormHeaderElement.displayText) {
            sectionTitle = section.headerElement.FormHeaderElement.displayText;
        }

        return (
            <QBPanel className="formSection"
                     title={sectionTitle}
                     key={"section" + section.orderIndex}
                     isOpen={true}
                     panelNum={section.orderIndex}>
                <table className="formTable">
                    <tbody>
                        {this.createSectionTableRows(section, singleColumn)}
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
            Object.keys(tab.sections).forEach(key => {
                sections.push(this.createSection(tab.sections[key], singleColumn));
            });
        }

        return (
            <TabPane key={tab.orderIndex} tab={tab.title || Locale.getMessage("form.tab") + ' ' + tab.orderIndex}>
                <br/>
                {sections}
            </TabPane>
        );
    },

    /**
     * render a form as an set of tabs containing HTML tables (a la legacy QuickBase)
     */
    render() {
        const tabChildren = [];
        const singleColumn = Breakpoints.isSmallBreakpoint();
        let errorMsg = '';

        //  If there is an errorStatus, display the appropriate message based on the error code; otherwise
        //  render the form with the supplied data(if any).
        //  TODO: when error handling is implemented beyond forms, the thinking is that an error component
        //  TODO: should be created to replace the below and handle the locale messaging and rendering of
        //  TODO: a common error page.
        if (this.props.errorStatus) {
            if (this.props.errorStatus === 403) {
                errorMsg = Locale.getMessage("form.error.403");
            } else {
                errorMsg = Locale.getMessage("form.error.500");
            }
        } else if (this.props.formData &&  this.props.formData.formMeta && this.props.formData.formMeta.tabs) {
            let tabs = this.props.formData.formMeta.tabs;

            Object.keys(tabs).forEach(key => {
                tabChildren.push(this.createTab(tabs[key], singleColumn));
            });
        }

        const formContent = tabChildren.length < 2 ? tabChildren : <Tabs activeKey={this.props.activeTab}>{tabChildren}</Tabs>;

        return (
            <div className="formContainer">
                <form>
                    {errorMsg ? errorMsg : formContent}
                </form>
            </div>
        );
    }
});

export default QBForm;
