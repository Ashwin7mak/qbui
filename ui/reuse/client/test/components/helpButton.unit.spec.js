import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import HelpButton from '../../src/components/helpButton/helpButton';
import Icon from '../../src/components/icon/icon';

let component;

describe('HelpButton', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('displays a help button', () => {
        component = shallow(<HelpButton />);

        expect(component.find(Icon)).toHaveProp('icon', 'help');
    });
});
