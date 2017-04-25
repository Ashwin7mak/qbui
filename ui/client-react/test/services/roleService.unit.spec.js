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

    it('test removeUsersFromRole function', () => {
        let appId = '123';
        let roleId = 10;
        let url = StringUtils.format(roleService.API.APP_ROLE_USERS, [appId, roleId]);

        roleService.removeUsersFromRole(appId, roleId);
        expect(BaseService.prototype.delete).toHaveBeenCalledWith(url);
    });

    it('test removeUsersFromRole function', () => {
        let appId = '123';
        let roleId = 10;
        let url = StringUtils.format(roleService.API.APP_ROLE_USERS, [appId, roleId]);

        roleService.assignUsersToRole(appId, roleId);
        expect(BaseService.prototype.post).toHaveBeenCalledWith(url);
    });

});
