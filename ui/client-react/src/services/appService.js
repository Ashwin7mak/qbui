import constants from './constants';
import BaseService from './baseService';
import Promise from 'bluebird';

class AppService extends BaseService {

    constructor() {
        super();

        //  App Service API endpoints
        this.API = {
            GET_APP     : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}`,
            GET_APPS    : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}`
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
     * get users for app (mocked for now)
     * @param appId
     */
    getAppUsers(appId) {
        const users = [
            {
                userId: "58440038",
                firstName: "Aditi",
                lastName: "Goel",
                screenName: "agoel@quickbase.com",
                email: "agoel@quickbase.com"
            },
            {
                "userId": "58452987",
                "firstName": "",
                "lastName": "",
                "screenName": "dhatch@quickbase.com",
                "email": "dhatch@quickbase.com"
            },
            {
                "userId": "58452986",
                "firstName": "Claire",
                "lastName": "Martininez",
                "screenName": "cmartinez@quickbase.com",
                "email": "cmartinez@quickbase.com"
            },
            {
                userId: "58453016",
                firstName: "Drew",
                lastName: "Stevens",
                screenName: "dstevens@quickbase.com",
                email: "dstevens@quickbase.com"
            },
            {
                "userId": "58453190",
                "firstName": "first_-a4b5cfc3-3267-4267-a59c-3d4871199470",
                "lastName": "last_-4309af3b-d650-414a-8afc-cd6eff486a4f",
                "screenName": "pNmECQNGCj99057833@g88.net",
                "email": "pNmECQNGCj99057833@g88.net"
            }
        ];
        return new Promise((resolve, reject) => {
            resolve({data: users});
        });
    }

    /**
     * Return all QuickBase apps
     *
     * @returns promise
     */
    getApps() {
        return super.get(this.API.GET_APPS);
    }

}

export default AppService;
