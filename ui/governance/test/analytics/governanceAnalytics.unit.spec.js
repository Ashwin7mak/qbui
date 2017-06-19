import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {Provider} from "react-redux";

import {GovernanceAnalytics} from '../../src/analytics/governanceAnalytics';
import {Analytics} from '../../../reuse/client/src/components/analytics/analytics';
//
// const mockDataset = 'unitTest'; // Use a non-existing dataset in case test accidentally makes a call to Everage
//
// const mockExistingScriptElement = {
//     parentNode: {
//         insertBefore() {}
//     }
// };

let component;

describe('GovernanceAnalytics', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    const middlewares = [thunk];
    const mockGridStore = configureMockStore(middlewares);

    // it('does not add more than one evergage script to the page', () => {
    //     spyOn(document, 'getElementById').and.returnValue(true);
    //     spyOn(document, 'createElement');
    //
    //     component = shallow(<GovernanceAnalytics />);
    //     component.instance().componentDidMount();
    //
    //     expect(document.createElement).not.toHaveBeenCalled();
    // });
    //
    // it('adds the evergage script even if there is no dataset specified', () => {
    //     spyOn(document, 'getElementById').and.returnValue(false);
    //     spyOn(document, 'createElement');
    //
    //     component = shallow(<GovernanceAnalytics />);
    //     component.instance().componentDidMount();
    //
    //     expect(document.createElement).not.toHaveBeenCalled();
    // });
    //
    // it('logs an error if the evergage script could not be setup', () => {
    //     component = shallow(<GovernanceAnalytics dataset={mockDataset}/>);
    //     let instance = component.instance();
    //
    //     spyOn(instance.logger, 'error');
    //     spyOn(instance, 'setupEvergage').and.throwError('test error');
    //
    //     instance.componentDidMount();
    //
    //     expect(instance.logger.error).toHaveBeenCalled();
    // });
    //
    // it('adds the evergage script to the page if it does not exist', () => {
    //     let testMockElement = {};
    //     spyOn(document, 'getElementById').and.returnValue(false);
    //     spyOn(document, 'createElement').and.returnValue(testMockElement);
    //     spyOn(document, 'getElementsByTagName').and.returnValue([mockExistingScriptElement]);
    //
    //     component = shallow(<GovernanceAnalytics dataset={mockDataset} />);
    //     component.instance().componentDidMount();
    //
    //     expect(document.createElement).toHaveBeenCalledWith('script');
    //     expect(testMockElement.type).toEqual('text/javascript');
    //     expect(testMockElement.id).toEqual(ANALYTICS_SCRIPT_ID);
    //     expect(testMockElement.async).toEqual(true);
    //     expect(testMockElement.src).toEqual(`http://cdn.evergage.com/beacon/${EVERGAGE_ACCOUNT_NAME}/${mockDataset}/scripts/evergage.min.js`);
    // });
    //
    // it('removes the evergage script from the page if it exists', () => {
    //     let testMockElement = {remove() {}};
    //     spyOn(testMockElement, 'remove');
    //     spyOn(document, 'getElementById').and.returnValue(testMockElement);
    //
    //     component = shallow(<GovernanceAnalytics dataset={mockDataset} />);
    //     component.instance().componentWillUnmount();
    //
    //     expect(testMockElement.remove).toHaveBeenCalled();
    // });
    //
    // it('does not remove the evergage script if it does not exist', () => {
    //     spyOn(document, 'getElementById').and.returnValue(false);
    //
    //     component = shallow(<GovernanceAnalytics dataset={mockDataset} />);
    //
    //     expect(component.instance().componentWillUnmount).not.toThrow();
    // });
    //
    it('updates Evergage when props are changed', () => {

        const store = mockGridStore({
            Grids: {
                accountUsers: {
                    pagination: {
                        totalItems: 123
                    }
                }
            },
            //AccountUsers: {},
            //Nav: {},
            RequestContext: {
                account: {
                    id: 9999,
                    name: "test_account",
                    allowsUserAdmins: false
                },
                currentUser: {
                    //id: 22222,
                    isAccountAdmin: true,
                    isCSR: false,
                    isOnDenyList: false,
                    isRealmAdmin: true
                },
                realm: {
                    id: 333,
                    isAccountURL: false,
                    name: "test_realm"
                }
            }
        });

        // component = mount(
        //     <Provider store={store}>
        //         <GovernanceAnalytics currentUserId={22222} />
        //     </Provider>); //, {lifecycleExperimental: true});
        // expect(component.find(Analytics)).toHaveProp('userId', 22222);
        // let instance = component.instance();
        // spyOn(instance, 'updateEvergage').and.callThrough();

        // component.setProps({userId: testSecondUserId});

        // expect(instance.updateEvergage).toHaveBeenCalled();
    });
    //
    // describe('functions that update evergage', () => {
    //     beforeEach(() => {
    //         // Don't add the script to the page during these tests
    //         spyOn(document, 'getElementById').and.returnValue(true);
    //
    //         window._aaq = {push() {}};
    //     });
    //
    //     afterEach(() => {
    //         window._aaq = [];
    //     });
    //
    //     let testCases = [
    //         {
    //             testFunction: 'updateEvergageUser',
    //             description: 'the evergage user',
    //             props: {userId: 1},
    //             expectedArguments: ['setUser', 1]
    //         },
    //         {
    //             testFunction: 'updateEvergageAdminStatus',
    //             description: 'the evergage admin status',
    //             props: {isAdmin: false},
    //             expectedArguments: ['setCustomField', 'has_app_admin', false, 'request']
    //         },
    //         {
    //             testFunction: 'updateAppManagerStatus',
    //             description: 'the evergage app manager status',
    //             props: {userId: 1, app: {ownerId: 1}},
    //             expectedArguments: ['setCustomField', 'is_app_mgr', true, 'request']
    //         },
    //         {
    //             testFunction: 'updateEvergageAccountId',
    //             description: 'the evergage account id',
    //             props: {app: {accountId: 1000}},
    //             expectedArguments: ['setCompany', 1000]
    //         },
    //         {
    //             testFunction: 'updateEverageAppId',
    //             description: 'the evergage app id',
    //             props: {app: {id: 13}},
    //             expectedArguments: ['setCustomField', 'appid', 13, 'request']
    //         },
    //     ];
    //
    //     testCases.forEach(testCase => {
    //         describe(testCase.testFunction, () => {
    //             it(`updates ${testCase.description}`, () => {
    //                 spyOn(window._aaq, 'push');
    //
    //                 component = shallow(<GovernanceAnalytics dataset={mockDataset} {...testCase.props} />);
    //                 component.instance()[testCase.testFunction]();
    //
    //                 expect(window._aaq.push).toHaveBeenCalledWith(testCase.expectedArguments);
    //             });
    //
    //             it(`does not update ${testCase.description} if the prop is not provided`, () => {
    //                 spyOn(window._aaq, 'push');
    //
    //                 component = shallow(<GovernanceAnalytics dataset={mockDataset} />);
    //                 component.instance()[testCase.testFunction]();
    //
    //                 expect(window._aaq.push).not.toHaveBeenCalled();
    //             });
    //         });
    //     });
    // });
});
