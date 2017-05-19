import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import BuilderDropDownAction  from '../../src/components/actions/builderDropDownAction';

describe('Build drop down action functions', () => {
    'use strict';

    let component;
    const sampleTable = {id: '123', icon: 'icon', name: 'name'};
    const sampleApp = {id: 'xyz', tables: [sampleTable]};
    const history = {
        push: () =>{}
    };
    const callbacks = {
        navigateToBuilder: () =>{},
        navigateToBuilderReport: () => {}
    };

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<BuilderDropDownAction />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(TestUtils.scryRenderedDOMComponentsWithClass(component, "globalActionLink").length).toEqual(0);
    });

    it('test render of component in context of a table', () => {
        component = TestUtils.renderIntoDocument(<BuilderDropDownAction selectedApp={sampleApp} selectedTable={sampleTable}/>);
        let gearIcon = TestUtils.scryRenderedDOMComponentsWithClass(component, "globalActionLink");
        Simulate.click(gearIcon[0]);
        let tableSettingsLink = TestUtils.scryRenderedDOMComponentsWithClass(component, "modifyTableSettings");
        expect(tableSettingsLink.length).toEqual(1);
    });

    it('test render of component in context of a form', () => {
        component = TestUtils.renderIntoDocument(<BuilderDropDownAction selectedApp={sampleApp} selectedTable={sampleTable} recId="2"/>);
        let gearIcon = TestUtils.scryRenderedDOMComponentsWithClass(component, "globalActionLink");
        Simulate.click(gearIcon[0]);
        let tableSettingsLink = TestUtils.scryRenderedDOMComponentsWithClass(component, "modifyTableSettings");
        expect(tableSettingsLink.length).toEqual(1);
        let formBuilderLink = TestUtils.scryRenderedDOMComponentsWithClass(component, "modifyForm");
        expect(formBuilderLink.length).toEqual(1);
    });

    it('test table settings link', () => {
        component = TestUtils.renderIntoDocument(<BuilderDropDownAction selectedApp={sampleApp} selectedTable={sampleTable} history={history}/>);
        let gearIcon = TestUtils.scryRenderedDOMComponentsWithClass(component, "globalActionLink");
        Simulate.click(gearIcon[0]);
        let tableSettingsLink = TestUtils.scryRenderedDOMComponentsWithClass(component, "modifyTableSettings");
        Simulate.click(tableSettingsLink[0]);
    });

    it('test form builder link', () => {
        spyOn(callbacks, "navigateToBuilder").and.callThrough();
        component = TestUtils.renderIntoDocument(<BuilderDropDownAction selectedApp={sampleApp} selectedTable={sampleTable} recId="2" navigateToBuilder={callbacks.navigateToBuilder}/>);
        let gearIcon = TestUtils.scryRenderedDOMComponentsWithClass(component, "globalActionLink");
        Simulate.click(gearIcon[0]);
        let formBuilderLink = TestUtils.scryRenderedDOMComponentsWithClass(component, "modifyForm");
        Simulate.click(formBuilderLink[0]);
        expect(callbacks.navigateToBuilder).toHaveBeenCalled();
    });

    it('test report builder link', () => {
        spyOn(callbacks, "navigateToBuilderReport").and.callThrough();
        component = TestUtils.renderIntoDocument(<BuilderDropDownAction selectedApp={sampleApp} selectedTable={sampleTable} rptId="2" navigateToBuilderReport={callbacks.navigateToBuilderReport()}/>);

        let gearIcon = TestUtils.scryRenderedDOMComponentsWithClass(component, "globalActionLink");
        Simulate.click(gearIcon[0]);

        let reportBuilderLink = TestUtils.scryRenderedDOMComponentsWithClass(component, "modifyForm");
        Simulate.click(reportBuilderLink[0]);

        expect(callbacks.navigateToBuilderReport).toHaveBeenCalled();
    });

});

