import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import {GovernanceAnalytics} from '../../src/analytics/governanceAnalytics';
import {Analytics} from '../../../reuse/client/src/components/analytics/analytics';

let component;

describe('GovernanceAnalytics', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('should contain the main Analytics component', () => {
        let govComponent = shallow(<GovernanceAnalytics />);
        expect(govComponent.find(Analytics)).toBeDefined();
    });
});
