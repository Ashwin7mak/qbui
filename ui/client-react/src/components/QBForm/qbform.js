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

    getTableCells(element, orderIndex, labelPosition, isLast) {

        const colSpan = isLast ? 100 : 1;

        const cells = [];
        //build each of the elements, stuff them into one row for now
        if (element.FormTextElement) {
            cells.push(this.createTextElementCell(element.FormTextElement, orderIndex, colSpan));
        }
        if (element.FormFieldElement) {
            if (labelPosition === QBForm.LABEL_LEFT) {
                cells.push(this.createFieldLabelCell(element.FormFieldElement, orderIndex, colSpan));
            }
            cells.push(this.createFieldElementCell(element.FormFieldElement, orderIndex, labelPosition === QBForm.LABEL_ABOVE, colSpan));
        }
        return cells;
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

    createFieldLabelCell(element, sectionIndex) {

        let relatedField = this.getRelatedField(element.fieldId);

        let key = "fieldLabel" + sectionIndex + "-" + element.orderIndex;
        return (
            <td key={key}>
                <FieldLabelElement element={element} relatedField={relatedField} />
            </td>);
    },

    createFieldElementCell(element, sectionIndex, includeLabel, colSpan) {

        let relatedField = this.getRelatedField(element.fieldId);

        let fieldRecord = this.getFieldRecord(element.fieldId);

        let key = "field" + sectionIndex + "-" + element.orderIndex;
        return (
            <td key={key} colSpan={colSpan}>
              <FieldElement element={element} relatedField={relatedField} fieldRecord={fieldRecord} includeLabel={includeLabel}/>
            </td>);
    },

    createTextElementCell(element, sectionIndex, colSpan) {
        let key = "field" + sectionIndex + "-" + element.orderIndex;
        return <td key={key} colSpan={colSpan}><div className="formElement text">{element.displayText}</div></td>;
    },

    createSectionTableRows(section, singleColumn) {
        let rows = [];
        let currentRowElements = [];

        const labelPosition = singleColumn ? QBForm.LABEL_ABOVE : section.headerElement.FormHeaderElement.labelPosition;

        Object.keys(section.elements).forEach((key, index, arr) => {

            let sectionElement = section.elements[key];

            let props = this.getElementProps(sectionElement);

            if (singleColumn) {
                rows.push(<tr key={key++} className="fieldRow">{this.getTableCells(sectionElement, section.orderIndex, labelPosition, true)}</tr>);
                return;
            }

            if (index === arr.length - 1) {
                currentRowElements = currentRowElements.concat(this.getTableCells(sectionElement, section.orderIndex, labelPosition, true));
                rows.push(<tr key={key++} className="fieldRow">{currentRowElements}</tr>);
            } else {
                const nextSectionElement = section.elements[arr[index + 1]];
                const isLast = !this.getElementProps(nextSectionElement).positionSameRow;
                if (currentRowElements.length > 0 && !props.positionSameRow) {
                    rows.push(<tr key={key++} className="fieldRow">{currentRowElements}</tr>);
                    currentRowElements = [];
                }
                currentRowElements = currentRowElements.concat(this.getTableCells(sectionElement, section.orderIndex, labelPosition, isLast));
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
