/**
 * Created by rbeyer on 2/22/17.
 */
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import AppUsersRoute, {__RewireAPI__ as AppUsersRouteAPI} from '../../../../../src/components/app/settings/categories/appUsersRoute';

describe('AppUsersRoute functions', () => {
    'use strict';

    const appUsersUnfiltered = [{id: 1, name: 'Washington'}];
    const appRoles = [{"9": {"id": 1, "name": "none", "tableRights": {}, "fieldRights": {}, "description": "", "access": "NONE"}}];
    const appId = 1;
    const selectedApp = {name: "Duder"};

    const flux = {
        actions:{
            loadAppRoles: function() {return;}
        }
    };

    var IconActionsMock = React.createClass({
        render: function() {
            return (
                <div>test</div>
            );
        }
    });

    beforeEach(() => {
        spyOn(flux.actions, 'loadAppRoles');
    });

    afterEach(() => {
        flux.actions.loadAppRoles.calls.reset();
    });

    it('test render of component', () => {
        AppUsersRouteAPI.__Rewire__('IconActions', IconActionsMock);
        let component = TestUtils.renderIntoDocument(<AppUsersRoute appUsersUnfiltered={appUsersUnfiltered}
                                                                    appRoles={appRoles}
                                                                    flux={flux}
                                                                    selectedApp={selectedApp}
                                                                    params={{appId: appId}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        AppUsersRouteAPI.__ResetDependency__('IconActions');
    });
});
