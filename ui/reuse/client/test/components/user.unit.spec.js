import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import User from 'REUSE/components/user/user';
import Loader from 'react-loader';

const mockUser = {
    id: 40,
    administrator: true,
    firstName: 'Tuukka',
    lastName: 'Rask',
    screenName: 'AwesomeGoalie'
};

let component;

describe('User', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('shows a loading spinner while the user info is loading', () => {
        component = mount(<User user={{...mockUser, isLoading: true}} />);

        expect(component.find(Loader)).toHaveProp('loaded', false);
        expect(component.find('.userInfo')).not.toBePresent();
    });

    it('displays information about the user', () => {
        component = mount(<User user={mockUser} />);

        expect(component.find(Loader)).toHaveProp('loaded', true);
        expect(component.find('.userInfo')).toBePresent();
        expect(component.find('.userFirstName')).toIncludeText(mockUser.firstName);
        expect(component.find('.userLastName')).toIncludeText(mockUser.lastName);
        expect(component.find('.userScreenName')).toIncludeText(mockUser.screenName);
    });

    it('has a hidden div with attributes that can be targeted by javascript or analytics systems', () => {
        component = mount(<User user={mockUser} />);

        const hiddenUserInfo = component.find('.hiddenUserInfo');
        expect(hiddenUserInfo).toBePresent();
        expect(hiddenUserInfo).toHaveProp('data-user-id', mockUser.id);
    });
});
