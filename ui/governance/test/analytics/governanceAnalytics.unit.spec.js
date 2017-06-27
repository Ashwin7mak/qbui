import React from 'react';
import {shallow} from 'enzyme';
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

    it('should correctly pass props to the Analytics component', () => {
        let userId = 3;
        let paidUsers = 100;

        let govComponent = shallow(<GovernanceAnalytics currentUserId={userId}
                                                        isCSR={true}
                                                        paidUsers={paidUsers} />);
        let analyticsComponent = govComponent.find(Analytics);

        expect(analyticsComponent).toBeDefined();
        expect(analyticsComponent).toHaveProp('userId', userId);
        expect(analyticsComponent).toHaveProp('evergageUpdateProps');

        let eUpdateProps = analyticsComponent.props().evergageUpdateProps;
        expect(eUpdateProps.is_CSR).toBeTruthy();
        expect(eUpdateProps.paidUsers).toEqual(paidUsers);
        expect(eUpdateProps.isAdmin).toBeUndefined();
    });
});
