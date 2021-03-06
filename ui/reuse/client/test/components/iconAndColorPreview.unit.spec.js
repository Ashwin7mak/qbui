import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import Icon, {AVAILABLE_ICON_FONTS} from '../../src/components/icon/icon';

import IconAndColorPreview from '../../src/components/iconAndColorPreview/iconAndColorPreview';

let component;

const getPreview = () => component.find('.preview');
const getPreviewIcon = () => component.find(Icon);
const getPreviewHiddenIcon = () => component.find('.previewHiddenIcon');
const getPreviewHiddenDiv = () => component.find('.previewHidden');

const testIcon = 'favicon';
const testColor = '#74489d';
const standardProps = {icon: testIcon, backgroundColor: testColor};



describe('IconAndColorPreview', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('shows the hidden state (empty circle with question mark) by default if no props are passed in', () => {
        component = shallow(<IconAndColorPreview />);

        expect(getPreview()).toHaveStyle('backgroundColor', '#ffffff');
        expect(getPreviewHiddenIcon()).toBePresent();
        expect(getPreviewHiddenDiv()).toBePresent();
        expect(getPreviewIcon()).not.toBePresent();
    });

    it('shows an icon in the preview', () => {
        component = shallow(<IconAndColorPreview {...standardProps} />);

        const iconComponent = getPreviewIcon();
        expect(iconComponent).toHaveProp('icon', testIcon);
        expect(iconComponent).toHaveProp('iconFont', AVAILABLE_ICON_FONTS.DEFAULT);
        expect(getPreviewHiddenIcon()).not.toBePresent();
        expect(getPreviewHiddenDiv()).not.toBePresent();
    });

    it('can change the color of the icon', () => {
        component = shallow(<IconAndColorPreview {...standardProps} iconColor={testColor} />);

        expect(getPreview()).toHaveStyle('color', testColor);
        expect(getPreviewHiddenIcon()).not.toBePresent();
        expect(getPreviewHiddenDiv()).not.toBePresent();
    });

    it('can change the color of the background', () => {
        component = shallow(<IconAndColorPreview {...standardProps} backgroundColor={testColor} />);

        expect(getPreview()).toHaveStyle('backgroundColor', testColor);
        expect(getPreviewHiddenIcon()).not.toBePresent();
        expect(getPreviewHiddenDiv()).not.toBePresent();
    });

    it('displays a question mark inside a white circle when the preview is not visible (invalid values)', () => {
        component = shallow(<IconAndColorPreview/>);

        expect(getPreview()).toHaveStyle('backgroundColor', '#ffffff');
        expect(component.find(Icon)).not.toBePresent();
        expect(getPreviewHiddenIcon()).toBePresent();
        expect(getPreviewHiddenIcon()).toHaveText('?');
    });

    describe('displays an empty circle with a question mark', () => {
        let testCases = [
            {
                description: 'when a background color is not provided',
                icon: testIcon,
                backgroundColor: null
            },
            {
                description: 'when the background color is invalid',
                icon: testIcon,
                backgroundColor: 'invalidColor'
            },
            {
                description: 'when the icon is not provided',
                icon: null,
                backgroundColor: testColor
            },
            {
                description: 'when neither a background color or icon is provided',
                icon: null,
                backgroundColor: null
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                component = shallow(<IconAndColorPreview icon={testCase.icon} backgroundColor={testCase.backgroundColor} />);

                expect(getPreviewHiddenDiv()).toBePresent();
                expect(getPreviewHiddenIcon()).toBePresent();
                expect(getPreview()).toHaveStyle('backgroundColor', '#ffffff');
                expect(component.find(Icon)).not.toBePresent();
            });
        });
    });
});
