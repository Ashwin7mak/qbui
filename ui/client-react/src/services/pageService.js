import constants from './constants';
import BaseService from './baseService';

class PageService extends BaseService {

    constructor() {
        super();

        //  Page Service API endpoints
        this.API = {
            CREATE_PAGE: `${constants.BASE_URL.QBUI}/${constants.APPS}/{0}/${constants.PAGES}`,
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
}

export default PageService;
