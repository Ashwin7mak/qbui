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
        spyOn(BaseService.prototype, 'put');
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

    it('test saveAutomation function', () => {
        let appId = "testApp";
        let automationId = "auto1";
        let auto1 = {id: 'auto1', name: 'Auto 1', active: true, type: "EMAIL"};
        let url = StringUtils.format(automationService.API.SAVE_AUTOMATION, [appId, automationId]);

        automationService.saveAutomation(appId, automationId, auto1);
        expect(BaseService.prototype.put).toHaveBeenCalledWith(url, auto1);
    });

    it('test invokeAutomation function', () => {
        let appId = "testApp";
        let wfId = "testAutmation";
        let url = StringUtils.format(automationService.API.AUTOMATION_INVOKE, [appId, wfId]);

        automationService.invokeAutomation(appId, wfId, {});
        expect(BaseService.prototype.post).toHaveBeenCalledWith(url, {}, {});
    });

    it('test createAutomation function', () => {
        let appId = "testApp";
        let auto1 = {name:"Auto_1", active: true, type:"EMAIL"};
        let url = StringUtils.format(automationService.API.GET_AUTOMATIONS, [appId]);

        automationService.createAutomation(appId,auto1);
        expect(BaseService.prototype.post).toHaveBeenCalledWith(url, auto1);
    })
});
