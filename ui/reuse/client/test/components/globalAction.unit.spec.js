import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import ReGlobalAction, {__RewireAPI__ as ReGlobalActionRewireAPI} from '../../src/components/reGlobalAction/reGlobalAction';

let component;

describe('ReGlobalAction', () => {
    beforeEach(() => {
        jasmineEnzyme();

        // Creating mock elements here so that the Router and internationalization do not need to be loaded for this test
        ReGlobalActionRewireAPI.__Rewire__('Link', ({to, className, children}) => <div><div className={className}>{to}</div>{children}</div>);
        ReGlobalActionRewireAPI.__Rewire__('ReIcon', ({icon}) => <div className="mockIcon">{icon}</div>);
        ReGlobalActionRewireAPI.__Rewire__('I18nMessage', ({message}) => <div className="mockMessage">{message}</div>);
    });

    afterEach(() => {
        ReGlobalActionRewireAPI.__ResetDependency__('Link');
        ReGlobalActionRewireAPI.__ResetDependency__('ReIcon');
        ReGlobalActionRewireAPI.__ResetDependency__('I18nMessage');
    });

    it('displays a link with an icon', () => {
        const icon = 'testIcon';
        const msg = 'testMsg';
        const link = 'testLink';
        component = mount(<ReGlobalAction action={{icon, msg, link}} tabIndex={1}/>);

        expect(component.find('.globalActionLink')).toHaveText(link);
        expect(component.find('.mockIcon')).toHaveText(icon);
        expect(component.find('.mockMessage')).toHaveText(msg);
    });
});
