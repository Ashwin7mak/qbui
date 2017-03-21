import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import IconActions, {__RewireAPI__ as IconActionsRewireAPI} from '../../src/components/iconActions/iconActions';

const I18nMessageMock = ({message}) => <span className="mockI18nMessage">{message}</span>;
const IconMock = ({icon}) => <span className="mockIcon">{icon}</span>;
const lodashMock = {uniqueId(prefix) {return `${prefix}_5`;}};
const mockParentFunctions = {onClick() {}};


const testActions = [
    {key: 'a', icon: 'testIcon', i18nMessageKey: 'test.message', onClick: mockParentFunctions.onClick},
    {key: 'b', icon: 'testIcon2', plainMessage: 'test message', className: 'testOptionalClass'},
    {key: 'c', icon: 'testIcon3', plainMessage: 'test disabled', i18nMessageKey: 'testOverride.message', disabled: true},
    {plainMessage: 'no icon'}
];

let component;

describe('IconActions', () => {
    beforeEach(() => {
        jasmineEnzyme();
        IconActionsRewireAPI.__Rewire__('I18nMessage', I18nMessageMock);
        IconActionsRewireAPI.__Rewire__('Icon', IconMock);
        IconActionsRewireAPI.__Rewire__('lodash', lodashMock);
    });

    afterEach(() => {
        IconActionsRewireAPI.__ResetDependency__('I18nMessage');
        IconActionsRewireAPI.__ResetDependency__('Icon');
        IconActionsRewireAPI.__ResetDependency__('lodash');
    });

    it('renders when no actions are passed in', () => {
        component = shallow(<IconActions actions={[]}/>);

        expect(component.find('.iconActions')).toBePresent();
        expect(component.find('.iconActionButton')).not.toBePresent();
    });

    it('renders an array of actions', () => {
        component = shallow(<IconActions actions={testActions} />);

        expect(component.find('.iconActionButton').length).toEqual(testActions.length);
    });

    it('displays the icon for an action', () => {
        component = mount(<IconActions actions={testActions} />);

        let firstActionItem = component.find('.iconActionButton').at(0);
        expect(firstActionItem.find('.mockIcon')).toHaveText(testActions[0].icon);
        expect(firstActionItem.find('.mockI18nMessage')).not.toBePresent();
    });

    it('displays the translated i18nMessageKey (only shows when in menu)', () => {
        component = mount(<IconActions actions={testActions} maxButtonsBeforeMenu={0} />);

        let actionItemWithMessageKey = component.find('.menuActionButton').at(0);
        expect(actionItemWithMessageKey.find('.mockI18nMessage')).toHaveText(testActions[0].i18nMessageKey);
    });

    it('displays a plain string as the text for an action (only shows when in menu)', () => {
        component = mount(<IconActions actions={testActions} maxButtonsBeforeMenu={0} />);

        let actionItemWithPlainMessage = component.find('.menuActionButton').at(1);
        expect(actionItemWithPlainMessage).toHaveText(testActions[1].plainMessage);
        expect(actionItemWithPlainMessage.find('.mockI18nMessage')).not.toBePresent();
    });

    it('displays a translated string if both an i18nMessageKey and a plainMessage are passed in', () => {
        component = mount(<IconActions actions={testActions} maxButtonsBeforeMenu={0}/>);

        let itemWithPlainAndI18nMessage = component.find('.menuActionButton').at(2);
        expect(itemWithPlainAndI18nMessage.find('.mockI18nMessage')).toHaveText(testActions[2].i18nMessageKey);
    });

    it('shows a disabled action', () => {
        component = mount(<IconActions actions={testActions} maxButtonsBeforeMenu={0}/>);

        let itemWithPlainAndI18nMessage = component.find('.menuActionButton').at(2);
        expect(itemWithPlainAndI18nMessage.find('.mockI18nMessage')).toHaveText(testActions[2].i18nMessageKey);
    });

    it('shows a disabled menu action', () => {
        component = mount(<IconActions actions={testActions} maxButtonsBeforeMenu={0}/>);

        let disabledItem = component.find('.menuActionButton').at(2);
        expect(disabledItem).toHaveClassName('disabled');

        let activeItem = component.find('.menuActionButton').at(0);
        expect(activeItem).not.toHaveClassName('disabled');
    });

    it('fires a callback when the action is clicked', () => {
        spyOn(mockParentFunctions, 'onClick');
        const actions = _.cloneDeep(testActions);
        actions[0].onClick = mockParentFunctions.onClick;

        component = mount(<IconActions actions={actions} />);

        let firstActionItem = component.find('.iconActionButton').at(0);

        firstActionItem.simulate('click');

        expect(mockParentFunctions.onClick).toHaveBeenCalled();
    });

    it('optionally displays some actions in a dropdown menu', () => {
        const testMaxButtonsBeforeMenu = 2;
        component = mount(<IconActions actions={testActions} maxButtonsBeforeMenu={testMaxButtonsBeforeMenu} />);

        expect(component.find('.iconActionButton').length).toEqual(testActions.length - testMaxButtonsBeforeMenu + 1); // We have to add an additional 1 to account for the automatic dropdown menu button
        expect(component.find('.menuActionButton').length).toEqual(testActions.length - testMaxButtonsBeforeMenu);
    });
});
