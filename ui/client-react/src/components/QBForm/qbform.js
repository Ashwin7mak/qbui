import React from 'react';
import QBPanel from '../QBPanel/qbpanel.js';
import Tabs, {TabPane} from 'rc-tabs';
import _ from 'lodash';
import './qbform.scss';
import './tabs.scss';


/*
 Custom QuickBase Form component that has 1 property.
 activeTab: the tab we want to display first when viewing the form, defaults to the first tab
 */
class QBForm extends React.Component {
    constructor(...args) {
        super(...args);
    }
    //TODO : handle field types
    createFieldElement(element, sectionIndex, labelPosition) {
        let fieldLabel = element.fieldLabel ? element.fieldLabel : "test label";
        let fieldValue = element.fieldValue ? element.fieldValue : "test value";
        let key = "field" + sectionIndex + "-" + element.orderIndex;
        return (
            <div key={key} className="formElement field">
                <span className={"fieldLabel"}>{fieldLabel}</span>
                <span className="fieldValue">{fieldValue}</span>
            </div>
        );
    }
    createTextElement(element, sectionIndex) {
        let key = "field" + sectionIndex + "-" + element.orderIndex;
        return <div key={key} className="formElement text">{element.displayText}</div>;
    }
    createRow(fields) {
        return <div className="fieldRow">{fields}</div>;
    }

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
    }

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
    }

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
}

QBForm.propTypes = {activeTab: React.PropTypes.string};
QBForm.defaultProps = {activeTab: '0'};

export default QBForm;
