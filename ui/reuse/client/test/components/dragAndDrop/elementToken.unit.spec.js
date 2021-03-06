import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import ElementToken, {__RewireAPI__ as ElementTokenRewireAPI} from '../../../src/components/dragAndDrop/elementToken/elementToken';

const mockFieldUtils = {
    getFieldSpecificIcon(_type) {}
};

const mockFieldIcon = 'omelette';
const MockIcon = ({icon}) => <span>{mockFieldIcon}</span>;


let component;

describe('ElementToken', () => {
    beforeEach(() => {
        jasmineEnzyme();
        spyOn(mockFieldUtils, 'getFieldSpecificIcon').and.returnValue(mockFieldIcon);
        ElementTokenRewireAPI.__Rewire__('FieldUtils', mockFieldUtils);
        ElementTokenRewireAPI.__Rewire__('Icon', MockIcon);
    });

    afterEach(() => {
        ElementTokenRewireAPI.__ResetDependency__('FieldUtils');
        ElementTokenRewireAPI.__ResetDependency__('Icon');
    });

    it('renders the title of the field', () => {
        let testTitle = 'Something Rotten!';
        component = shallow(<ElementToken title={testTitle} />);

        let titleDiv = component.find('.fieldTokenTitle');
        expect(titleDiv).toBePresent();
        expect(titleDiv).toHaveText(testTitle);
    });

    it('optionally add an array of classes to the component', () => {
        let testClass = ['Shakespeare'];
        component = shallow(<ElementToken classes={testClass} />);

        expect(component.find(`.${testClass[0]}`)).toBePresent();
    });

    it('displays an icon for the field type', () => {
        let testFieldType = "Eggs!";
        component = shallow(<ElementToken type={testFieldType} />);

        expect(mockFieldUtils.getFieldSpecificIcon).toHaveBeenCalledWith(testFieldType);

        expect(component.find(MockIcon)).toHaveProp('icon', mockFieldIcon);
    });

    it('displays the icon in a dragging state', () => {
        component = shallow(<ElementToken isDragging={true}
                                        selectedFormElement={{id: 13}}
                                        containingElement={{FormFieldElement: {id: 13}}}/>);

        expect(component.find('.fieldTokenDragging')).toBePresent();
    });

    it('displays the token in a non-dragging state for use in menus (default)', () => {
        component = shallow(<ElementToken isDragging={false} />);

        expect(component.find('.fieldTokenDragging')).not.toBePresent();
        expect(component.find('.fieldTokenCollapsed')).not.toBePresent();
    });

    it('displays the token in a non-dragging state when ids do not match', () => {
        component = shallow(<ElementToken isDragging={true}
                                        selectedFormElement={{id: 14}}
                                        containingElement={{FormFieldElement: {id: 13}}}/>);

        expect(component.find('.fieldTokenDragging')).not.toBePresent();
        expect(component.find('.fieldTokenCollapsed')).not.toBePresent();
    });

    it('displays the field token in a collapsed state', () => {
        component = shallow(<ElementToken isCollapsed={true} />);

        expect(component.find('.fieldTokenCollapsed')).toBePresent();
        expect(component.find('.fieldTokenDragging')).not.toBePresent();
    });
});
