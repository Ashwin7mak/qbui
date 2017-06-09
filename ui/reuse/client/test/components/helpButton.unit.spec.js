import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import HelpButton, {__RewireAPI__ as HelpButtonRewireAPI} from 'REUSE/components/topNav/supportingComponents/helpButton';
import Icon from 'REUSE/components/icon/icon';
import UrlUtils from '../../../../client-react/src/utils/urlUtils';

const mockWalkme = {toggleMenu() {}};
const mockDevice = {isTouch() {return false;}};
const mockNotificationManager = {info() {}};

let component;

describe('HelpButton', () => {
    beforeEach(() => {
        jasmineEnzyme();

        window.WalkMePlayerAPI = mockWalkme;

        HelpButtonRewireAPI.__Rewire__('Device', mockDevice);
        HelpButtonRewireAPI.__Rewire__('NotificationManager', mockNotificationManager);
    });

    afterEach(() => {
        delete window.WalkMePlayerAPI;

        HelpButtonRewireAPI.__ResetDependency__('Device');
        HelpButtonRewireAPI.__ResetDependency__('NotificationManager', mockNotificationManager);
    });

    it('displays a help button', () => {
        component = shallow(<HelpButton />);

        expect(component.find(Icon)).toHaveProp('icon', 'help');
    });

    it('has the correct href', () => {
        spyOn(mockNotificationManager, 'info');
        component = shallow(<HelpButton/>);
        let helpButton = component.find('.reHelpButton').html();
        expect(helpButton.includes(UrlUtils.getHelpLink()));
    });

    // The following 3 tests are disabled because the help button has
    // been disabled for beta. Per PO/XD, the help button will be re-enabled
    // or deleted before Early Access when customers are on the app.
    xit('does not display the walkme on touch devices', () => {
        spyOn(mockDevice, 'isTouch').and.returnValue(true);
        spyOn(window.WalkMePlayerAPI, 'toggleMenu');

        component = shallow(<HelpButton />);

        component.find('.reHelpButton').simulate('click');

        expect(window.WalkMePlayerAPI.toggleMenu).not.toHaveBeenCalled();
    });

    xit('displays the help walkme when clicked', () => {
        spyOn(window.WalkMePlayerAPI, 'toggleMenu');

        component = shallow(<HelpButton />);

        component.find('.reHelpButton').simulate('click');

        expect(window.WalkMePlayerAPI.toggleMenu).toHaveBeenCalled();
    });

    xit('displays a message if the help walkme fails', () => {
        spyOn(window.WalkMePlayerAPI, 'toggleMenu').and.throwError('failed');
        spyOn(mockNotificationManager, 'info');

        component = shallow(<HelpButton />);

        component.find('.reHelpButton').simulate('click');

        expect(mockNotificationManager.info).toHaveBeenCalled();
    });
});
