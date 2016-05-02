import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FieldSettings  from '../../src/components/sortGroup/fieldSettings';

var I18nMessageMock = React.createClass({
    render: function() {
        return (
            <div>test</div>
        );
    }
});



var MockFieldChoiceList = React.createClass({
    render: function() {
        return (
            <div className="MockFieldChoiceList">
            </div>
        );
    }
});

describe('FieldSettings functions', () => {
    'use strict';

    let component;


    let dumpComponent = function(testName) {
        let node =  ReactDOM.findDOMNode(component);
        if (testName) {
            console.log('===' + testName + '===');
        }
        console.log(console.log(node.outerHTML) + '\n\n');
    };


    beforeEach(() => {
        FieldSettings.__Rewire__('I18nMessage', I18nMessageMock);
        FieldSettings.__Rewire__('FieldChoiceList', MockFieldChoiceList);
    });

    afterEach(() => {
        FieldSettings.__ResetDependency__('I18nMessage');
        FieldSettings.__ResetDependency__('FieldChoiceList');
    });


    it('test render', () => {
        component = TestUtils.renderIntoDocument(<FieldSettings/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render with sort', () => {
        component = TestUtils.renderIntoDocument(<FieldSettings type="sort"/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let heading = TestUtils.scryRenderedDOMComponentsWithClass(component, "sortBySettings");
        expect(heading.length).toEqual(1);
    });

    it('test render with group', () => {
        component = TestUtils.renderIntoDocument(<FieldSettings type="group"/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let heading = TestUtils.scryRenderedDOMComponentsWithClass(component, "groupBySettings");
        expect(heading.length).toEqual(1);
    });

    it('test contains FieldChoiceList ', () => {
        component = TestUtils.renderIntoDocument(< FieldSettings type="group"/>);
        var _MockFieldChoiceList = TestUtils.scryRenderedComponentsWithType(component, MockFieldChoiceList);
        expect(_MockFieldChoiceList.length).toEqual(1);
        let container = TestUtils.scryRenderedDOMComponentsWithClass(component, "fieldSelectorContainer");
        expect(container.length).toEqual(1);
    });

});

