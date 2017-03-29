import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import FieldToken, {__RewireAPI__ as FieldTokenRewireAPI} from '../../../src/components/formBuilder/fieldToken/fieldToken';

const mockFieldUtils = {
    getFieldSpecificIcon(_type) {}
};
let mockFieldIcon = 'omelette';

let component;

describe('FieldToken', () => {
    beforeEach(() => {
        jasmineEnzyme();
        spyOn(mockFieldUtils, 'getFieldSpecificIcon').and.returnValue(mockFieldIcon);
        FieldTokenRewireAPI.__Rewire__('FieldUtils', mockFieldUtils);
    });

    afterEach(() => {
        FieldTokenRewireAPI.__ResetDependency__('FieldUtils');
    });

    it('renders the title of the field', () => {
        let testTitle = 'Something Rotten!';
        component = shallow(<FieldToken title={testTitle} />);

        let titleDiv = component.find('.fieldTokenTitle');
        expect(titleDiv).toBePresent();
        expect(titleDiv).toHaveText(testTitle);
    });

    it('optionally add an array of classes to the component', () => {
        let testClass = ['Shakespeare'];
        component = shallow(<FieldToken classes={testClass} />);

        expect(component.find(`.${testClass[0]}`)).toBePresent();
    });

    it('displays an icon for the field type', () => {
        let testFieldType = "Eggs!";
        component = shallow(<FieldToken type={testFieldType} />);

        expect(mockFieldUtils.getFieldSpecificIcon).toHaveBeenCalledWith(testFieldType);
        expect(component.find('.fieldTokenIcon')).toHaveText(mockFieldIcon);
    });

    it('displays the icon in a dragging state', () => {
        component = shallow(<FieldToken isDragging={true} />);

        expect(component.find('.fieldTokenDragging')).toBePresent();
    });

    it('displays the token in a non-dragging state for use in menus (default)', () => {
        component = shallow(<FieldToken isDragging={false} />);

        expect(component.find('.fieldTokenDragging')).not.toBePresent();
    });
});
