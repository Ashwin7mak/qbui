import React from "react";
import {mount} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import AccountUsersStage, {__RewireAPI__ as AccountUsersStageRewireAPI} from "../../../src/account/users/AccountUsersStage";
import Locale from "../../../../reuse/client/src/locales/locale";
import GovernanceBundleLoader from "../../../src/locales/governanceBundleLoader";
import {getTotalPaidUsers, getTotalDeniedUsers, getTotalDeactivatedUsers, getTotalRealmUsers} from "../../../src/account/users/AccountUsersReducer";

let component;

describe('AccountUsersStage', () => {


    beforeEach(() => {
        jasmineEnzyme();
        AccountUsersStageRewireAPI.__Rewire__('AccountUsersStage', () => {return <div></div>;});
        GovernanceBundleLoader.changeLocale('en-us');
    });

    afterEach(() => {
        AccountUsersStageRewireAPI.__ResetDependency__('AccountUsersStage');
        GovernanceBundleLoader.changeLocale('en-us');
    });

    it('has the correct header', () => {
        component = mount(<AccountUsersStage users={[{'hasAppAccess': false}]}/>);
        expect(component.find('.stageHeaderTitle')).toHaveText(Locale.getMessage("governance.account.users.stageTitle"));
    });

    it('displays the number of paid users', () => {

        let users = [{'hasAppAccess': false}, // no access,
            {'hasAppAccess': true, 'realmDirectoryFlags': 0}, // denied
            {'hasAppAccess': true, 'userBasicFlags': 0}, // deactivated
            {'hasAppAccess': true, 'systemRights': 1}, // quickbase system user
            {'hasAppAccess': true, 'systemRights': 0, 'realmDirectoryFlags': 1, 'userBasicFlags': 2}];// the only person that is a 'paid' seat
        component = mount(<AccountUsersStage users={users}/>);

        let renderedPaidSeats = component.find('.stageHeaderCountItem').at(0);
        expect(renderedPaidSeats.find('.stageHeaderCount')).toHaveText('1');

        expect(renderedPaidSeats.find('.stageHeaderCountTitle')).toHaveText(Locale.getMessage("governance.account.users.paidSeatSingular"));
    });

    it('displays the number of denied users', () => {

        let users = [{'realmDirectoryFlags': 8}, {'realmDirectoryFlags': 0}];
        component = mount(<AccountUsersStage users={users}/>);

        let renderedDeniedSeats = component.find('.stageHeaderCountItem').at(1);
        expect(renderedDeniedSeats.find('.stageHeaderCount')).toHaveText('1');
        expect(renderedDeniedSeats.find('.stageHeaderCountTitle')).toHaveText(Locale.getMessage("governance.account.users.deniedUserSingular"));
    });

    it('displays the number of deactivated users', () => {

        let users = [{'userBasicFlags': 68}, {'userBasicFlags': 0}];
        component = mount(<AccountUsersStage users={users}/>);

        let renderedDeactivatedSeats = component.find('.stageHeaderCountItem').at(2);
        expect(renderedDeactivatedSeats.find('.stageHeaderCount')).toHaveText('1');
        expect(renderedDeactivatedSeats.find('.stageHeaderCountTitle')).toHaveText(Locale.getMessage("governance.account.users.deactivatedUserSingular"));
    });

    it('displays multiple number of paid users', () => {

        let users = [{'hasAppAccess': false}, // no access,
            {'hasAppAccess': true, 'realmDirectoryFlags': 0}, // denied
            {'hasAppAccess': true, 'userBasicFlags': 0}, // deactivated
            {'hasAppAccess': true, 'systemRights': 1}, // quickbase system user
            {'hasAppAccess': true, 'systemRights': 0, 'realmDirectoryFlags': 1, 'userBasicFlags': 2},
            {'hasAppAccess': true, 'systemRights': 0, 'realmDirectoryFlags': 1, 'userBasicFlags': 2}];
        component = mount(<AccountUsersStage users={users}/>);

        let renderedPaidSeats = component.find('.stageHeaderCountItem').at(0);
        expect(renderedPaidSeats.find('.stageHeaderCount')).toHaveText('2');

        expect(renderedPaidSeats.find('.stageHeaderCountTitle')).toHaveText(Locale.getMessage("governance.account.users.paidSeats"));
    });

    it('displays multiple number of denied users', () => {

        let users = [{'realmDirectoryFlags': 8}, {'realmDirectoryFlags': 8}, {'realmDirectoryFlags': 0}];
        component = mount(<AccountUsersStage users={users}/>);

        let renderedDeniedSeats = component.find('.stageHeaderCountItem').at(1);
        expect(renderedDeniedSeats.find('.stageHeaderCount')).toHaveText('2');
        expect(renderedDeniedSeats.find('.stageHeaderCountTitle')).toHaveText(Locale.getMessage("governance.account.users.deniedUsers"));
    });

    it('displays multiple number of deactivated users', () => {

        let users = [{'userBasicFlags': 68}, {'userBasicFlags': 68}, {'userBasicFlags': 0}];
        component = mount(<AccountUsersStage users={users}/>);

        let renderedDeactivatedSeats = component.find('.stageHeaderCountItem').at(2);
        expect(renderedDeactivatedSeats.find('.stageHeaderCount')).toHaveText('2');
        expect(renderedDeactivatedSeats.find('.stageHeaderCountTitle')).toHaveText(Locale.getMessage("governance.account.users.deactivatedUsers"));
    });

    it('displays the number of realm directory users', () => {

        let users = [{'realmDirectoryFlags': 52}, {'realmDirectoryFlags': 0}];
        component = mount(<AccountUsersStage users={users}/>);

        let renderedRealmDirectorySeats = component.find('.stageHeaderCountItem').at(3);
        expect(renderedRealmDirectorySeats.find('.stageHeaderCount')).toHaveText('1');
        expect(renderedRealmDirectorySeats.find('.stageHeaderCountTitle')).toHaveText(Locale.getMessage("governance.account.users.realmDirectoryUsers"));
    });
});
