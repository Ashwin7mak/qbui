import BaseService from '../../../../client-react/src/services/baseService';
import RequestContextService from '../../../src/common/requestContext/RequestContextService';


describe('RequestContextService', () => {

    var srv;

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        spyOn(BaseService.prototype, 'setResponseInterceptor');
        spyOn(BaseService.prototype, 'get');
        spyOn(BaseService.prototype, 'post');
        spyOn(BaseService.prototype, 'put');
        spyOn(BaseService.prototype, 'delete');

        srv = new RequestContextService();
    });

    it('calls the right url and passes the account id', () => {

        let accountId = 1;
        const url = srv.constructUrl(srv.API.GET_CONTEXT, []);
        srv.getRequestContext(accountId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params: {accountId: accountId}});
    });

    it('calls the right url and does not pass account id if not valid', () => {
        const url = srv.constructUrl(srv.API.GET_CONTEXT, []);
        srv.getRequestContext();
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params: {}});
    });
});
