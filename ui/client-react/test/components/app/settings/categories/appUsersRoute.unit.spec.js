/**
 * Created by rbeyer on 2/22/17.
 */
import React from 'react';
import {shallow} from 'enzyme';
import TestUtils from 'react-addons-test-utils';
import {AppUsersRoute, __RewireAPI__ as AppUsersRouteAPI} from '../../../../../src/components/app/settings/categories/appUsersRoute';

describe('AppUsersRoute functions', () => {
    'use strict';

    const appUsersUnfiltered = [{id: 1, name: 'Washington'}];
    const appRoles = [{"9": {"id": 1, "name": "none", "tableRights": {}, "fieldRights": {}, "description": "", "access": "NONE"}}];
    const appId = 1;
    const selectedApp = {name: "Duder", ownerId: "CFalc"};
    const appOwner = {firstName: "Captain", lastName: "Falcon", email: "cfalc@fzero.com"};
    const appOwerNoEmail = {firstName: "Captain", lastName: "Falcon"};
    const match = {params: {appId: appId}};
    const nextMatch = {params: {appId: 2}};
    const flux = {
        actions:{
            loadAppOwner: function() {return;},
            selectUsersRows: function() {return;},
            selectedUsersRows: function() {return;}
        }
    };

    const mockActions = {
        getAppRoles() {return appRoles;},
        loadAppRoles() {return appRoles;}
    };

    var IconActionsMock = React.createClass({
        render: function() {
            return (
                <div>test</div>
            );
        }
    });

    beforeEach(() => {
        spyOn(flux.actions, 'loadAppOwner');
        spyOn(flux.actions, 'selectedUsersRows');
        spyOn(mockActions, 'getAppRoles');
        spyOn(mockActions, 'loadAppRoles');
    });

    afterEach(() => {
        flux.actions.loadAppOwner.calls.reset();
        flux.actions.selectedUsersRows.calls.reset();
        mockActions.getAppRoles.calls.reset();
        mockActions.loadAppRoles.calls.reset();
    });

    it('test render of component', () => {
        AppUsersRouteAPI.__Rewire__('IconActions', IconActionsMock);

        let component = TestUtils.renderIntoDocument(<AppUsersRoute appUsersUnfiltered={appUsersUnfiltered}
                                                                    loadAppRoles={mockActions.loadAppRoles}
                                                                    appRoles={appRoles}
                                                                    appOwner={appOwner}
                                                                    flux={flux}
                                                                    selectedApp={selectedApp}
                                                                    selectedUserRows={[]}
                                                                    params={{appId: 1}}
                                                                    appUsers={[]}
                                                                    match={match}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        component = shallow(<AppUsersRoute appUsersUnfiltered={appUsersUnfiltered}
                                         loadAppRoles={mockActions.loadAppRoles}
                                         appRoles={appRoles}
                                         appOwner={appOwner}
                                         flux={flux}
                                         selectedApp={selectedApp}
                                         selectedUserRows={[]}
                                         params={{appId: 1}}
                                         appUsers={[]}
                                         match={match}/>);
        let instance = component.instance();
        instance.componentDidMount();
        instance.selectAllRows();
        AppUsersRouteAPI.__ResetDependency__('IconActions');
    });

    it('test component will receive props', () => {
        AppUsersRouteAPI.__Rewire__('IconActions', IconActionsMock);

        let component = shallow(<AppUsersRoute appUsersUnfiltered={appUsersUnfiltered}
                                               loadAppRoles={mockActions.loadAppRoles}
                                               appOwner={appOwner}
                                               appRoles={appRoles}
                                               flux={flux}
                                               selectedApp={selectedApp}
                                               selectedUserRows={[]}
                                               params={{appId: 1}}
                                               appUsers={[]}
                                               match={match}/>);
        let instance = component.instance();
        instance.componentWillReceiveProps({appUsersUnfiltered, match: nextMatch, appRoles, appOwner, flux, selectedApp, selectedUserRows: [], params:{appId:2}, appUsers:[]});
        AppUsersRouteAPI.__ResetDependency__('IconActions');
    });
    it('test Selections', () => {
        AppUsersRouteAPI.__Rewire__('IconActions', IconActionsMock);
        let component = shallow(<AppUsersRoute appUsersUnfiltered={appUsersUnfiltered}
                                           appRoles={appRoles}
                                           appOwner={appOwner}
                                           flux={flux}
                                           selectedApp={selectedApp}
                                           selectedUserRows={[]}
                                           params={{appId: 1}}
                                           appUsers={[]}
                                           match={match}/>);
        let instance = component.instance();
        instance.toggleSelectedRow(1, 1);
        instance.toggleSelectAllRows();
        instance.deselectAllRows();
        AppUsersRouteAPI.__ResetDependency__('IconActions');
    });
});
