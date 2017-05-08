import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import Icon, {AVAILABLE_ICON_FONTS} from 'REUSE/components/icon/icon';
import QBToolTip from 'REUSE/components/tooltip/tooltip.js';

let component;

describe('Icon', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders an icon from the default font set', () => {
        component = shallow(<Icon icon="pencil" />);

        expect(component.find(`.${AVAILABLE_ICON_FONTS.DEFAULT}-pencil`)).toBePresent();
    });

    it('renders an icon from a different font set', () => {
        component = shallow(<Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon="Dimensions"/>);

        expect(component.find(`.${AVAILABLE_ICON_FONTS.TABLE_STURDY}-Dimensions`)).toBePresent();
    });
});

describe('tooltipTitle prop', () => {

    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders the correct tooltip id and plainMessage', () => {
        component = shallow(<Icon icon="video" tooltipTitle="Videocamera"/>);

        expect(component.find(QBToolTip).find({tipId: 'toolTip-video'})).toBePresent();
        expect(component.find(QBToolTip).find({plainMessage: 'Videocamera'})).toBePresent();
    });


    it('does not render QBToolTip if tooltipTitle is provided as prop', () => {
        component = shallow(<Icon icon="video" />);

        expect(component.find(QBToolTip).length).toEqual(0);
        expect(component.find({tipId: 'toolTip-video'}).length).toEqual(0);
        expect(component.find({plainMessage: 'Videocamera'}).length).toEqual(0);
    });
});
