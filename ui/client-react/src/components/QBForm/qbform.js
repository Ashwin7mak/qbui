/**
 * Created by fbeyer on 10/21/15.
 */
import React from 'react';

import ReactBootstrap from 'react-bootstrap';
import {Glyphicon}  from 'react-bootstrap';
import QBPanel from '../QBPanel/qbpanel.js';

import {fakeFormLotsOfData} from './fakeData.js';

var formData = fakeFormLotsOfData;

import './qbform.scss';

var Tabs = require('rc-tabs');
var TabPane = Tabs.TabPane;
import '../record/rc-tabs.scss';

class QBForm extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = this.initState(...args);
    }

    initState(){
        let initialState = {
            "externalData": formData,
            readonly : true,
            defaultTab : this.props.activeTab
        };
        return initialState;
    }

    createCheckBox(curElement){
        return (
            <input type="checkbox" className="fieldCheckBox" disabled={this.state.readonly} checked={curElement.value}></input>
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
            <div id={curElement.id} className="field">
                <span className={isCheckbox ? "" : "fieldLabel"}>{curElement.name}</span>
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
            <QBPanel title={curSection.title} key={curSection.id} isOpen={false}>
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
        var test = [];
        for (var i = 0; i < this.state.externalData.tabs.length; i++){
            test.push(this.createTab(this.state.externalData.tabs[i]));
        }
        return (
            <div className="formContainer">
                <Tabs defaultActiveKey={this.state.defaultTab}>
                    {test}
                </Tabs>
            </div>
        );
    }
}

QBForm.propTypes = {activeTab: React.PropTypes.string};
QBForm.defaultProps = {activeTab: '0'};

export default QBForm;

/*

 <tab | tab | <selected tab> | tab | tab>
    <QBPanel (collapsed)>
        field : value
        field : value
        field : value
    </QBPanel>
     <QBPanel (collapsed)>
        field : value
        field : value
        field : value
     </QBPanel>
 */
