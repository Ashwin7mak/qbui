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

    const flux = {
        actions:{
            loadAppRoles: function() {return;}
        }
    };

    beforeEach(() => {
        spyOn(flux.actions, 'loadAppRoles');
    });

    afterEach(() => {
        flux.actions.loadAppRoles.calls.reset();
    });

    it('test render of component', () => {
        let component = TestUtils.renderIntoDocument(<AppUsersRoute appUsersUnfiltered={appUsersUnfiltered}
                                                                    appRoles={appRoles}
                                                                    flux={flux}
                                                                    params={{appId: appId}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });
});
