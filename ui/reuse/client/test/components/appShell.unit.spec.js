import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import ReAppShell from '../../src/components/appShell/reAppShell';
import {NotificationContainer} from 'react-notifications';

let component;

describe('ReAppShell', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('has a containing div with a class name based on the functional area', () => {
        component = shallow(<ReAppShell functionalAreaName="test"/>);

        expect(component.find('.testAppShell')).toBePresent();
    });

    it('has a notification container so that notifications can be displayed', () => {
        component = shallow(<ReAppShell functionalAreaName="test"/>);

        expect(component.find(NotificationContainer)).toBePresent();
    });

    it('displays child elements', () => {
        const testChildElement = <div className="childElement">Test Child Element</div>;

        component = shallow(<ReAppShell functionalAreaName="test">{testChildElement}</ReAppShell>);

        expect(component.find('.childElement')).toBePresent();
    });
});
