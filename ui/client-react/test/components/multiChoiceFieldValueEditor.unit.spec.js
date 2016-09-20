import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import MultiChoiceFieldValueEditor  from '../../src/components/fields/multiChoiceFieldValueEditor';

const listbox_placeholderTextData = {
    choices: []
};

const listbox_renderWithSelection = {
    choices: [{value: 'Apples', displayValue: 'Apples'},
                {value: 'Apricots', displayValue: 'Apricots'},
                {value: 'Bananas', displayValue: 'Bananas'},
    ],
    value: "Apricots"
};

const listbox_noEmptyChoicesData = {
    choices: [{value:'1701a', displayValue:'Enterprise 1701 A'},
                {value:'1701b', displayValue:'Enterprise 1701 B'},
                {value:'1701c', displayValue:'Enterprise 1701 C'},
                {value:'1701d', displayValue:'Enterprise 1701 D'},
                {value:' ', displayValue:' '},
                {value:'1701e', displayValue:'Enterprise 1701 E'},
    ]
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

    it('test render of component as radio group', () => {
        component = TestUtils.renderIntoDocument(<MultiChoiceFieldValueEditor showAsRadio={true}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    // Listbox, test that placeholder text appears when nothing is selected
    it('For a listbox, test display of placeholder text', () => {
        component = TestUtils.renderIntoDocument(<MultiChoiceFieldValueEditor choices={listbox_placeholderTextData.choices}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        var node = ReactDOM.findDOMNode(component);
        var placeholderDiv = node.getElementsByClassName("Select-control");
        expect(placeholderDiv).toBeDefined();
        expect(placeholderDiv.item(0)).toEqual("Select...");
    });

    // Listbox, test render of component with a selection, should display selected text and a clear button
    it('For a listbox, test render of component with a selection', () => {
        component = TestUtils.renderIntoDocument(<MultiChoiceFieldValueEditor choices={listbox_renderWithSelection.choices}
                                                                              value={listbox_renderWithSelection.value}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        var node = ReactDOM.findDOMNode(component);
        var selectControl = node.querySelector('.Select-control');

        expect(selectControl).toBeDefined();
        expect(selectControl.item(0)).toEqual("Apricots");

        var selectClearButton = node.querySelector('.Select-clear');
        expect(selectClearButton).toBeDefined();
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


    // Multichoice radios
    // if show as radio buttons is set, displays radio buttons list
    // choice for none has to appear at end

});
