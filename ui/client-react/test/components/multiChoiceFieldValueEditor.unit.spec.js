import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import MultiChoiceFieldValueEditor  from '../../src/components/fields/multiChoiceFieldValueEditor';

const listbox_renderWithSelection = {
    choices: [{value: 'Apples', label: 'Apples'},
                {value: 'Apricots', label: 'Apricots'},
                {value: 'Bananas', label: 'Bananas'},
    ],
    value: "Apricots"
};

const listbox_noEmptyChoicesData = {
    choices: [{value:'1701a', label:'Enterprise 1701 A'},
                {value:'1701b', label:'Enterprise 1701 B'},
                {value:'1701c', label:'Enterprise 1701 C'},
                {value:'1701d', label:'Enterprise 1701 D'},
                {value:' ', label:' '},
                {value:'1701e', label:'Enterprise 1701 E'},
    ]
};

const radioBoxData = {
    choices: [
        {coercedValue: {value:'Apples'},
            displayValue: 'Apples'
        },
        {coercedValue: {value:'Apricots'},
            displayValue: 'Apricots'
        },
        {coercedValue: {value:'Bananas'},
            displayValue: 'Bananas'
        }
    ],
    value: "Apricots",
    fieldDefNotRequired: {
        required: false
    },
    fieldDefRequired: {
        required: true
    }
};


