import React from 'react';
import TestUtils from 'react-addons-test-utils';
import AppPropertiesRoute  from '../../../../../src/components/app/settings/categories/appPropertiesRoute';

describe('AppPropertiesRoute functions', () => {
    'use strict';

    const selectedApp = {id: 1, name: 'Washington'};
    const appId = 1;

    it('test render of component', () => {
        let component = TestUtils.renderIntoDocument(<AppPropertiesRoute selectedApp={selectedApp}
                                                                        params={appId}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });
});
