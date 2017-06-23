import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import AlertBanner from '../../src/components/alertBanner/alertBanner';

let component;

const text = 'My alert message';

describe('AlertBanner', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('displays an alert when isVisible is true', () => {
        component = shallow(<AlertBanner isVisible={true} />);

        expect(component.find('.alertBanner')).toBePresent();
    });

    it('hides the alert when isVisible is false', () => {
        component = shallow(<AlertBanner isVisible={false} />);

        expect(component.find('.alertBanner')).not.toBePresent();
    });

    it('has an alert icon', () => {
        component = shallow(<AlertBanner isVisible={true} />);

        expect(component.find({icon: 'alert'})).toBePresent();
    });

    it('renders text passed in as a child element', () => {
        component = shallow(<AlertBanner isVisible={true}>{text}</AlertBanner>);

        expect(component.find('.mainText')).toHaveText(text);
    });

    it('renders text passed in as a prop', () => {
        component = shallow(<AlertBanner isVisible={true} text={text}/>);

        expect(component.find('.mainText')).toHaveText(text);
    });

    it('renders text passed in as a prop instead of child text if both are provided', () => {
        const alernateText = 'alternate text';
        component = shallow(<AlertBanner isVisible={true} text={alernateText}>{text}</AlertBanner>);

        expect(component.find('.mainText')).toHaveText(alernateText);
    });
});



