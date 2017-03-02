import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {FeatureSwitchOverridesRoute} from '../../src/components/featureSwitches/featureSwitchOverridesRoute';

describe('FeatureSwitchOverridesRoute', () => {
    'use strict';

    let component;

    const sampleSwitches = [
        {
            "name": "Feature",
            "description": "Description",
            "defaultOn": false,
            "teamName": "Team Name",
            "id": "fs-1",
            "overrides": [
                {
                    "entityType": "realm",
                    "entityValue": "realm1",
                    "on": true,
                    "id": "ov-1",
                },
                {
                    "entityType": "app",
                    "entityValue": "app1",
                    "on": false,
                    "id": "ov-2",
                }
            ]
        }
    ];

    const props = {
        params: {id: 'fs-1'},
        switches: sampleSwitches,
        overrides: sampleSwitches[0].overrides,
        getSwitches: () => {},
        setFeatureSwitchOverrides: () => {},
        createOverride: (name) => Promise.resolve('newId'),
        updateOverride: () => Promise.resolve(),
        overrideUpdated: () => {},
        deleteOverrides: (ids) => Promise.resolve()
    };

    beforeEach(() => {
        spyOn(props, 'getSwitches');
        spyOn(props, 'setFeatureSwitchOverrides').and.callThrough();
        spyOn(props, 'createOverride').and.callThrough();
        spyOn(props, 'updateOverride').and.callThrough();
        spyOn(props, 'overrideUpdated').and.callThrough();
        spyOn(props, 'deleteOverrides').and.callThrough();
    });

    afterEach(() => {
        props.getSwitches.calls.reset();
        props.setFeatureSwitchOverrides.calls.reset();
        props.createOverride.calls.reset();
        props.updateOverride.calls.reset();
        props.overrideUpdated.calls.reset();
        props.deleteOverrides.calls.reset();
    });

    it('test render of component ', () => {

        component = TestUtils.renderIntoDocument(<FeatureSwitchOverridesRoute {...props} />);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test selecting an override ', () => {

        component = TestUtils.renderIntoDocument(<FeatureSwitchOverridesRoute {...props} />);

        let checkbox = TestUtils.scryRenderedDOMComponentsWithClass(component, "selectRow");

        expect(checkbox.length).toBe(2);
        TestUtils.Simulate.change(checkbox[0], {"target": {"checked": true}});

    });

    it('test selecting all overrides ', () => {

        component = TestUtils.renderIntoDocument(<FeatureSwitchOverridesRoute {...props} />);

        let checkbox = TestUtils.scryRenderedDOMComponentsWithClass(component, "selectAll");
        expect(checkbox.length).toBe(1);

        TestUtils.Simulate.change(checkbox[0], {"target": {"checked": true}});

    });

    it('test toggling all overrides ', () => {

        component = TestUtils.renderIntoDocument(<FeatureSwitchOverridesRoute {...props} />);

        let checkbox = TestUtils.scryRenderedDOMComponentsWithClass(component, "selectAll");
        expect(checkbox.length).toBe(1);

        TestUtils.Simulate.change(checkbox[0], {"target": {"checked": true}});

        let turnOn = TestUtils.scryRenderedDOMComponentsWithClass(component, "turnOnButton");

        TestUtils.Simulate.click(turnOn[0]);

        let turnOff = TestUtils.scryRenderedDOMComponentsWithClass(component, "turnOffButton");

        TestUtils.Simulate.click(turnOff[0]);

        expect(props.updateOverride).toHaveBeenCalled();
    });

    it('test deleting overrides ', () => {

        component = TestUtils.renderIntoDocument(<FeatureSwitchOverridesRoute {...props} />);

        let checkbox = TestUtils.scryRenderedDOMComponentsWithClass(component, "selectAll");

        TestUtils.Simulate.change(checkbox[0], {"target": {"checked": true}});

        let deleteButton = TestUtils.scryRenderedDOMComponentsWithClass(component, "deleteButton");

        TestUtils.Simulate.click(deleteButton[0]);

        let confirmDelete = document.querySelectorAll(".confirmDeleteOverrides button.primaryButton");
        expect(confirmDelete.length).toBe(1);
        TestUtils.Simulate.click(confirmDelete[0]);

        expect(props.deleteOverrides).toHaveBeenCalledWith("fs-1", ["ov-1", "ov-2"]);

    });

    it('test adding a new override ', () => {

        component = TestUtils.renderIntoDocument(<FeatureSwitchOverridesRoute {...props} />);

        let addButton = TestUtils.scryRenderedDOMComponentsWithClass(component, "addButton");

        TestUtils.Simulate.click(addButton[0]);

        expect(props.createOverride).toHaveBeenCalled();

    });
});
