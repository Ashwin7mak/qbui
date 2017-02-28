import React from 'react';
import TestUtils from 'react-addons-test-utils';
import FeatureSwitchOverridesRoute from '../../src/components/featureSwitches/featureSwitchOverridesRoute';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {Provider} from "react-redux";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('FeatureSwitchOverridesRoute', () => {
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
                <FeatureSwitchOverridesRoute params={{featureId: '1'}} />
            </Provider>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });
});
