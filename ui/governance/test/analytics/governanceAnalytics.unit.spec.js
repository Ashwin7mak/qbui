import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {Provider} from "react-redux";

import {GovernanceAnalytics} from '../../src/analytics/governanceAnalytics';
import {Analytics} from '../../../reuse/client/src/components/analytics/analytics';


let component;

describe('GovernanceAnalytics', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    const middlewares = [thunk];
    const mockGridStore = configureMockStore(middlewares);


    fit('should contain the main Analytics component', () => {
        let govComponent = shallow(
            <GovernanceAnalytics />
        );
        expect(govComponent).toBeDefined();
        expect(govComponent.length).toBeTruthy();

        expect(govComponent.find(Analytics)).toBeDefined();
    });
});
