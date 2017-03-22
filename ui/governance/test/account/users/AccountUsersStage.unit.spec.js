import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import AccountUsersStage from '../../../src/account/users/AccountUsersStage';

let component;

/**
 * TODO:: Refactor test once component is fully implemented.
 * Some basic tests while the data for this component is being mocked out.
 * This test should be heavily refactored once the component is fully built.
 */
describe('AccountUsersStage', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('can be hidden during development', () => {
        component = mount(<AccountUsersStage isHidden={false} />);

        expect(component.find('.stageHeader')).not.toBePresent();
    });

    it('has a header', () => {
        component = mount(<AccountUsersStage />);

        expect(component.find('.stageHeaderTitle')).toHaveText('Manage All Users');
    });

    it('displays the number of paid seats', () => {
        component = mount(<AccountUsersStage/>);

        let renderedPaidSeats = component.find('.stageHeaderCountItem').at(0);
        expect(renderedPaidSeats.find('.stageHeaderCount')).toHaveText('25');
        expect(renderedPaidSeats.find('.stageHeaderCountTitle')).toHaveText('Paid seats');
    });
});
