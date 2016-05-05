import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FieldsPanel  from '../../src/components/sortGroup/fieldsPanel';

var I18nMessageMock = React.createClass({
    render: function() {
        return (
            <div>test</div>
        );
    }
});


describe('FieldsPanel functions', () => {
    'use strict';

    let component;

    let fieldsThree = function() {
        return ([
            {name:'test1', id:1},
            {name:'test2', id:2},
            {name:'test3', id:3}
        ]);
    };

    let fieldsUsed = function() {
        return ([
            {name:'test1', id:1},
            {name:'test2', id:2},
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

    beforeEach(() => {
        FieldsPanel.__Rewire__('I18nMessage', I18nMessageMock);
    });

    afterEach(() => {
        FieldsPanel.__ResetDependency__('I18nMessage');
    });


    it('test render', () => {
        component = TestUtils.renderIntoDocument(<FieldsPanel/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render with showFields false', () => {
        component = TestUtils.renderIntoDocument(<FieldsPanel showFields={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render with showFields true', () => {
        component = TestUtils.renderIntoDocument(<FieldsPanel showFields={true}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render group list', () => {
        component = TestUtils.renderIntoDocument(<FieldsPanel showFields={true}
                                                              fieldsForType="group"
                                                              groupByFields={fieldsEmpty()}
                                                              fieldChoiceList={fieldsEmpty()}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });



    it('test render group list', () => {
        component = TestUtils.renderIntoDocument(<FieldsPanel showFields={true}
                                                              fieldsForType="group"
                                                              groupByFields={fieldsOne()}
                                                              fieldChoiceList={fieldsThree()}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render group list and separate used in report', () => {
        component = TestUtils.renderIntoDocument(<FieldsPanel showFields={true}
                                                              fieldsForType="group"
                                                              groupByFields={fieldsOne()}
                                                              fieldChoiceList={fieldsThree()}
                                                              reportColumns={fieldsUsed()}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });



    it('test render group list and separate used in report, non visible in report fields not listed ', () => {
        let mockCallbacks =  {
            showMoreFields : function() {
            },
        };
        spyOn(mockCallbacks, 'showMoreFields').and.callThrough();
        component = TestUtils.renderIntoDocument(<FieldsPanel showFields={true}
                                                              fieldsForType="group"
                                                              groupByFields={fieldsOne()}
                                                              fieldChoiceList={fieldsThree()}
                                                              reportColumns={fieldsUsed()}
                                                              showNotVisible={false}
                                                              onShowMoreFields={mockCallbacks.showMoreFields}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let moreFields = TestUtils.scryRenderedDOMComponentsWithClass(component, "moreFields");
        expect(moreFields.length).toEqual(1);
        TestUtils.Simulate.click(moreFields[0]);
        expect(mockCallbacks.showMoreFields).toHaveBeenCalled();

    });

    it('test render group list and separate used in report, non visible in report fields listed  ', () => {
        component = TestUtils.renderIntoDocument(<FieldsPanel showFields={true}
                                                              fieldsForType="group"
                                                              groupByFields={fieldsOne()}
                                                              fieldChoiceList={fieldsThree()}
                                                              reportColumns={fieldsUsed()}
                                                              showNotVisible={true}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let fieldItem = TestUtils.scryRenderedDOMComponentsWithClass(component, "fieldItem");
        expect(fieldItem.length).toEqual(3);
        let notInReport = TestUtils.scryRenderedDOMComponentsWithClass(component, "notInReport");
        expect(notInReport.length).toEqual(1);
        expect(notInReport[0].innerText).toEqual('test3');

    });


    it('test render group list and click select field', () => {

        let mockCallbacks =  {
            onSelectField : function() {
            },
            onHideFields: function() {
            },
        };
        spyOn(mockCallbacks, 'onSelectField').and.callThrough();
        spyOn(mockCallbacks, 'onHideFields').and.callThrough();

        component = TestUtils.renderIntoDocument(<FieldsPanel showFields={true}
                                                              fieldsForType="group"
                                                              groupByFields={fieldsOne()}
                                                              fieldChoiceList={fieldsThree()}
                                                              reportColumns={fieldsUsed()}
                                                              showNotVisible={true}
                                                              onSelectField={mockCallbacks.onSelectField}
                                                              onHideFields={mockCallbacks.onHideFields}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let fieldItem = TestUtils.scryRenderedDOMComponentsWithClass(component, "fieldItem");
        expect(fieldItem.length).toEqual(3);
        TestUtils.Simulate.click(fieldItem[0]);
        expect(mockCallbacks.onSelectField).toHaveBeenCalled();
        expect(mockCallbacks.onHideFields).toHaveBeenCalled();

    });

    it('test render mocklist  ', () => {
        component = TestUtils.renderIntoDocument(<FieldsPanel/>);
        //expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let mockComponent = component.renderMockList(13);
        expect(mockComponent.props.children.length).toBe(13);
    });
});

