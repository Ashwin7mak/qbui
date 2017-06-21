import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import TestUtils from 'react-addons-test-utils';
import {FeatureSwitchOverridesRoute} from '../../src/components/featureSwitches/featureSwitchOverridesRoute';

describe('FeatureSwitchOverridesRoute', () => {
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

    // We can force promises to execute synchronously by mocking the promise with an object that has a
    // `then` key, which is a function that immediately executes the callback.
    const createProps = () => ({
        match:{params: {id: 'fs-1'}},
        switches: sampleSwitches,
        error: null,
        overrides: sampleSwitches[0].overrides,
        getSwitches: () => ({then: callback => callback()}),
        setFeatureSwitchOverrides: () => {},
        createOverride: (name) => ({then: callback => callback('newId')}),
        updateOverride: () => ({then: callback => callback()}),
        overrideUpdated: () => {},
        deleteOverrides: (ids) => ({then: callback => callback()}),
        editOverride: () => {}
    });

    let props;

    beforeEach(() => {
        jasmineEnzyme();

        props = createProps();

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
        component = mount(<FeatureSwitchOverridesRoute {...props} />);

        let checkbox = component.find('.selectAll');
        checkbox.simulate('change', {target: {checked: true}});

        let deleteButton = component.find('.deleteButton').first();
        deleteButton.simulate('click');

        // Need to use test utils because this component opens outside of the current one (Modal on document)
        let confirmDelete = document.querySelectorAll(".confirmDeleteOverrides button.primaryButton");
        expect(confirmDelete.length).toBe(1);
        TestUtils.Simulate.click(confirmDelete[0]);

        expect(props.deleteOverrides).toHaveBeenCalledWith("fs-1", ["ov-1", "ov-2"]);
    });

    it('test adding a new override ', () => {

        component = shallow(<FeatureSwitchOverridesRoute {...props} />);

        let addButton = component.find('.addButton');

        addButton.simulate('click');

        expect(props.createOverride).toHaveBeenCalled();
    });
});
