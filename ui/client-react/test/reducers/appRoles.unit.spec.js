import {getAppRoles, getAppRolesObject} from '../../src/reducers/appRoles';
import reducer from '../../src/reducers/appRoles';
import * as types from '../../src/actions/types';

function event(appId, type, content) {
    return {
        appId,
        type,
        content: content || null
    };
}

describe('Test appRoles reducer', () => {

    const appId = '1';
    const appRoles = [{"9": {"id": 9, "name": "none", "tableRights": {}, "fieldRights": {}, "description": "", "access": "NONE"}}];

    it('test load appRoles', () => {
        const state = reducer({}, event(appId, types.LOAD_APP_ROLES));
        const currentAppRoles = getAppRolesObject(state, appId);
        expect(currentAppRoles.roles).toEqual([]);
        expect(currentAppRoles.rolesLoading).toEqual(true);
        expect(currentAppRoles.error).toEqual(false);
    });

    it('test load appRoles success', () => {
        const state = reducer({}, event(appId, types.LOAD_APP_ROLES_SUCCESS, {roles: appRoles}));
        const currentAppRoles = getAppRolesObject(state, appId);
        expect(currentAppRoles.roles).toEqual(appRoles);
        expect(currentAppRoles.rolesLoading).toEqual(false);
        expect(currentAppRoles.error).toEqual(false);
    });

    it('test load appRoles failed', () => {
        const state = reducer({}, event(appId, types.LOAD_APP_ROLES_FAILED));
        const currentAppRoles = getAppRolesObject(state, appId);
        expect(currentAppRoles.roles).toEqual([]);
        expect(currentAppRoles.rolesLoading).toEqual(false);
        expect(currentAppRoles.error).toEqual(true);
    });

    it('test get appRole', () => {
        const state = reducer({}, event(appId, types.LOAD_APP_ROLES_SUCCESS, {roles: appRoles}));
        expect(getAppRoles(state, appId)).toEqual(appRoles);
    });
});
