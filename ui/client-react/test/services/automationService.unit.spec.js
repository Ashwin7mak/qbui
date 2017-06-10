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

    it('test getAutomations function', () => {
        let appId = "testApp";
        let url = StringUtils.format(automationService.API.GET_AUTOMATIONS, [appId]);

        automationService.getAutomations(appId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url);
    });

    it('test getAutomation function', () => {
        let appId = "testApp";
        let automationId = "testAuto";
        let url = StringUtils.format(automationService.API.GET_AUTOMATION, [appId, automationId]);

        automationService.getAutomation(appId, automationId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url);
    });

    it('test invokeAutomation function', () => {
        let appId = "testApp";
        let wfId = "testAutmation";
        let url = StringUtils.format(automationService.API.AUTOMATION_INVOKE, [appId, wfId]);

        automationService.invokeAutomation(appId, wfId, {});
        expect(BaseService.prototype.post).toHaveBeenCalledWith(url, {}, {});
    });
});
