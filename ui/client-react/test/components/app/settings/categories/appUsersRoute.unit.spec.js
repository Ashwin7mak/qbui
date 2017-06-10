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

    const props = {
        loadAppAndOwner() {return appOwner;},
        loadAppRoles() {return appRoles;},
        searchUsers() {},
        setUserRoleToAdd() {},
        openAddUserDialog() {},
        selectUserRows() {},
        clearUserRows() {},
        loadApp() {},
        showSuccessDialog() {},
        unfilteredAppUsers: appUsersUnfiltered,
        appUsers: [],
        appRoles: appRoles,
        appId: appId,
        selectedApp: selectedApp,
        appOwner: appOwner,
        realmUsers: [],
        openDialogStatus: false,
        roleIdToAdd: null,
        selectedUserRows: [],
        successDialogOpen: false,
        addedAppUser: {},
        match: match
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
        spyOn(props, 'loadAppAndOwner');
        spyOn(props, 'loadAppRoles');
        spyOn(props, 'searchUsers');
        spyOn(props, 'setUserRoleToAdd');
        spyOn(props, 'openAddUserDialog');
        spyOn(props, 'selectUserRows');
        spyOn(props, 'clearUserRows');
    });

    afterEach(() => {
        AppUsersRouteAPI.__ResetDependency__('IconActions');
        props.loadAppAndOwner.calls.reset();
        props.loadAppRoles.calls.reset();
        props.searchUsers.calls.reset();
        props.setUserRoleToAdd.calls.reset();
        props.openAddUserDialog.calls.reset();
        props.selectUserRows.calls.reset();
        props.clearUserRows.calls.reset();
    });

    it('test render of component', () => {
        let component = shallow(<AppUsersRoute {...props}/>);
        let instance = component.instance();
        instance.componentDidMount();
        instance.selectAllRows();
    });

    it('test Selections', () => {
        let component = shallow(<AppUsersRoute {...props}/>);
        let instance = component.instance();
        instance.toggleSelectedRow(1, 1);
        instance.toggleSelectAllRows();
        instance.deselectAllRows();
    });
    it('test add user', () => {
        let component = shallow(<AppUsersRoute {...props}/>);
        let instance = component.instance();
        instance.toggleAddUserDialog(true);
        instance.setUserRoleToAdd('ROLE');
    });
});
