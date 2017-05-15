import React from 'react';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import {AutomationListRoute, __RewireAPI__ as AutomationListRouteRewireAPI}  from '../../src/components/automation/settings/automationListRoute';
import thunk from 'redux-thunk';
import Promise from 'bluebird';
import _ from 'lodash';

const sampleApp = {id: 'app1', tables: []};


const props = {
    app: sampleApp
};

describe('AutomationListRoute functions', () => {
    'use strict';
    let component;

    describe('AutomationListRoute', () => {
        beforeEach(() => {
            component = TestUtils.renderIntoDocument(<AutomationListRoute {...props}/>);
        });

        afterEach(() => {
        });

        it('test render of component with null props', () => {
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        });

        it('test render of component with non null props', () => {
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        });

        it('test buttons are not rendered if form is not dirty', () => {
            let messageDiv = TestUtils.scryRenderedDOMComponentsWithClass(component, "automationListMessage");
            expect(messageDiv).toBeDefined()
        });

    });
});
