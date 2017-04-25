import UserService from '../../src/services/userService';
import BaseService from '../../src/services/baseService';
import StringUtils from '../../src/utils/stringUtils';

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

    it('test getReqUser function', () => {
        let url = StringUtils.format(userService.API.GET_REQ_USER);

        userService.getRequestUser();
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url);
    });

    it('test getUser function', () => {
        let userId = '123';
        let url = StringUtils.format(userService.API.GET_USER, [userId]);

        userService.getUser(userId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url);
    });
});
