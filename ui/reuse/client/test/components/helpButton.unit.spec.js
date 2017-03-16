import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import ReHelpButton from '../../src/components/reHelpButton/reHelpButton';
import ReIcon from '../../src/components/reIcon/reIcon';

let component;

describe('ReHelpButton', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('displays a help button', () => {
        component = shallow(<ReHelpButton />);

        expect(component.find(ReIcon)).toHaveProp('icon', 'help');
    });
});
