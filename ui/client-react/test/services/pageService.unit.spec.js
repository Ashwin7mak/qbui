import PageService from '../../src/services/pageService';
import BaseService from '../../src/services/baseService';

describe('PageService functions', () => {
    'use strict';
    var pageService;

    beforeAll(() => {
        pageService = new PageService();
    });
    beforeEach(() => {
        spyOn(BaseService.prototype, 'post');
        spyOn(BaseService.prototype, 'get');
    });

    it('test createPage', () => {
        const appId = '123';
        const page = {
            pageId: 15,
            appId: "123",
            description: "Sample Description",
            pageTitle: "My First Sample Page",
            isDefaultPage: true,
            type: "APP_PAGE",
            widgetIdList: ["Widget123", "Widget456"],
            pageLayout: {
                isDefaultlayout: "boolean",
                pageLayoutTemplateId: 456,
                pageDisplayProperties: {
                    pageMaxWidth: 800,
                    pageMaxHeight: 800,
                    pageMinWidth: 200,
                    pageMinHeight: 200,
                    hasHorizontalScroll: true,
                    hasVerticalScroll: true,
                    numOfColumns: 12,
                    numOfRows: 12
                }
            }
        };

        const url = pageService.constructUrl(pageService.API.CREATE_PAGE, [appId]);
        pageService.createPage(appId, page);
        expect(BaseService.prototype.post).toHaveBeenCalledWith(url, page);
    });

    it('test getPage', () => {
        const appId = '123';
        const pageId = '12';

        const url = pageService.constructUrl(pageService.API.GET_PAGE, [appId, pageId]);
        pageService.getPage(appId, pageId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url);
    });
});
