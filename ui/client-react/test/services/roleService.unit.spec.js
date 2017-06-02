/**
 * Created by rbeyer on 2/22/17.
 */
import RoleService from '../../src/services/roleService';
import BaseService from '../../src/services/baseService';
import StringUtils from '../../src/utils/stringUtils';

describe('Role Service functions', () => {
    'use strict';
    var roleService;

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        spyOn(BaseService.prototype, 'setResponseInterceptor');
        spyOn(BaseService.prototype, 'get');
        spyOn(BaseService.prototype, 'delete');
        spyOn(BaseService.prototype, 'post');

        roleService = new RoleService();
    });

    it('test getAppRoles function', () => {
        let appId = '123';
        let url = StringUtils.format(roleService.API.GET_APP_ROLES, [appId]);

        roleService.getAppRoles(appId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url);
    });

    it('test remove a list of Users From App Role function', () => {
        let appId = '123';
        let roleId = 10;
        let userIds = [1];
        let url = StringUtils.format(roleService.API.APP_ROLE_USERS, [appId, roleId]);
        roleService.removeUsersFromAppRole(appId, roleId, userIds);
        expect(BaseService.prototype.delete).toHaveBeenCalledWith(url, Object({data: userIds}));
    });

    it('test assign a list of users an app role function', () => {
        let appId = '123';
        let roleId = 10;
        let userIds = [1, 2];
        let url = StringUtils.format(roleService.API.APP_ROLE_USERS, [appId, roleId]);
        roleService.assignUsersToAppRole(appId, roleId, userIds);
        expect(BaseService.prototype.post).toHaveBeenCalledWith(url, Object({data: userIds}));
    });

});
