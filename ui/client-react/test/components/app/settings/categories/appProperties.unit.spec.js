import React from 'react';
import TestUtils from 'react-addons-test-utils';
import AppProperties  from '../../../../../src/components/app/settings/categories/appProperties';

describe('AppProperties functions', () => {
    'use strict';


    const selectedAppNoProperties = {duder: 1, shield: 'Washington'};
    const selectedApp = {dateFormat: "MM-dd-uuuu", firstDayOfWeek: "Sunday", id: "1", name: "Dat App",
                         numberFormat: "12,345,678.00", timeZone: "America/Los_Angeles"};
    const appId = 1;

    it('test render of component', () => {
        let component = TestUtils.renderIntoDocument(<AppProperties selectedApp={selectedApp}
                                                                        appId={appId}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with app properties', () => {
        let component = TestUtils.renderIntoDocument(<AppProperties selectedApp={selectedApp}
                                                                    appId={appId}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        expect(TestUtils.scryRenderedDOMComponentsWithClass(component, 'fieldValue').length).toEqual(6);
        expect(TestUtils.scryRenderedDOMComponentsWithClass(component, 'field').length).toEqual(6);
        expect(TestUtils.scryRenderedDOMComponentsWithClass(component, 'fieldLabel').length).toEqual(6);
    });

    it('test render of component with no app properties', () => {
        let component = TestUtils.renderIntoDocument(<AppProperties selectedApp={selectedAppNoProperties}
                                                                    appId={appId}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(TestUtils.scryRenderedDOMComponentsWithClass(component, 'fieldValue').length).toEqual(0);
        expect(TestUtils.scryRenderedDOMComponentsWithClass(component, 'field').length).toEqual(0);
        expect(TestUtils.scryRenderedDOMComponentsWithClass(component, 'fieldLabel').length).toEqual(0);
    });

    it('test createSpan method', () => {
        let component = TestUtils.renderIntoDocument(<AppProperties selectedApp={selectedApp}
                                                                    appId={appId}/>);
        let span = component.createSpan("name");
        expect(span.props.className).toEqual('fieldValue');
        expect(span.type).toEqual('span');
    });

    it('test createField method', () => {
        let component = TestUtils.renderIntoDocument(<AppProperties selectedApp={selectedApp}
                                                                    appId={appId}/>);
        let field = component.createField("name");
        expect(field.props.className).toEqual('field');
        expect(field.type).toEqual('div');
    });
});
