import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {AccountUsers} from '../../../src/account/users/AccountUsers';
import GovernanceBundleLoader from '../../../src/locales/governanceBundleLoader';
import AccountUsersGrid from '../../../src/account/users/grid/AccountUsersGrid';


describe('example jasmine/enzyme setup', () => {
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

    it("should should call fetch on mount", ()=> {
        let props = {
            ...baseProps
        };

        spyOn(props, 'fetchData');
        mount(<AccountUsers {...props} />);
        expect(props.fetchData.calls.any()).toEqual(true);
    });

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
        let component = mount(<AccountUsers {...props} />);
        let grid = component.find(AccountUsersGrid);
        expect(grid.props().showAccountColumns).toEqual(true);
        expect(grid.props().showRealmColumns).toEqual(false);
    });
});
