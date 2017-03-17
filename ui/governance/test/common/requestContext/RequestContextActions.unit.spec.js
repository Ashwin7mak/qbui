import * as RequestContextActions from '../../../src/common/requestContext/RequestContextActions';
import RequestContextService from '../../../src/common/requestContext/RequestContextService';
import * as types from '../../../src/app/actionTypes';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Promise from 'bluebird';

describe('RequestContextActions', () => {

    var middleware =  [thunk];
    const mockStore = configureMockStore(middleware);

    const defaultServiceData = {
        realm: {
            name: "realm",
            id: 1
        },
        account: {
            name: "account",
            id: 1
        },
        user: {
            is: {
                accountAdmin: false,
                realmAdmin: false,
                csr: false
            }
        }
    };

    const defaultState = {
        RequestContext: {
            account: {},
            realm: {},
            currentUser: {},
            status: {}
        }
    };

    it('performs the normal case as expected', (done) => {
        const store = mockStore(defaultState);
        const accountId = 1;

        spyOn(RequestContextService.prototype, 'getRequestContext').and.returnValue(Promise.resolve({data: defaultServiceData}));

        const expectedActions = [
            {type: types.REQUEST_CONTEXT_FETCHING},
            {...defaultServiceData, type: types.REQUEST_CONTEXT_SUCCESS}
        ];

        return store
            .dispatch(RequestContextActions.fetchRequestContextIfNeeded(accountId))
            .then(() => {
                const actions = store.getActions();
                expect(actions).toEqual(expectedActions);
                done();
            });
    });

});