describe('MultiChoiceFieldValueEditor functions', () => {
    'use strict';
    var matchers = require('../reactJasmine');
    beforeEach(function() {
        jasmine.addMatchers(matchers(TestUtils));
    });
    let component;

    it('test render of component as listbox', () => {
        component = TestUtils.renderIntoDocument(<MultiChoiceFieldValueEditor />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    // Listbox, test that placeholder text appears when nothing is selected
    it('For a listbox, test display of placeholder text', () => {
        component = TestUtils.renderIntoDocument(<MultiChoiceFieldValueEditor choices={listbox_renderWithSelection.choices}
                                                                              />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        var node = ReactDOM.findDOMNode(component);
        TestUtils.Simulate.click(node);
        var placeHolderNode = node.getElementsByClassName("Select-placeholder");
        var spanNode = placeHolderNode[0].childNodes[0];
        expect(spanNode.innerHTML).toEqual("Select...");

    });

    // Listbox, test render of component with a selection, should display selected text and a clear button
    it('For a listbox, test render of component when there is an existing selection', () => {
        component = TestUtils.renderIntoDocument(<MultiChoiceFieldValueEditor choices={listbox_renderWithSelection.choices}
                                                                              value={listbox_renderWithSelection.value}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        var node = ReactDOM.findDOMNode(component);
        var controlNode = node.getElementsByClassName("Select-control");
        expect(controlNode).toBeDefined();
        expect(controlNode[0].childNodes[0].childNodes[0].childNodes[0].innerHTML).toEqual("Apricots");
    });

    // Listbox, test that no blank choices appear in the list
    it('For a listbox, test render of component with blank choices in the options list', () => {
        component = TestUtils.renderIntoDocument(<MultiChoiceFieldValueEditor choices={listbox_noEmptyChoicesData.choices}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        var node = ReactDOM.findDOMNode(component);
        TestUtils.Simulate.mouseDown(node.querySelector('.Select-control'), {button: 0});

        expect(node, 'queried for', '.Select-option:nth-child(1)', 'to have items satisfying', 'to have text', 'Enterprise 1701 A');
        expect(node, 'queried for', '.Select-option:nth-child(2)', 'to have items satisfying', 'to have text', 'Enterprise 1701 B');
        expect(node, 'queried for', '.Select-option:nth-child(3)', 'to have items satisfying', 'to have text', 'Enterprise 1701 C');
        expect(node, 'queried for', '.Select-option:nth-child(4)', 'to have items satisfying', 'to have text', 'Enterprise 1701 D');
        expect(node, 'queried for', '.Select-option:nth-child(5)', 'to have items satisfying', 'to have text', 'Enterprise 1701 E');
    });

    // Radio group tests
    it('test render of component as radio group when showAsRadio field is set', () => {
        component = TestUtils.renderIntoDocument(<MultiChoiceFieldValueEditor showAsRadio={true}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        var node = ReactDOM.findDOMNode(component);

        var radioContainerNode = node.getElementsByClassName("multiChoiceRadioContainer");
        expect(radioContainerNode).toBeDefined();
    });

    it('For radio group, test display of none option when field is not required', () => {
        component = TestUtils.renderIntoDocument(<MultiChoiceFieldValueEditor value={radioBoxData.value} fieldDef={radioBoxData.fieldDefNotRequired} radioGroupName={"myRadioGroupName"} showAsRadio={true} choices={radioBoxData.choices}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        var node = ReactDOM.findDOMNode(component);
        var radioContainerNode = node.getElementsByClassName("multiChoiceRadioContainer")[0];
        expect(radioContainerNode).toBeDefined();

        var radioText1 = radioContainerNode.childNodes[0].childNodes[2].textContent;
        var radioText2 = radioContainerNode.childNodes[1].childNodes[2].textContent;
        var radioText3 = radioContainerNode.childNodes[2].childNodes[2].textContent;
        var radioText4 = radioContainerNode.childNodes[3].childNodes[2].textContent;

        expect(radioText1).toEqual("Apples");
        expect(radioText2).toEqual("Apricots");
        expect(radioText3).toEqual("Bananas");
        expect(radioText4).toEqual("\<None\>");
    });

    it('For radio group, test non-display of none option when field is set to required', () => {
        component = TestUtils.renderIntoDocument(<MultiChoiceFieldValueEditor value={radioBoxData.value} fieldDef={radioBoxData.fieldDefRequired} radioGroupName={"myRadioGroupName"} showAsRadio={true} choices={radioBoxData.choices}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        var node = ReactDOM.findDOMNode(component);
        var radioContainerNode = node.getElementsByClassName("multiChoiceRadioContainer")[0];
        expect(radioContainerNode).toBeDefined();

        var radioText1 = radioContainerNode.childNodes[0].childNodes[2].textContent;
        var radioText2 = radioContainerNode.childNodes[1].childNodes[2].textContent;
        var radioText3 = radioContainerNode.childNodes[2].childNodes[2].textContent;

        expect(radioContainerNode.childNodes.length).toEqual(3);
        expect(radioText1).toEqual("Apples");
        expect(radioText2).toEqual("Apricots");
        expect(radioText3).toEqual("Bananas");
    });

    // For radio group, test click on text selects radio item
    it('test click on radio button text selects radio button', () => {
        component = TestUtils.renderIntoDocument(<MultiChoiceFieldValueEditor value={'Apricots'} radioGroupName={"myRadioGroupName"} showAsRadio={true} choices={radioBoxData.choices}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        var node = ReactDOM.findDOMNode(component);
        var radioContainerNode = node.getElementsByClassName("multiChoiceRadioContainer");
        expect(radioContainerNode).toBeDefined();

        var labels = node.querySelectorAll('label');
        TestUtils.Simulate.click(labels[2], {
            target: {
                value: 'Banana'
            }
        });

        expect(component.state.choice).toEqual("Banana");
    });

    // For radio group, ensure prior choice is shown as selected
    it('test that a radio button is shown as checked when the selection is passed from the calling component', () => {
        component = TestUtils.renderIntoDocument(<MultiChoiceFieldValueEditor value={radioBoxData.value} radioGroupName={"myRadioGroupName"} showAsRadio={true} choices={radioBoxData.choices}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        var node = ReactDOM.findDOMNode(component);
        var radioContainerNode = node.getElementsByClassName("multiChoiceRadioContainer")[0];
        expect(radioContainerNode).toBeDefined();

        var inputNode = node.querySelectorAll('label')[1].childNodes[0];
        expect(inputNode.checked).toBeTruthy();
    });
});
