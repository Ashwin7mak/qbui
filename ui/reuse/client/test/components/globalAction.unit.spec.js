import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import GlobalAction, {__RewireAPI__ as GlobalActionRewireAPI} from '../../src/components/globalAction/globalAction';

let component;

describe('GlobalAction', () => {
    beforeEach(() => {
        jasmineEnzyme();

        // Creating mock elements here so that the Router and internationalization do not need to be loaded for this test
        GlobalActionRewireAPI.__Rewire__('Link', ({to, className, children}) => <div><div className={className}>{to}</div>{children}</div>);
        GlobalActionRewireAPI.__Rewire__('ReIcon', ({icon}) => <div className="mockIcon">{icon}</div>);
        GlobalActionRewireAPI.__Rewire__('I18nMessage', ({message}) => <div className="mockMessage">{message}</div>);
    });

    afterEach(() => {
        GlobalActionRewireAPI.__ResetDependency__('Link');
        GlobalActionRewireAPI.__ResetDependency__('ReIcon');
        GlobalActionRewireAPI.__ResetDependency__('I18nMessage');
    });

    it('displays a link with an icon', () => {
        const icon = 'testIcon';
        const msg = 'testMsg';
        const link = 'testLink';
        component = mount(<GlobalAction action={{icon, msg, link}} tabIndex={1}/>);

        expect(component.find('.globalActionLink')).toHaveText(link);
        expect(component.find('.mockIcon')).toHaveText(icon);
        expect(component.find('.mockMessage')).toHaveText(msg);
    });
});
