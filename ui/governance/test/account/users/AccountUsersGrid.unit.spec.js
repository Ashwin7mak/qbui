import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {AccountUsersGrid} from '../../../src/account/users/AccountUsersGrid';
import QbCell from '../../../../client-react/src/components/dataTable/qbGrid/qbCell';
import moment from 'moment';

describe('AccountUsersGrid', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    describe("Component", () => {

        const baseProps = {
            fetchAccountUsers: () => false,
            accountId: "0"
        };

        it("should show the correct set of headers", ()=> {
            let component = mount(<AccountUsersGrid {...baseProps} />);
            let headers = component.find("th").map(node => node.text());
            expect(headers).toEqual(["First Name", "Last Name", "Email", "User Name", "Last Access", "QuickBase Access Status", "Inactive?", "In Any Group?", "Group Manager?", "Can create apps?", "# Apps Managed", "In Realm Directory?", "Realm Approved?"]);
        });

        it("should should call fetch on mount", ()=> {
            let props = {
                ...baseProps
            };

            spyOn(props, 'fetchAccountUsers');
            mount(<AccountUsersGrid {...props} />);
            expect(props.fetchAccountUsers.calls.any()).toEqual(true);
        });

        describe("firstName", () => {
            it("should render properly", () => {
                let props = {
                    users: [{firstName: "Test", uid:0}],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(0);
                expect(cell.text()).toEqual(props.users[0].firstName);
            });
        });

        describe("lastName", () => {
            it("should render properly", () => {
                let props = {
                    users: [{lastName: "Test", uid:0}],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(1);
                expect(cell.text()).toEqual(props.users[0].lastName);
            });
        });

        describe("email", () => {
            it("should render properly", () => {
                let props = {
                    users: [{email: "Test", uid:0}],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(2);
                expect(cell.text()).toEqual(props.users[0].email);
            });
        });

        describe("userName", () => {
            it("should render properly", () => {
                let props = {
                    users: [{userName: "Test", uid:0}],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(3);
                expect(cell.text()).toEqual(props.users[0].userName);
            });
        });

        describe("lastAccess", () => {
            it("should render null properly", () => {
                let props = {
                    users: [{lastAccess: "1900-01-01T00:00:00Z", uid:0}],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(4);
                expect(cell.text()).toEqual("never");
            });

            it("should render properly", () => {
                let props = {
                    users: [{lastAccess: "2017-03-01T16:00:00Z", uid:0}],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(4);
                expect(cell.text()).toEqual("March 1 2017");
            });
        });

        describe("quickbase access status", () => {
            it("should render no app access correctly", () => {
                let props = {
                    users: [{
                        hasAppAccess: false,
                        userBasicFlags: 4,
                        realmDirectoryFlags: 4,
                        systemRights: 0,
                        uid:0
                    }],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(5);
                expect(cell.text()).toEqual("");
            });

            it("should show deactivated above all else", () => {
                let props = {
                    users: [{
                        hasAppAccess: true,
                        userBasicFlags: 64,
                        realmDirectoryFlags: 4,
                        systemRights: 2,
                        uid:0
                    }],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(5);
                expect(cell.text()).toEqual("Deactivated");
            });

            it("should show denied above everything other than deactivated", () => {
                let props = {
                    users: [{
                        hasAppAccess: true,
                        userBasicFlags: 0,
                        realmDirectoryFlags: 8,
                        systemRights: 2,
                        uid:0
                    }],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(5);
                expect(cell.text()).toEqual("Denied");
            });

            it("should quickbase staff above everything but denied and deactivated", () => {
                let props = {
                    users: [{
                        hasAppAccess: true,
                        userBasicFlags: 4,
                        realmDirectoryFlags: 4,
                        systemRights: 6,
                        uid:0
                    }],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(5);
                expect(cell.text()).toEqual("QuickBase Staff");
            });

            it("should show paid seat if has access", () => {
                let props = {
                    users: [{
                        hasAppAccess: true,
                        userBasicFlags: 4,
                        realmDirectoryFlags: 4,
                        systemRights: 0,
                        uid:0
                    }],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(5);
                expect(cell.text()).toEqual("Paid Seat");
            });
        });

        describe("Inactive?", () => {
            it("should render null properly", () => {
                let props = {
                    users: [{lastAccess: "1900-01-01T00:00:00Z", uid:0}],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(6);
                expect(cell.text()).toEqual("--");
            });

            it("should render inactive properly", () => {
                let props = {
                    users: [{lastAccess: moment().subtract(181, 'days').toISOString(), uid:0}],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(6);
                expect(cell.text()).toEqual("Y");
            });

            it("should render NOT inactive properly", () => {
                let props = {
                    users: [{lastAccess: moment().subtract(179, 'days').toISOString(), uid:0}],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(6);
                expect(cell.text()).toEqual("--");
            });
        });

        describe("In Any Group?", () => {

            it("should render numGroupsMember correctly when a number", () => {
                let props = {
                    users: [{numGroupsMember: 1, uid:0}],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(7);
                expect(cell.text()).toEqual("Y");
            });

            it("should render numGroupsMember correctly when 0", () => {
                let props = {
                    users: [{numGroupsMember: 0, uid:0}],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(7);
                expect(cell.text()).toEqual("--");
            });
        });

        describe("Group manager?", () => {

            it("should render numGroupsManaged correctly when a number", () => {
                let props = {
                    users: [{numGroupsManaged: 1, uid:0}],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(8);
                expect(cell.text()).toEqual("Y");
            });

            it("should render numGroupsManaged correctly when 0", () => {
                let props = {
                    users: [{numGroupsManaged: 0, uid:0}],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(8);
                expect(cell.text()).toEqual("--");
            });
        });

        describe("Can create apps?", () => {

            it("should render can create apps correctly when user has flag", () => {
                let props = {
                    users: [{accountTrusteeFlags: 5, uid:0}],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(9);
                expect(cell.text()).toEqual("Y");
            });

            it("should render can create apps correctly when user does NOT have flag", () => {
                let props = {
                    users: [{accountTrusteeFlags: 1, uid:0}],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(9);
                expect(cell.text()).toEqual("--");
            });
        });

        describe("# apps managed?", () => {

            it("should render num apps managed as 0", () => {
                let props = {
                    users: [{numAppsManaged: 0, uid:0}],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(10);
                expect(cell.text()).toEqual("0");
            });

            it("should render num apps managed as positive number", () => {
                let props = {
                    users: [{numAppsManaged: 1, uid:0}],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(10);
                expect(cell.text()).toEqual("1");
            });
        });

        describe("In Realm Directory?", () => {

            it("should render in realm directory correctly when 0", () => {
                let props = {
                    users: [{realmDirectoryFlags: 0, uid:0}],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(11);
                expect(cell.text()).toEqual("--");
            });

            it("should render in realm directory correctly when has some flags", () => {
                let props = {
                    users: [{realmDirectoryFlags: 1, uid:0}],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(11);
                expect(cell.text()).toEqual("Y");
            });
        });

        describe("Realm Approved?", () => {

            it("should render realm approved correctly when flag is set", () => {
                let props = {
                    users: [{realmDirectoryFlags: 5, uid:0}],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(12);
                expect(cell.text()).toEqual("Y");
            });

            it("should render realm approved correctly when flag is not set", () => {
                let props = {
                    users: [{realmDirectoryFlags: 1, uid:0}],
                    ...baseProps
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(12);
                expect(cell.text()).toEqual("--");
            });
        });
    });
});
