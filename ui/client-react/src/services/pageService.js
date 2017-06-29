import constants from './constants';
import BaseService from './baseService';

class PageService extends BaseService {

    constructor() {
        super();

        //  Page Service API endpoints
        this.API = {
            CREATE_PAGE     : `${constants.BASE_URL.PROXY}/${constants.APPS}/{0}/${constants.PAGES}`,
            GET_PAGE        : `${constants.BASE_URL.PROXY}/${constants.APPS}/{0}/${constants.PAGES}/{1}`
        };
    }

    /**
     * Create a new page
     * @param appId
     * @param page
     * @returns {*}
     */
    createPage(appId, page) {
        let url = super.constructUrl(this.API.CREATE_PAGE, [appId]);
        return super.post(url, page);
    }


    /**
     * Get a page
     * @param appId
     * @param pageId
     * @returns {*}
     */
    getPage(appId, pageId) {
        let url = super.constructUrl(this.API.GET_PAGE, [appId, pageId]);
        return super.get(url);
    }
}

export default PageService;
