import React from 'react';
import QBPanel from '../QBPanel/qbpanel.js';
import Tabs, {TabPane} from 'rc-tabs';
import Fluxxor from 'fluxxor';
import FieldElement from './fieldElement';
import FieldLabelElement from './fieldLabelElement'
import Breakpoints from '../../utils/breakpoints';
import Locale from '../../locales/locales';

import './qbform.scss';
import './tabs.scss';

const serverTypeConsts = require('../../../../common/src/constants');

let FluxMixin = Fluxxor.FluxMixin(React);
/*
 Custom QuickBase Form component that has 1 property.
 activeTab: the tab we want to display first when viewing the form, defaults to the first tab
 */
let QBForm = React.createClass({

    statics: {
        LABEL_ABOVE: "ABOVE",
        LABEL_LEFT: "LEFT"

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

    getElementProps(element) {

        if (element.FormTextElement) {
            return element.FormTextElement;
        }
        if (element.FormFieldElement) {
            return element.FormFieldElement;
        }
        return {};
    },

    getTableCell(element, colSpan, orderIndex, labelPosition) {

        //build each of the elements, stuff them into one row for now
        if (element.FormTextElement) {
            return this.createTextElement(element.FormTextElement, colSpan, orderIndex);
        }
        if (element.FormFieldElement) {
            return this.createFieldElement(element.FormFieldElement, colSpan, orderIndex, labelPosition);
        }
        return "";
    },

    getRelatedField(fieldId) {
        let fields = this.props.formData.fields || [];

        return _.find(fields, field => {
            if (field.id === fieldId) {
                return true;
            }
        });
    },

    getFieldRecord(fieldId) {
        let record = this.props.formData.record || [];

        return _.find(record, val => {
            if (val.id === fieldId) {
                return true;
            }
        });
    },

    createFieldLabel(element, colSpan, sectionIndex) {

        let relatedField = this.getRelatedField(element.fieldId);

        let key = "fieldLabel" + sectionIndex + "-" + element.orderIndex;
        return (
            <td key={key} colSpan={colSpan}>
                <FieldLabelElement element={element} relatedField={relatedField} />
            </td>);
    },

    createFieldElement(element, colSpan, sectionIndex, labelPosition) {

        let relatedField = this.getRelatedField(element.fieldId);

        let fieldRecord = this.getFieldRecord(element.fieldId);

        let key = "field" + sectionIndex + "-" + element.orderIndex;
        return (
            <td key={key} colSpan={colSpan}>
              <FieldElement element={element} relatedField={relatedField} fieldRecord={fieldRecord} labelPosition={labelPosition}/>
            </td>);
    },

    createTextElement(element, colSpan, sectionIndex) {
        let key = "field" + sectionIndex + "-" + element.orderIndex;
        return <td key={key} colSpan={colSpan}><div className="formElement text">{element.displayText}</div></td>;
    },

    createSectionTableRows(section, singleColumn) {

        const labelPosition = singleColumn ? QBForm.LABEL_ABOVE : QBForm.LABEL_LEFT; //section.headerElement.FormHeaderElement.labelPosition;

        const rows = this.getSectionRowData(section, singleColumn);

        // find max # columns in any row
        const maxColumns = rows.reduce((prev, current) => current.length > prev ? current.length : prev, 0);

        // now that we have the columns to compute colspan we can create the UI
        const tableRows = [];
        let key = 0;
        rows.forEach(row => {
            const cells = [];
            row.forEach((sectionElement, index) => {

                let colSpan = 1;
                if (index === row.length - 1) {
                    colSpan = 100; //same as legacy QB, could possibly use (maxColumns - row.length);
                }
                cells.push(this.getTableCell(sectionElement, colSpan, section.orderIndex, labelPosition));
            });

            tableRows.push(
                <tr key={key++} className="fieldRow">
                    {cells}
                </tr>);
        });
        return tableRows;
    },

    getSectionRowData(section, singleColumn) {
        let rows = [];
        let currentRowElements = [];

        // store the section elements in an array of rows containing an array of columns

        Object.keys(section.elements).forEach((key, index, arr) => {

            let props = this.getElementProps(section.elements[key]);

            // single column

            if (singleColumn) {
                rows.push([section.elements[key]]);
                return;
            }

            if (index === arr.length - 1) {
                currentRowElements.push(section.elements[key]);
                rows.push(currentRowElements);
            } else {
                if (currentRowElements.length > 0 && !props.positionSameRow) {
                    rows.push(currentRowElements);
                    currentRowElements = [];
                }
                currentRowElements.push(section.elements[key]);
            }
        });
        return rows;
    },

    createSection(section, singleColumn) {
        let sectionTitle = "";

        //build the section header.
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

    render() {
        const tabChildren = [];
        const singleColumn = Breakpoints.isSmallBreakpoint();

        if (this.props.formData &&  this.props.formData.formMeta && this.props.formData.formMeta.tabs) {
            let tabs = this.props.formData.formMeta.tabs;

            Object.keys(tabs).forEach(key => {
                tabChildren.push(this.createTab(tabs[key], singleColumn));
            });
        }
        return (
            <div className="formContainer">
                <form>
                    {tabChildren.length < 2 ?
                        tabChildren :
                        <Tabs activeKey={this.props.activeTab}>
                            {tabChildren}
                        </Tabs>
                    }
                </form>
            </div>
        );
    }
});

export default QBForm;
