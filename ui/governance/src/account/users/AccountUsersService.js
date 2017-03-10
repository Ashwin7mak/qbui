import BaseService from '../../../../client-react/src/services/baseService';

class AccountUsersService extends BaseService {

    constructor() {
        super();
        this.API = {
            GET_USERS               : "https://jsonplaceholder.typicode.com/users"
        };
    }

    getUsers() {
        const params = {};
        const url = super.constructUrl(this.API.GET_USERS, []);

        return super.get(url, {params});
    }
}

export default AccountUsersService;
