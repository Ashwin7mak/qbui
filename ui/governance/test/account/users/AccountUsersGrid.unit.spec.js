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

        it("should show the correct set of headers", ()=> {
            let component = mount(<AccountUsersGrid fetchAccountUsers={() => false} />);
            let headers = component.find("th").map(node => node.text());
            expect(headers).toEqual(["First Name" , "Last Name", "Email", "User Name", "Last Access", "Paid Seat?", "In Any Group?", "Group Manager?", "Can create apps?", "# App Managed", "Realm Approved?", "Denied?", "Deactivated?", "Inactive?"]);
        });

        it("should should call fetch on mount", ()=> {
            let props = {
                fetchAccountUsers: () => false
            };

            spyOn(props, 'fetchAccountUsers');
            mount(<AccountUsersGrid {...props} />);
            expect(props.fetchAccountUsers.calls.any()).toEqual(true);
        });

        describe("firstName", () => {
            it("should render properly", () => {
                let props = {
                    users: [{firstName: "Test", uid:0}],
                    fetchAccountUsers: () => false
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
                    fetchAccountUsers: () => false
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
                    fetchAccountUsers: () => false
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
                    fetchAccountUsers: () => false
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
                    fetchAccountUsers: () => false
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(4);
                expect(cell.text()).toEqual("never");
            });

            it("should render properly", () => {
                let props = {
                    users: [{lastAccess: moment().subtract(60, 'minutes').toISOString(), uid:0}],
                    fetchAccountUsers: () => false
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(4);
                expect(cell.text()).toEqual("an hour ago");
            });
        });

        describe("paid seat", () => {
            it("should render no app access correctly", () => {
                let props = {
                    users: [{
                        hasAppAccess: false,
                        userBasicFlags: 0,
                        realmDirectoryFlags: 0,
                        uid:0
                    }],
                    fetchAccountUsers: () => false
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(5);
                expect(cell.text()).toEqual("--");
            });

            it("should render app access and not denied/deactivated correctly", () => {
                let props = {
                    users: [{
                        hasAppAccess: true,
                        userBasicFlags: 0,
                        realmDirectoryFlags: 0,
                        uid:0
                    }],
                    fetchAccountUsers: () => false
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(5);
                expect(cell.text()).toEqual("Y");
            });

            it("should render app access and but denied correctly", () => {
                let props = {
                    users: [{
                        hasAppAccess: true,
                        userBasicFlags: 0,
                        realmDirectoryFlags: 8,
                        uid:0
                    }],
                    fetchAccountUsers: () => false
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(5);
                expect(cell.text()).toEqual("--");
            });

            it("should render app access and but deactivated correctly", () => {
                let props = {
                    users: [{
                        hasAppAccess: true,
                        userBasicFlags: 64,
                        realmDirectoryFlags: 0,
                        uid:0
                    }],
                    fetchAccountUsers: () => false
                };

                let component = mount(<AccountUsersGrid {...props} />);
                let cell = component.find(QbCell).at(5);
                expect(cell.text()).toEqual("--");
            });
        });
    });
});
