import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import Main from '../src/components/main/main';

let component;

fdescribe('Main', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });
    
    it('renders the new governance homepage', () => {
        component = shallow(<Main />);

        expect(component).toHaveText('Welcome to governance!');
    });
});
