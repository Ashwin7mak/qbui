/**
 * Created by msyed on 4/11/17.
 */
import AutomationService from '../../src/services/automationService';
import BaseService from '../../src/services/baseService';
import StringUtils from '../../src/utils/stringUtils';

describe('AutomationService functions', () => {
    'use strict';
    var automationService;

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        spyOn(BaseService.prototype, 'setResponseInterceptor');
        spyOn(BaseService.prototype, 'get');
        spyOn(BaseService.prototype, 'post');

        automationService = new AutomationService();
    });

    it('test invokeAutomation function', () => {
        let appId = "testApp";
        let wfId = "testAutmation";
        let url = StringUtils.format(automationService.API.AUTOMATION_INVOKE, [appId, wfId]);
        let host = "testHost";
        automationService.invokeAutomation(appId, wfId, {});
        expect(BaseService.prototype.post).toHaveBeenCalledWith(url, {}, {});
    });
});
