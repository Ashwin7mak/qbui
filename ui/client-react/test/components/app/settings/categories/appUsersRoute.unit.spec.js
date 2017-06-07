/**
 * Created by rbeyer on 2/22/17.
 */
import React from 'react';
import {shallow} from 'enzyme';
import {AppUsersRoute, __RewireAPI__ as AppUsersRouteAPI} from '../../../../../src/components/app/settings/categories/appUsersRoute';

describe('AppUsersRoute functions', () => {
    'use strict';

    const appUsersUnfiltered = [{id: 1, name: 'Washington'}];
    const appRoles = [{"9": {"id": 1, "name": "none", "tableRights": {}, "fieldRights": {}, "description": "", "access": "NONE"}}];
    const appId = 1;
    const selectedApp = {name: "Duder", ownerId: "CFalc", unfilteredUsers: appUsersUnfiltered, users: appUsersUnfiltered};
    const appOwner = {firstName: "Captain", lastName: "Falcon", email: "cfalc@fzero.com"};
    const selectedAppUsers = [1, 3, 3, 7];
    const match = {params: {appId: appId}};
    const nextMatch = {params: {appId: 2}};

    const mockActions = {
        loadAppOwner() {return appOwner;},
        loadAppRoles() {return appRoles;},
        searchUsers() {},
        setUserRoleToAdd() {},
        openAddUserDialog() {},
        selectUserRows() {}
    };

    var IconActionsMock = React.createClass({
        render: function() {
            return (
                <div>test</div>
            );
        }
    });

    beforeEach(() => {
        AppUsersRouteAPI.__Rewire__('IconActions', IconActionsMock);
        spyOn(mockActions, 'loadAppOwner');
        spyOn(mockActions, 'loadAppRoles');
        spyOn(mockActions, 'searchUsers');
        spyOn(mockActions, 'setUserRoleToAdd');
        spyOn(mockActions, 'openAddUserDialog');
        spyOn(mockActions, 'selectUserRows');
    });

    afterEach(() => {
        AppUsersRouteAPI.__ResetDependency__('IconActions');
        mockActions.loadAppOwner.calls.reset();
        mockActions.loadAppRoles.calls.reset();
        mockActions.searchUsers.calls.reset();
        mockActions.setUserRoleToAdd.calls.reset();
        mockActions.openAddUserDialog.calls.reset();
        mockActions.selectUserRows.calls.reset();
    });

    it('test render of component', () => {
        let component = shallow(<AppUsersRoute unfilteredAppUsers={appUsersUnfiltered}
                                         loadAppOwner={mockActions.loadAppOwner}
                                         loadAppRoles={mockActions.loadAppRoles}
                                         searchUsers={mockActions.searchUsers}
                                         selectUserRows={mockActions.selectUserRows}
                                         appRoles={appRoles}
                                         appOwner={appOwner}
                                         selectedApp={selectedApp}
                                         selectedUserRows={[]}
                                         params={{appId: 1}}
                                         appUsers={[]}
                                         match={match}/>);
        let instance = component.instance();
        instance.componentDidMount();
        instance.selectAllRows();
    });

    it('test component will receive props', () => {
        let component = shallow(<AppUsersRoute appUsersUnfiltered={appUsersUnfiltered}
                                               loadAppOwner={mockActions.loadAppOwner}
                                               loadAppRoles={mockActions.loadAppRoles}
                                               appOwner={appOwner}
                                               appRoles={appRoles}
                                               selectedApp={selectedApp}
                                               selectedUserRows={[]}
                                               params={{appId: 1}}
                                               appUsers={[]}
                                               match={match}/>);
        let instance = component.instance();
        instance.componentWillReceiveProps({appUsersUnfiltered, match: nextMatch, appRoles, appOwner, selectedApp, selectedUserRows: [], params:{appId:2}, appUsers:[]});
    });
    it('test Selections', () => {
        let component = shallow(<AppUsersRoute unfilteredAppUsers={appUsersUnfiltered}
                                           selectUserRows={mockActions.selectUserRows}
                                           selectedAppUsers={selectedAppUsers}
                                           appRoles={appRoles}
                                           appOwner={appOwner}
                                           flux={{actions: {}}}
                                           selectedApp={selectedApp}
                                           selectedUserRows={[]}
                                           params={{appId: 1}}
                                           appUsers={[]}
                                           match={match}/>);
        let instance = component.instance();
        instance.toggleSelectedRow(1, 1);
        instance.toggleSelectAllRows();
        instance.deselectAllRows();
    });
});
