import React from 'react';
import TestUtils from 'react-addons-test-utils';
import FeatureSwitchesRoute from '../../src/components/featureSwitches/featureSwitchesRoute';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {Provider} from "react-redux";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('FeatureSwitchesRoute', () => {
    'use strict';

    let component;

    it('test render of component ', () => {

        const initialState = {
            featureSwitches: {
                switches: [],
                overrides: [],
                states: []
            }
        };

        const store = mockStore(initialState);

        component = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <FeatureSwitchesRoute params={{}} />
            </Provider>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });
});
