import React from "react";
import {mount} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import {AccountUsersStage} from "../../../src/account/users/AccountUsersStage";
import Locale from "../../../../reuse/client/src/locales/locale";
import GovernanceBundleLoader from "../../../src/locales/governanceBundleLoader";
import {Provider} from "react-redux";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";

let component;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const pluralProps = {
    paidUsers: 11,
    deniedUsers: 5,
    deactivatedUsers: 2,
    totalRealmUsers: 26
};

const singularProp = {
    paidUsers: 1,
    deniedUsers: 1,
    deactivatedUsers: 1,
    totalRealmUsers: 7
};

const initialState = {
    AccountUsers: {
        status: {
            error: null,
            isFetching: false
        },
        users: [{
            uid: 1111,
            firstName: "Admin",
        }],
    }
};

describe('AccountUsersStage', () => {

    beforeEach(() => {
        jasmineEnzyme();
        GovernanceBundleLoader.changeLocale('en-us');
    });

    afterEach(() => {
        GovernanceBundleLoader.changeLocale('en-us');
    });

    it('has the correct header', () => {
        component = mount(
            <Provider store={mockStore(initialState)}>
                <AccountUsersStage />
            </Provider>);
        expect(component.find('.stageHeaderTitle')).toHaveText(Locale.getMessage("governance.account.users.stageTitle"));
    });

    it('displays the number of paid users', () => {
        component = mount(
            <Provider store={mockStore(initialState)}>
                <AccountUsersStage paidUsers={pluralProps.paidUsers}/>
            </Provider>);

        let renderedPaidSeats = component.find('.stageHeaderCountItem').at(0);
        expect(renderedPaidSeats.find('.stageHeaderCount')).toHaveText('11');
        expect(renderedPaidSeats.find('.stageHeaderCountTitle')).toHaveText(Locale.getMessage("governance.account.users.paidSeats"));
    });

    it('displays the number of singular paid user', () => {
        component = mount(
            <Provider store={mockStore(initialState)}>
                <AccountUsersStage paidUsers={singularProp.paidUsers}/>
            </Provider>);

        let renderedPaidSeats = component.find('.stageHeaderCountItem').at(0);
        expect(renderedPaidSeats.find('.stageHeaderCount')).toHaveText('1');
        expect(renderedPaidSeats.find('.stageHeaderCountTitle')).toHaveText(Locale.getMessage("governance.account.users.paidSeatSingular"));
    });

    it('displays the number of denied users', () => {

        component = mount(
            <Provider store={mockStore(initialState)}>
                <AccountUsersStage deniedUsers={pluralProps.deniedUsers}/>
            </Provider>);

        let renderedDeniedSeats = component.find('.stageHeaderCountItem').at(1);
        expect(renderedDeniedSeats.find('.stageHeaderCount')).toHaveText('5');
        expect(renderedDeniedSeats.find('.stageHeaderCountTitle')).toHaveText(Locale.getMessage("governance.account.users.deniedUsers"));
    });

    it('displays the number of singualar denied user', () => {

        component = mount(
            <Provider store={mockStore(initialState)}>
                <AccountUsersStage deniedUsers={singularProp.deniedUsers}/>
            </Provider>);

        let renderedDeniedSeats = component.find('.stageHeaderCountItem').at(1);
        expect(renderedDeniedSeats.find('.stageHeaderCount')).toHaveText('1');
        expect(renderedDeniedSeats.find('.stageHeaderCountTitle')).toHaveText(Locale.getMessage("governance.account.users.deniedUserSingular"));
    });

    it('displays the number of deactivated users', () => {

        component = mount(
            <Provider store={mockStore(initialState)}>
                <AccountUsersStage deactivatedUsers={pluralProps.deactivatedUsers}/>
            </Provider>);

        let renderedDeactivatedSeats = component.find('.stageHeaderCountItem').at(2);
        expect(renderedDeactivatedSeats.find('.stageHeaderCount')).toHaveText('2');
        expect(renderedDeactivatedSeats.find('.stageHeaderCountTitle')).toHaveText(Locale.getMessage("governance.account.users.deactivatedUsers"));
    });

    it('displays the number of singular deactivated user', () => {

        component = mount(
            <Provider store={mockStore(initialState)}>
                <AccountUsersStage deactivatedUsers={singularProp.deactivatedUsers}/>
            </Provider>);

        let renderedDeactivatedSeats = component.find('.stageHeaderCountItem').at(2);
        expect(renderedDeactivatedSeats.find('.stageHeaderCount')).toHaveText('1');
        expect(renderedDeactivatedSeats.find('.stageHeaderCountTitle')).toHaveText(Locale.getMessage("governance.account.users.deactivatedUserSingular"));
    });

    it('displays the number of realm directory users', () => {

        component = mount(
            <Provider store={mockStore(initialState)}>
                <AccountUsersStage totalRealmUsers={pluralProps.totalRealmUsers}/>
            </Provider>);

        let renderedRealmDirectorySeats = component.find('.stageHeaderCountItem').at(3);
        expect(renderedRealmDirectorySeats.find('.stageHeaderCount')).toHaveText('26');
        expect(renderedRealmDirectorySeats.find('.stageHeaderCountTitle')).toHaveText(Locale.getMessage("governance.account.users.realmDirectoryUsers"));
    });
});
