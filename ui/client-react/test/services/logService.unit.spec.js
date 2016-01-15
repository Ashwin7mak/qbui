import LogService from '../../src/services/logService';
import BaseService from '../../src/services/baseService';
import constants from '../../src/services/constants';

describe('LogService functions', () => {
    'use strict';
    var logService;

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        spyOn(BaseService.prototype, 'setResponseInterceptor');
        spyOn(BaseService.prototype, 'get');
        spyOn(BaseService.prototype, 'post');

        logService = new LogService();
    });

    it('test log a message', () => {
        var msg = 'test service call message';
        logService.log(msg);

        expect(BaseService.prototype.get).not.toHaveBeenCalledWith();
        expect(BaseService.prototype.post).toHaveBeenCalledWith(logService.API.LOG, msg);
    });

});
