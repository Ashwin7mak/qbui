import BaseService from '../../../client-react/src/services/baseService';

class AccountUsersService extends BaseService {

    constructor() {
        super();

        //  Feature switch service API endpoints
        this.API = {
            GET_Users               : "https://jsonplaceholder.typicode.com/users"
        };
    }

    getUsers() {
        const params = {};
        const url = super.constructUrl(this.API.GET_Users, []);

        return super.get(url, {params});
    }
}

export default AccountUsersService;
