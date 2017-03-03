import UserService from '../../src/services/userService';
import BaseService from '../../src/services/baseService';
import constants from '../../src/services/constants';
import StringUtils from '../../src/utils/stringUtils';
import * as query from '../../src/constants/query';

describe('UserService functions', () => {
    'use strict';
    var userService;

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        spyOn(BaseService.prototype, 'setResponseInterceptor');
        spyOn(BaseService.prototype, 'get');
        spyOn(BaseService.prototype, 'post');

        userService = new UserService();
    });

    it('test getReqUserAdmin function', () => {
        let url = StringUtils.format(userService.API.IS_REQ_USER_ADMIN);

        userService.isReqUserAdmin();
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url);
    });
});
