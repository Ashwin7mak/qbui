import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import {FieldTokenInMenu} from '../../../src/components/formBuilder/fieldToken/fieldTokenInMenu';
import FieldToken from '../../../src/components/formBuilder/fieldToken/fieldToken';

let component;

describe('FieldTokenInMenu', () => {
    const type = 'textbox';
    const title = 'New Textbox';

    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders a field token for display in an EXISTING menu', () => {
        component = shallow(<FieldTokenInMenu type={type} title={title} name={name}/>);

        let fieldToken = component.find(FieldToken);

        expect(fieldToken).toHaveProp('isDragging', false);
        expect(fieldToken).toHaveProp('type', type);
        expect(fieldToken).toHaveProp('title', title);
    });

    it('renders a field token for display in a NEW menu', () => {
        component = shallow(<FieldTokenInMenu type={type} title={title} />);

        let fieldToken = component.find(FieldToken);

        expect(fieldToken).toHaveProp('isDragging', false);
        expect(fieldToken).toHaveProp('type', type);
        expect(fieldToken).toHaveProp('title', title);
    });
});
