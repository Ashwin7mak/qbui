import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import HelpButton from 'REUSE/components/topNav/supportingComponents/helpButton';
import Icon from 'REUSE/components/icon/icon';
import UrlUtils from '../../../../client-react/src/utils/urlUtils';

let component;

describe('HelpButton', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('displays a help button', () => {
        component = shallow(<HelpButton />);

        expect(component.find(Icon)).toHaveProp('icon', 'help');
    });

    it('has the correct href', () => {
        component = shallow(<HelpButton/>);
        expect(component.find({href: UrlUtils.getHelpLink()})).toBePresent();
    });
});
