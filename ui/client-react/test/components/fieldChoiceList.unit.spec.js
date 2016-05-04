import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FieldChoiceList  from '../../src/components/sortGroup/fieldChoiceList';


var FieldChoice = React.createClass({
    render: function() {
        if (this.props.onShowFields) {
            this.props.onShowFields();
        }
        return (
            <div className="MockFieldChoice">{this.props.field ? this.props.field.name : ''}
            </div>
        );
    }
});

describe('FieldChoiceList functions', () => {
    'use strict';

    let component;

    let fieldsThree = function() {
        return ([
            {name:'test1', id:1},
            {name:'test2', id:2},
            {name:'test3', id:3}
        ]);
    };

    let fieldsOne = function() {
        return ([
            {name:'A', id:4}
        ]);
    };

    let fieldsEmpty = function() {
        return ([
        ]);
    };

    let mockCallbacks = {};

    beforeEach(() => {
        mockCallbacks = {
            showFields : function() {
            }
        };
        spyOn(mockCallbacks, 'showFields').and.callThrough();

        FieldChoiceList.__Rewire__('FieldChoice', FieldChoice);
    });

    afterEach(() => {
        FieldChoiceList.__ResetDependency__('FieldChoice');
    });


    it('test render', () => {
        component = TestUtils.renderIntoDocument(<FieldChoiceList/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render with empty fields', () => {
        component = TestUtils.renderIntoDocument(<FieldChoiceList fields={fieldsEmpty()}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render with 1 field', () => {
        component = TestUtils.renderIntoDocument(<FieldChoiceList fields={fieldsOne()}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render with fields', () => {
        let fields  = fieldsThree();
        component = TestUtils.renderIntoDocument(<FieldChoiceList fields={fields}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let fieldChoice = TestUtils.scryRenderedDOMComponentsWithClass(component, "MockFieldChoice");
        expect(fieldChoice.length).toEqual(fields.length);

    });

    it('test render with fields and room for more but no choices provided', () => {
        let fields  = fieldsThree();
        component = TestUtils.renderIntoDocument(<FieldChoiceList fields={fields} maxLength={fields.length + 1}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let fieldChoice = TestUtils.scryRenderedDOMComponentsWithClass(component, "MockFieldChoice");
        expect(fieldChoice.length).toEqual(fields.length);

    });

    it('test render with fields and at max', () => {
        let fields  = fieldsThree();
        component = TestUtils.renderIntoDocument(<FieldChoiceList fields={fields} maxLength={fields.length}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let fieldChoice = TestUtils.scryRenderedDOMComponentsWithClass(component, "MockFieldChoice");
        expect(fieldChoice.length).toEqual(fields.length);

    });

    it('test render with fields and room for more and choices provided but no callback to showfields', () => {
        let fields  = fieldsThree();
        component = TestUtils.renderIntoDocument(<FieldChoiceList fields={fields}
                                                                  maxLength={fields.length + 1}
                                                                  fieldChoiceList={fieldsOne()}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let fieldChoice = TestUtils.scryRenderedDOMComponentsWithClass(component, "MockFieldChoice");
        expect(fieldChoice.length).toEqual(fields.length);

    });

    it('test render with fields and room for more and choices provided and callback to showfields', () => {
        let fields  = fieldsThree();
        component = TestUtils.renderIntoDocument(<FieldChoiceList fields={fields}
                                                                  maxLength={fields.length + 1}
                                                                  fieldChoiceList={fieldsOne()}
                                                                  onShowFields={mockCallbacks.showFields}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let fieldChoice = TestUtils.scryRenderedDOMComponentsWithClass(component, "MockFieldChoice");
        expect(fieldChoice.length).toEqual(fields.length + 1);

    });

    it('test render with fields show fields click', () => {
        let fields  = fieldsThree();
        component = TestUtils.renderIntoDocument(<FieldChoiceList fields={fields}
                                                                  maxLength={fields.length + 1}
                                                                  fieldChoiceList={fieldsOne()}
                                                                  onShowFields={mockCallbacks.showFields}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let fieldChoice = TestUtils.scryRenderedDOMComponentsWithClass(component, "MockFieldChoice");
        expect(fieldChoice.length).toEqual(fields.length + 1);
        expect(mockCallbacks.showFields).toHaveBeenCalled();

    });

});

