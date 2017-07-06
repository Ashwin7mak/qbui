import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {FeatureSwitchesRoute} from '../../src/components/featureSwitches/featureSwitchesRoute';
import {MemoryRouter} from 'react-router-dom';
describe('FeatureSwitchesRoute', () => {
    let component;

    const sampleSwitches = [
        {
            "name": "Feature",
            "description": "Description",
            "defaultOn": false,
            "teamName": "Team Name",
            "id": "id-1",
            "overrides": []
        },
        {
            "name":"Feature 2",
            "description":"Description",
            "defaultOn":true,
            "teamName":"Team Name",
            "id":"id-2",
            "overrides":[]
        }
    ];

    const props = {
        switches: sampleSwitches,
        error: null,
        getSwitches: () => {},
        createFeatureSwitch: (name) => Promise.resolve('newId'),
        updateFeatureSwitch: () => Promise.resolve(),
        featureSwitchUpdated: () => {},
        deleteFeatureSwitches: (ids) => Promise.resolve()
    };

    beforeEach(() => {
        spyOn(props, 'getSwitches');
        spyOn(props, 'createFeatureSwitch').and.callThrough();
        spyOn(props, 'updateFeatureSwitch').and.callThrough();
        spyOn(props, 'featureSwitchUpdated').and.callThrough();
        spyOn(props, 'deleteFeatureSwitches').and.callThrough();
    });

    afterEach(() => {
        props.getSwitches.calls.reset();
        props.createFeatureSwitch.calls.reset();
        props.updateFeatureSwitch.calls.reset();
        props.featureSwitchUpdated.calls.reset();
        props.deleteFeatureSwitches.calls.reset();
    });

    // These tests would be enabled when we have a global service for feature services in place
    // https://quickbase.atlassian.net/browse/MC-1189
    xit('test render of component ', () => {

        component = TestUtils.renderIntoDocument(
            /**
             * React Router relies on React context to work, instead of stubbing the router context,
             * recommended approach is to wrap the component in staticRouter/MemoryRouter
             */
            <MemoryRouter>
                <FeatureSwitchesRoute {...props} />
            </MemoryRouter>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

    });

    xit('test selecting a feature switch ', () => {

        component = TestUtils.renderIntoDocument(
            <MemoryRouter>
                <FeatureSwitchesRoute {...props} />
            </MemoryRouter>);

        let checkbox = TestUtils.scryRenderedDOMComponentsWithClass(component, "selectRow");

        expect(checkbox.length).toBe(2);
        TestUtils.Simulate.change(checkbox[0], {"target": {"checked": true}});

    });

    xit('test selecting all feature switches ', () => {

        component = TestUtils.renderIntoDocument(
            <MemoryRouter>
                <FeatureSwitchesRoute {...props} />
            </MemoryRouter>);

        let checkbox = TestUtils.scryRenderedDOMComponentsWithClass(component, "selectAll");
        expect(checkbox.length).toBe(1);

        TestUtils.Simulate.change(checkbox[0], {"target": {"checked": true}});

    });

    xit('test toggling all feature switches ', () => {

        component = TestUtils.renderIntoDocument(
            <MemoryRouter>
                <FeatureSwitchesRoute {...props} />
            </MemoryRouter>);

        let checkbox = TestUtils.scryRenderedDOMComponentsWithClass(component, "selectAll");
        expect(checkbox.length).toBe(1);

        TestUtils.Simulate.change(checkbox[0], {"target": {"checked": true}});

        let turnOn = TestUtils.scryRenderedDOMComponentsWithClass(component, "turnOnButton");

        TestUtils.Simulate.click(turnOn[0]);

        expect(props.updateFeatureSwitch).toHaveBeenCalled();

        let turnOff = TestUtils.scryRenderedDOMComponentsWithClass(component, "turnOffButton");

        TestUtils.Simulate.click(turnOff[0]);

        expect(props.updateFeatureSwitch).toHaveBeenCalled();
    });

    xit('test deleting feature switches ', () => {

        component = TestUtils.renderIntoDocument(
            <MemoryRouter>
                <FeatureSwitchesRoute {...props} />
            </MemoryRouter>);

        let checkbox = TestUtils.scryRenderedDOMComponentsWithClass(component, "selectAll");

        TestUtils.Simulate.change(checkbox[0], {"target": {"checked": true}});

        let deleteButton = TestUtils.scryRenderedDOMComponentsWithClass(component, "deleteButton");

        TestUtils.Simulate.click(deleteButton[0]);

        let confirmDelete = document.querySelectorAll(".confirmDeleteFeatureSwitches button.primaryButton");
        expect(confirmDelete.length).toBe(1);
        TestUtils.Simulate.click(confirmDelete[0]);

        expect(props.deleteFeatureSwitches).toHaveBeenCalledWith(["id-1", "id-2"]);

    });

    xit('test adding a feature switch ', () => {

        component = TestUtils.renderIntoDocument(
            <MemoryRouter>
                <FeatureSwitchesRoute {...props} />
            </MemoryRouter>);

        let addButton = TestUtils.scryRenderedDOMComponentsWithClass(component, "addButton");

        TestUtils.Simulate.click(addButton[0]);

        expect(props.createFeatureSwitch).toHaveBeenCalled();

    });
});
