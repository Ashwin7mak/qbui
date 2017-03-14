import BaseService from '../../../../client-react/src/services/baseService';
import AccountUsersService from '../../../src/account/users/AccountUsersService';


describe('Account Users Service Tests', () => {

    var accountUsersService;

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        spyOn(BaseService.prototype, 'setResponseInterceptor');
        spyOn(BaseService.prototype, 'get');
        spyOn(BaseService.prototype, 'post');
        spyOn(BaseService.prototype, 'put');
        spyOn(BaseService.prototype, 'delete');

        accountUsersService = new AccountUsersService();
    });

    it('test getAccountUsers function', () => {

        const url = accountUsersService.constructUrl(accountUsersService.API.GET_USERS);
        accountUsersService.getAccountUsers();

        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params: {}});
    });
});
