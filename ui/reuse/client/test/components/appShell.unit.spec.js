import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import AppShell from '../../src/components/appShell/appShell';
import {NotificationContainer} from 'react-notifications';

let component;

describe('AppShell', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('has a containing div with a class name based on the functional area', () => {
        component = shallow(<AppShell functionalAreaName="test"/>);

        expect(component.find('.testAppShell')).toBePresent();
    });

    it('has a notification container so that notifications can be displayed', () => {
        component = shallow(<AppShell functionalAreaName="test"/>);

        expect(component.find(NotificationContainer)).toBePresent();
    });

    it('displays child elements', () => {
        const testChildElement = <div className="childElement">Test Child Element</div>;

        component = shallow(<AppShell functionalAreaName="test">{testChildElement}</AppShell>);

        expect(component.find('.childElement')).toBePresent();
    });
});
