import constants from './constants';
import BaseService from './baseService';
import * as query from '../constants/query';
import Promise from 'bluebird';

class AppService extends BaseService {

    constructor() {
        super();

        //  App Service API endpoints
        this.API = {
            GET_APP                  : `${constants.BASE_URL.QBUI}/${constants.APPS}/{0}`,
            GET_APP_COMPONENTS       : `${constants.BASE_URL.QBUI}/${constants.APPS}/{0}/${constants.APPCOMPONENTS}`,
            GET_APP_USERS            : `${constants.BASE_URL.QBUI}/${constants.APPS}/{0}/${constants.USERS}`,
            GET_APPS                 : `${constants.BASE_URL.QBUI}/${constants.APPS}`,
            CREATE_APP               : `${constants.BASE_URL.QBUI}/${constants.APPS}`,

            GET_APP_RELATIONSHIPS  : `${constants.BASE_URL.PROXY}/${constants.APPS}/{0}/${constants.RELATIONSHIPS}`,
            POST_APP_RELATIONSHIPS : `${constants.BASE_URL.PROXY}/${constants.APPS}/{0}/${constants.RELATIONSHIPS}`
        };
    }

    /**
     * Return a QuickBase App
     *
     * @param appId
     * @returns promise
     */
    getApp(appId) {
        let url = super.constructUrl(this.API.GET_APP, [appId]);
        return super.get(url);
    }

    /**
     * Return a QuickBase App
     *
     * @param appId
     * @returns promise
     */
    getAppComponents(appId) {
        let url = super.constructUrl(this.API.GET_APP_COMPONENTS, [appId]);
        return super.get(url);
    }

    /**
     * get users for app (mocked for now)
     * @param appId
     */
    getAppUsers(appId) {
        let url = super.constructUrl(this.API.GET_APP_USERS, [appId]);
        return super.get(url);
    }

    /**
     * Return all QuickBase apps
     *
     * @param hydrate
     * @returns promise
     */
    getApps(hydrate) {
        //  should the information returned for each table be the table id
        //  only or a fully hydrated table object.
        let params = {};
        if (hydrate) {
            params[query.HYDRATE] = '1';
        }
        return super.get(this.API.GET_APPS, {params:params});
    }

    /**
     * create a new relationship in an app
     * @param appId
     * @param relationship relationship object, for example:
     *          {
     *              masterAppId: "0duiiaaaaab",
     *              masterTableId: "0duiiaaaaaj",
     *              masterFieldId: 3,
     *              detailAppId: "0duiiaaaaab",
     *              detailTableId: "0duiiaaaaak",
     *              detailFieldId: 7,
     *              appId: "0duiiaaaaab",
     *              description: "Referential integrity relationship between Master / Child Tables",
     *              referentialIntegrity: false,
     *              cascadeDelete: false
     *          }
     * @returns promise
     */
    createRelationship(appId, relationship) {
        let url = super.constructUrl(this.API.POST_APP_RELATIONSHIPS, [appId]);
        return super.post(url, relationship);
    }

    /**
     * Create a new app
     *
     * @param app
     * @returns {*}
     */
    createApp(app) {
        let url = super.constructUrl(this.API.CREATE_APP);
        return super.post(url, app);
    }
}

export default AppService;
