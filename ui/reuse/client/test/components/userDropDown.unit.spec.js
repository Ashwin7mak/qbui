import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import UserDropDown, {__RewireAPI__ as UserDropDownRewireAPI} from '../../src/components/reTopNav/supportingComponents/userDropDown';

const mockI18nMessage = ({message}) => <div className="i18nMessage">{message}</div>;

let component;

describe('UserDropDown', () => {
    beforeEach(() => {
        jasmineEnzyme();

        UserDropDownRewireAPI.__Rewire__('I18nMessage', mockI18nMessage);
    });

    afterEach(() => {
        UserDropDownRewireAPI.__ResetDependency__('I18nMessage');
    });

    it('has a menu item for passed in locales', () => {
        const testLocales = {
            locales: ['a', 'b', 'c'],
            changeLocale(_locale) {}
        };
        spyOn(testLocales, 'changeLocale');

        component = mount(<UserDropDown supportedLocales={testLocales.locales} changeLocale={testLocales.changeLocale} />);

        let links = component.find('.localeLink');

        expect(links.length).toEqual(testLocales.locales.length);
        testLocales.locales.forEach((locale, index) => {
            let link = links.at(index);
            expect(link.find('.i18nMessage')).toHaveText(`header.menu.locale.${locale}`);

            link.find('a').simulate('click');
            expect(testLocales.changeLocale).toHaveBeenCalledWith(locale);
        });
    });

    it('has a sign out button', () => {
        const mockSignOut = {signOut() {}};
        spyOn(mockSignOut, 'signOut');
        component = mount(<UserDropDown signOutUser={mockSignOut.signOut}/>);

        let signOutButton = component.find('.signOutButton');
        expect(signOutButton).toHaveText('header.menu.sign_out');

        signOutButton.find('a').simulate('click');

        expect(mockSignOut.signOut).toHaveBeenCalled();
    });

    it('has a disabled preferences menu item', () => {
        component = mount(<UserDropDown/>);

        let preferencesButton = component.find('.preferencesButton');
        expect(preferencesButton).toBePresent();
        expect(preferencesButton).toHaveClassName('disabled');
        expect(preferencesButton.find('.i18nMessage')).toHaveText('header.menu.preferences');
    });
});
