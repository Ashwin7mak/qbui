import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FieldChoice  from '../../src/components/sortGroup/fieldChoice';

var I18nMessageMock = React.createClass({
    render: function() {
        return (
            <div>test</div>
        );
    }
});

let field_valid = function() {
    return {
        name: 'cider',
        descendOrder: false
    };
};

let field_empty = function() {
    return {
    };
};

let field_invalid = function() {
    return {
        name: 5,
        descendOrder: 'test',
    };
};


let type_group = 'group';
let type_sort = 'sort';
let type_invalid = 999;

describe('FieldChoice functions', () => {
    'use strict';

    let component;
    let mockCallbacks = {};

    beforeEach(() => {

        mockCallbacks = {
            setOrder : function(type, index, order, field) {
            },
            removeField : function(type, index, field) {
            },
            showFields : function() {

            }
        };
        spyOn(mockCallbacks, 'setOrder').and.callThrough();
        spyOn(mockCallbacks, 'removeField').and.callThrough();
        spyOn(mockCallbacks, 'showFields').and.callThrough();

        FieldChoice.__Rewire__('I18nMessage', I18nMessageMock);
    });

    afterEach(() => {
        FieldChoice.__ResetDependency__('I18nMessage');
    });


    it('test render', () => {
        component = TestUtils.renderIntoDocument(<FieldChoice/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render blank item', () => {
        component = TestUtils.renderIntoDocument(<FieldChoice/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        // blank field entry or adding new should not have sort or delete
        let sortIcon = TestUtils.scryRenderedDOMComponentsWithClass(component, "sortOrderIcon");
        expect(sortIcon.length).toEqual(0);
        let deleteIcon = TestUtils.scryRenderedDOMComponentsWithClass(component,
                                    "fieldDeleteIcon");
        expect(sortIcon.length).toEqual(0);

    });

    it('test render add new field', () => {
        component = TestUtils.renderIntoDocument(<FieldChoice
                            onShowFields={mockCallbacks.showFields}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render with field', () => {
        component = TestUtils.renderIntoDocument(<FieldChoice field={field_valid()}/>);
        let order = TestUtils.findRenderedDOMComponentWithClass(component, "up");
        expect(order).toBeTruthy();
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render with field descending', () => {
        let fieldTest = field_valid();
        fieldTest.descendOrder = true;
        component = TestUtils.renderIntoDocument(<FieldChoice field={fieldTest} />);
        let order = TestUtils.findRenderedDOMComponentWithClass(component, "down");
        expect(order).toBeTruthy();
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render with invalid field', () => {
        component = TestUtils.renderIntoDocument(<FieldChoice field={field_invalid()}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render with invalid type', () => {
        component = TestUtils.renderIntoDocument(<FieldChoice type={type_invalid}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render with sort', () => {
        component = TestUtils.renderIntoDocument(<FieldChoice type={type_sort}
                                                              field={field_valid()}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render with group', () => {
        component = TestUtils.renderIntoDocument(<FieldChoice type={type_group}
                                                              field={field_valid()}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render order callback', () => {
        component = TestUtils.renderIntoDocument(<FieldChoice type={type_group}
                                                              onSetOrder={mockCallbacks.setOrder}
                                                              field={field_valid()}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let sortIcon = TestUtils.findRenderedDOMComponentWithClass(component, "sortOrderIcon");
        TestUtils.Simulate.click(sortIcon);
        expect(mockCallbacks.setOrder).toHaveBeenCalled();
    });


    it('test render delete callback', () => {
        component = TestUtils.renderIntoDocument(<FieldChoice type={type_group}
                                                              onRemoveField={mockCallbacks.removeField}
                                                              field={field_valid()}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let deleteIcon = TestUtils.findRenderedDOMComponentWithClass(component, "fieldDeleteIcon");
        TestUtils.Simulate.click(deleteIcon);
        expect(mockCallbacks.removeField).toHaveBeenCalled();
    });

});

