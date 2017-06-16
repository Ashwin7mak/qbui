import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import CreateNewItemButton, {__RewireAPI__ as CreateNewItemButtonRewireAPI} from '../../src/components/sideNavs/createNewItemButton';

let component;
const I18nMessageMock = () => <div>test</div>;
let mockMessage = 'mockMessage';
let mockClassName = 'mockClassName';
let mockFunc = {
    handleOnClick() {}
};

describe('CreateNewItemButton', () => {
    beforeEach(() => {
        jasmineEnzyme();
        CreateNewItemButtonRewireAPI.__Rewire__('I18nMessage', I18nMessageMock);
        spyOn(mockFunc, 'handleOnClick');
    });

    afterEach(() => {
        CreateNewItemButtonRewireAPI.__ResetDependency__('I18nMessage');
    });

    it('it will invoke the handleOnClick function when clicked', () => {
        component = mount(<CreateNewItemButton message={mockMessage}
                                               handleOnClick={mockFunc.handleOnClick()}
                                               className="mockClassName"/>);

        let createNewItemButton = component.find('.newItem .leftNavLink');
        createNewItemButton.simulate('click');

        expect(mockFunc.handleOnClick).toHaveBeenCalled();
        expect(component.props().message).toBe(mockMessage);
        expect(component.props().className).toBe(mockClassName);
    });
});
