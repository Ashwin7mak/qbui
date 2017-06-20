import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import Tooltip from '../../../src/components/tooltip/tooltip';

import TokenInMenu from '../../../src/components/dragAndDrop/elementToken/tokenInMenu';

let component;

describe('TokenInMenu', () => {
    const type = 'textbox';
    const title = 'New Textbox';

    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders a field token for display in an EXISTING menu', () => {
        component = shallow(<TokenInMenu type={type} title={title} name={name}/>);

        let fieldToken = component.find('ElementToken');

        expect(fieldToken).toHaveProp('isDragging', false);
        expect(fieldToken).toHaveProp('type', type);
        expect(fieldToken).toHaveProp('title', title);
    });

    it('renders a field token for display in a NEW menu', () => {
        component = shallow(<TokenInMenu type={type} title={title} />);

        let fieldToken = component.find('ElementToken');

        expect(fieldToken).toHaveProp('isDragging', false);
        expect(fieldToken).toHaveProp('type', type);
        expect(fieldToken).toHaveProp('title', title);
    });

    it('optionally displays a tooltip for the token in the menu', () => {
        let tooltipMessage = 'test tooltip';
        component = shallow(<TokenInMenu type={type} title={title} tooltipText={tooltipMessage} />);

        let tooltip = component.find(Tooltip); // Tooltip could not be found with string locator. Needed to import.

        expect(tooltip).toBePresent();
        expect(tooltip).toHaveProp('plainMessage', tooltipMessage);
    });
});
