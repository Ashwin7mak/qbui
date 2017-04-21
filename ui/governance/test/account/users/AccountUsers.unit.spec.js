import React from 'react';
import {mount, shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {AccountUsers} from '../../../src/account/users/AccountUsers';
import GovernanceBundleLoader from '../../../src/locales/governanceBundleLoader';
import AccountUsersGrid from '../../../src/account/users/grid/AccountUsersGrid';
import {Provider} from "react-redux";
import configureMockStore from 'redux-mock-store';
import StandardGrid from '../../../src/common/grid/standardGrid';


describe('AccountUsers', () => {
    beforeEach(() => {
        jasmineEnzyme();
        GovernanceBundleLoader.changeLocale('en-us');
    });

    const baseProps = {
        fetchData: () => false,
        match: {
            params: {
                accountId: "0"
            }
        },
        loading: false
    };

    it("should should render an error state", ()=> {
        let props = {
            ...baseProps,
            dataFetchingError: "Error"
        };

        let component = mount(<AccountUsers {...props} />);
        let errorSection = component.find("h1");
        expect(errorSection.length).toEqual(1);
    });

    // it("should should call fetch on mount", ()=> {
    //     let props = {
    //         ...baseProps
    //     };
    //
    //     let mockStore = configureMockStore();
    //
    //     spyOn(props, 'fetchData');
    //     mount(<Provider store={mockStore({})}>
    //             <AccountUsers {...props} />
    //         </Provider>);
    //     expect(props.fetchData.calls.any()).toEqual(true);
    // });

    it("should set the appropriate props on its children", () => {
        let props = {
            ...baseProps,
            requestUser: {
                isAccountAdmin: true,
                isRealmAdmin: false,
                isCSR: false
            },
            requestRealm: {
                isAccountURL: false
            }
        };
        let component = shallow(<AccountUsers {...props} />);
        let grid = component.find(AccountUsersGrid);
        expect(grid.props().showAccountColumns).toEqual(true);
        expect(grid.props().showRealmColumns).toEqual(false);
    });
});
