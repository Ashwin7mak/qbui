import React from 'react';
import QBPanel from '../QBPanel/qbpanel.js';
import {fakeFormClassyData} from './fakeData.js';
import Tabs, {TabPane} from 'rc-tabs';
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

    initState(){
        let initialState = {
            "externalData": fakeFormClassyData,
            readonly : true
        };
        return initialState;
    }

    createCheckBox(curElement){
        return (
            <input type="checkbox" className="fieldValue" disabled={this.state.readonly} checked={curElement.value}></input>
        );
    }

    createSpan(curElement){
        return (
            <span className="fieldValue">{curElement.value}</span>
        );
    }

    createField(curElement){
        var isCheckbox = curElement.type === "checkbox";
        return (
            <div key={curElement.id} className="field">
                <h5><small className={"fieldLabel"}>{curElement.name}</small></h5>
                {isCheckbox ? this.createCheckBox(curElement) : this.createSpan(curElement)}
            </div>
        );
    }

    createSection(curSection){

        var fields = [];
        for (var j = 0; j < curSection.elements.length; j++){
            fields.push(this.createField(curSection.elements[j]));
        }
        return (
            <QBPanel title={curSection.title} key={curSection.id} isOpen={false} panelNum={curSection.id}>
                {fields}
            </QBPanel>
        );
    }

    createTab(curTab){
        var sections = [];
        for (var c = 0; c < curTab.sections.length; c++){
            sections.push(this.createSection(curTab.sections[c]));
        }
        return (
            <TabPane key={curTab.id} tab={curTab.title}>
                <br/>
                {sections}
            </TabPane>
        );
    }

    render() {
        var tabs = [];
        for (var i = 0; i < this.state.externalData.tabs.length; i++){
            tabs.push(this.createTab(this.state.externalData.tabs[i]));
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
