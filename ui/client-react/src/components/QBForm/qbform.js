import React from 'react';
import QBPanel from '../QBPanel/qbpanel.js';
import Tabs, {TabPane} from 'rc-tabs';
import Fluxxor from 'fluxxor';
import _ from 'lodash';
import './qbform.scss';
import './tabs.scss';
const serverTypeConsts = require('../../../../common/src/constants');
import {CellValueRenderer} from '../dataTable/agGrid/cellValueRenderers';


let FluxMixin = Fluxxor.FluxMixin(React);
/*
 Custom QuickBase Form component that has 1 property.
 activeTab: the tab we want to display first when viewing the form, defaults to the first tab
 */
let QBForm = React.createClass({
    mixins: [FluxMixin],
    propTypes: {
        activeTab: React.PropTypes.string
    },
    contextTypes: {
        touch: React.PropTypes.bool
    },

    getDefaultProps: function() {
        return {
            activeTab: '0'
        };
    },

    createFieldElement(element, sectionIndex, labelPosition) {
        let fieldLabel = "";

        if (element.useAlternateLabel) {
            fieldLabel = element.displayText;
        } else  {
            fieldLabel = element.fieldLabel ? element.fieldLabel : "test label"; //TODO "test label" text is only for testing
        }

        let fieldRawValue = element.fieldRawValue ? element.fieldRawValue : "test raw value";
        let fieldDisplayValue = element.fieldDisplayValue ? element.fieldDisplayValue : "test display value";
        let fieldType = element.fieldType ? element.fieldType : serverTypeConsts.TEXT;
        let fieldDatatypeAttributes = element.fieldDatatypeAttributes ? element.fieldDatatypeAttributes : {};
        let key = "field" + sectionIndex + "-" + element.orderIndex;

        let classes = "formElement field ";
        classes += labelPosition === "ABOVE" ? "labelAbove" : "labelLeft";
        return (
            <div key={key} className={classes}>
                <span className={"fieldLabel"}>{fieldLabel}</span>
                <span className="cellWrapper">
                    {fieldDisplayValue !== null &&
                    <CellValueRenderer type={fieldType}
                               value={fieldRawValue}
                               display={fieldDisplayValue}
                               attributes={fieldDatatypeAttributes}
                    />  }
                </span>
            </div>
        );
    },
    createTextElement(element, sectionIndex) {
        let key = "field" + sectionIndex + "-" + element.orderIndex;
        return <div key={key} className="formElement text">{element.displayText}</div>;
    },
    createRow(fields) {
        return <div className="fieldRow">{fields}</div>;
    },

    createSection(section) {
        let sectionTitle = "";
        let fieldLabelPosition = "";

        //build the section header.
        if (section.headerElement && section.headerElement.FormHeaderElement && section.headerElement.FormHeaderElement) {
            sectionTitle = section.headerElement.FormHeaderElement.displayText ? section.headerElement.FormHeaderElement.displayText : "";
            fieldLabelPosition = section.headerElement.FormHeaderElement.position;
        }

        //build each of the elements, stuff them into one row for now
        let elements = [];
        _.each(section.elements, (element) => {
            if (element.FormTextElement) {
                elements.push(this.createTextElement(element.FormTextElement, section.orderIndex));
            } else if (element.FormFieldElement) {
                elements.push(this.createFieldElement(element.FormFieldElement, section.orderIndex, fieldLabelPosition));
            }  else {
                //unknown element type.. not sure how to render.
            }
        });

        return (
            <QBPanel className="formSection" title={sectionTitle} key={"section" + section.orderIndex} isOpen={true} panelNum={section.orderIndex}>
                {this.createRow(elements)}
            </QBPanel>
        );
    },

    createTab(tab) {
        let sections = [];
        _.each(tab.sections, (section, idx) => {
            sections.push(this.createSection(section));
        });
        return (
            <TabPane key={tab.orderIndex} tab={tab.title}>
                <br/>
                {sections}
            </TabPane>
        );
    },

    render() {
        let tabs = [];
        if (this.props.formData && this.props.formData.tabs) {
            _.each(this.props.formData.tabs, (tab, index) => {
                tabs.push(this.createTab(tab));
            });
        }
        return (
            <div className="formContainer">
                <form>
                    <Tabs activeKey={this.props.activeTab}>
                        {tabs}
                    </Tabs>
                </form>
            </div>
        );
    }
});

export default QBForm;
