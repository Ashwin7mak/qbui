/**
 * Created by rbeyer on 2/22/17.
 */
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import AppUsersRoute  from '../../../../../src/components/app/settings/categories/appUsersRoute';

describe('AppUsersRoute functions', () => {
    'use strict';

    const appUsersUnfiltered = [{id: 1, name: 'Washington'}];
    const appRoles = [{"9": {"id": 1, "name": "none", "tableRights": {}, "fieldRights": {}, "description": "", "access": "NONE"}}];
    const appId = 1;

    it('test render of component', () => {
        let component = TestUtils.renderIntoDocument(<AppUsersRoute appUsersUnfiltered={appUsersUnfiltered}
                                                                    appRoles={appRoles}
                                                                    params={{appId: appId}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });
});
