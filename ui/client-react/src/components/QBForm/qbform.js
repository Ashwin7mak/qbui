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
        this.state = this.initState(...args);
    }

    initState() {
        let initialState = {
           // "externalData": this.props.formData,
            readonly : true
        };
        return initialState;
    }

    //createCheckBox(curElement) {
    //    return (
    //        <input type="checkbox" className="fieldValue" disabled={this.state.readonly} checked={curElement.value}></input>
    //    );
    //}
    //
    //createSpan(curElement) {
    //    return (
    //        <span className="fieldValue">{curElement.value}</span>
    //    );
    //}
    //
    //createField(curElement) {
    //    let isCheckbox = curElement.type === "checkbox";
    //    return (
    //        <div key={curElement.id} className="field">
    //            <h5><small className={"fieldLabel"}>{curElement.name}</small></h5>
    //            {isCheckbox ? this.createCheckBox(curElement) : this.createSpan(curElement)}
    //        </div>
    //    );
    //}
    createFieldElement(element, labelPosition) {
        let fieldLabel = element.fieldLabel ? element.fieldLabel : "test label";
        let fieldValue = element.fieldValue ? element.fieldValue : "test value";
        return (
            <div key={element.orderIndex} className="field">
                <h5><small className={"fieldLabel"}>{fieldLabel}</small></h5>
                <span className="fieldValue">{fieldValue}</span>
            </div>
        );
    }
    createTextElement(element) {
        return <div className="textElement">{element.displayText}</div>;
    }
    createRow(fields) {
        return <div className="fieldRow">{fields}</div>;
    }

    createSection(section, index) {
        let sectionTitle = "";
        let fieldLabelPosition = "";

        //build the section header.
        if (section.headerElement && section.headerElement.FormHeaderElement && section.headerElement.FormHeaderElement) {
            sectionTitle = section.headerElement.FormHeaderElement.displayText ? section.headerElement.FormHeaderElement.displayText : "";
            fieldLabelPosition = section.headerElement.FormHeaderElement.position;
        }

        //build each of the elements
        let fieldElements = [];
        let textElement = "";
        _.each(section.elements, (element) => {
            if (element.FormTextElement) {
                textElement = this.createTextElement(element.FormTextElement);
            } else if (element.FormFieldElement) {
                fieldElements.push(this.createFieldElement(element.FormFieldElement, fieldLabelPosition));
            }  else {
                //log error
            }
        });

        return (
            <QBPanel title={sectionTitle} key={section.orderIndex} isOpen={true} panelNum={section.orderIndex}>
                {this.createRow(textElement)}
                {this.createRow(fieldElements)}
            </QBPanel>
        );
    }

    createTab(tab, index) {
        let sections = [];
        _.each(tab.sections, (section, idx) => {
            sections.push(this.createSection(section, idx));
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
                tabs.push(this.createTab(tab, index));
            });
        }
        return (
            <div className="formContainer">
                <form>
                    <Tabs defaultActiveKey={this.props.activeTab}>
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
