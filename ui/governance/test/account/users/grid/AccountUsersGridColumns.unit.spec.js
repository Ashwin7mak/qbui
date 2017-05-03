import React from "react";
import {mount} from "enzyme";
import moment from 'moment';
import jasmineEnzyme from "jasmine-enzyme";
import QbHeaderCell from "../../../../../client-react/src/components/dataTable/qbGrid/qbHeaderCell";
import QbCell from "../../../../../client-react/src/components/dataTable/qbGrid/qbCell";
import configureMockStore from "redux-mock-store";
import {Provider} from "react-redux";
import {StandardGrid} from "../../../../src/common/grid/standardGrid";
import * as Actions from "../../../../src/account/users/AccountUsersActions";
import {GetAccountUsersGridColumns} from "../../../../src/account/users/grid/AccountUsersGridColumns";


const mockStore = configureMockStore();

describe('AccountUsersGridColumns', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });
    const baseProps = {
        columns : GetAccountUsersGridColumns(true, true),
        data: [],
        rowKey: 'uid',
        id: 'accountUsers',
        columnTransformProps :[],
        columnTransformsClasses :[],
        doUpdate: Actions.doUpdate
    };

    describe("Permissions", () => {

        it("should show all the headers", ()=> {
            let props = {...baseProps,
                columns: GetAccountUsersGridColumns(true, true)};

            let component = mount(
                <Provider store={mockStore({Grids : 1})}>
                    <StandardGrid  {...props}/>
                </Provider>);
            let headers = component.find(QbHeaderCell).map(node => node.text());
            expect(headers).toEqual(["FIRST NAME", "LAST NAME", "EMAIL", "USER NAME", "LAST ACCESS", "QUICKBASE ACCESS STATUS", "INACTIVE?", "IN ANY GROUP?", "GROUP MANAGER?", "CAN CREATE APPS?", "APP MANAGER?", "IN REALM DIRECTORY?", "REALM APPROVED?"]);
        });

        it("should show the correct set of headers when not account admin", () => {
            let props = {
                ...baseProps,
                columns: GetAccountUsersGridColumns(false, true),
            };

            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);

            let headers = component.find(QbHeaderCell).map(node => node.text());
            expect(headers).toEqual(["FIRST NAME", "LAST NAME", "EMAIL", "USER NAME", "QUICKBASE ACCESS STATUS", "IN REALM DIRECTORY?", "REALM APPROVED?"]);
        });



        it("should show the correct set of headers when not a realm admin", ()=> {
            let props = {
                ...baseProps,
                columns: GetAccountUsersGridColumns(true, false),
            };

            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let headers = component.find(QbHeaderCell).map(node => node.text());
            expect(headers).toEqual(["FIRST NAME", "LAST NAME", "EMAIL", "USER NAME", "LAST ACCESS", "QUICKBASE ACCESS STATUS", "INACTIVE?", "IN ANY GROUP?", "GROUP MANAGER?", "CAN CREATE APPS?", "APP MANAGER?"]);
        });
    });



    describe("firstName", () => {
        it("should render properly", () => {
            let props = {
                ...baseProps,
                data: [{firstName: "Test", uid:0}],
            };

            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(0);
            expect(cell.text()).toEqual(props.data[0].firstName);
        });
    });

    describe("lastName", () => {
        it("should render properly", () => {
            let props = {
                ...baseProps,
                data: [{lastName: "Test", uid:0}],
            };

            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);


            let cell = component.find(QbCell).at(1);
            expect(cell.text()).toEqual(props.data[0].lastName);
        });
    });

    describe("email", () => {
        it("should render properly", () => {
            let props = {
                ...baseProps,
                data: [{email: "Test", uid:0}],
            };

            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);


            let cell = component.find(QbCell).at(2);
            expect(cell.text()).toEqual(props.data[0].email);
        });
    });

    describe("userName", () => {
        it("should render properly", () => {
            let props = {
                ...baseProps,
                data: [{userName: "Test", uid:0}],
            };

            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);


            let cell = component.find(QbCell).at(3);
            expect(cell.text()).toEqual(props.data[0].userName);
        });
    });

    describe("lastAccess", () => {
        it("should render null properly", () => {
            let props = {
                ...baseProps,
                data: [{lastAccess: "1900-01-01T00:00:00Z", uid:0}],
            };

            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(4);
            expect(cell.text()).toEqual("never");


        });

        it("should render properly", () => {
            let props = {
                ...baseProps,
                data: [{lastAccess: "2017-03-01T16:00:00Z", uid:0}],
            };


            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(4);
            expect(cell.text()).toEqual("March 1 2017");
        });
    });

    describe("quickbase access status", () => {
        it("should render no app access correctly", () => {
            let props = {
                ...baseProps,
                data: [{
                    hasAppAccess: false,
                    userBasicFlags: 4,
                    realmDirectoryFlags: 4,
                    systemRights: 0,
                    uid:0
                }],
            };


            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(5);
            expect(cell.text().trim()).toEqual("No App Access");
        });

        it("should show deactivated above all else", () => {
            let props = {
                ...baseProps,
                data: [{
                    hasAppAccess: true,
                    userBasicFlags: 64,
                    realmDirectoryFlags: 4,
                    systemRights: 2,
                    uid:0
                }],
            };


            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(5);
            expect(cell.text().trim()).toEqual("Deactivated");
        });

        it("should show denied above everything other than deactivated", () => {
            let props = {
                ...baseProps,
                data: [{
                    hasAppAccess: true,
                    userBasicFlags: 0,
                    realmDirectoryFlags: 8,
                    systemRights: 2,
                    uid:0
                }],
            };

            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(5);
            expect(cell.text().trim()).toEqual("Denied");
        });

        it("should quickbase staff above everything but denied and deactivated", () => {
            let props = {
                ...baseProps,
                data: [{
                    hasAppAccess: true,
                    userBasicFlags: 4,
                    realmDirectoryFlags: 4,
                    systemRights: 6,
                    uid:0
                }],
            };

            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(5);
            expect(cell.text().trim()).toEqual("QuickBase Staff");
        });

        it("should show paid seat if has access", () => {
            let props = {
                ...baseProps,
                data: [{
                    hasAppAccess: true,
                    userBasicFlags: 4,
                    realmDirectoryFlags: 4,
                    systemRights: 0,
                    uid:0
                }],
            };

            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(5);
            expect(cell.text().trim()).toEqual("Paid Seat");
        });
    });

    describe("Inactive?", () => {
        it("should render null properly", () => {
            let props = {
                ...baseProps,
                data: [{lastAccess: "1900-01-01T00:00:00Z", uid:0}],
            };

            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(6);
            expect(cell.text()).toEqual("--");
        });

        it("should render inactive properly", () => {
            let props = {
                ...baseProps,
                data: [{lastAccess: moment().subtract(181, 'days').toISOString(), uid:0}],
            };

            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(6);
            expect(cell.text()).toEqual("Y");
        });

        it("should render NOT inactive properly", () => {
            let props = {
                ...baseProps,
                data: [{lastAccess: moment().subtract(179, 'days').toISOString(), uid:0}],
            };

            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(6);
            expect(cell.text()).toEqual("--");
        });
    });

    describe("In Any Group?", () => {

        it("should render numGroupsMember correctly when a number", () => {
            let props = {
                ...baseProps,
                data: [{numGroupsMember: 1, uid:0}],
            };

            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(7);
            expect(cell.text()).toEqual("Y");
        });

        it("should render numGroupsMember correctly when 0", () => {
            let props = {
                ...baseProps,
                data: [{numGroupsMember: 0, uid:0}],
            };

            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(7);
            expect(cell.text()).toEqual("--");
        });
    });

    describe("Group manager?", () => {

        it("should render numGroupsManaged correctly when a number", () => {
            let props = {
                ...baseProps,
                data: [{numGroupsManaged: 1, uid:0}],
            };

            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(8);
            expect(cell.text()).toEqual("Y");
        });

        it("should render numGroupsManaged correctly when 0", () => {
            let props = {
                ...baseProps,
                data: [{numGroupsManaged: 0, uid:0}],
            };

            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(8);
            expect(cell.text()).toEqual("--");
        });
    });

    describe("Can create apps?", () => {

        it("should render can create apps correctly when user has flag", () => {
            let props = {
                ...baseProps,
                data: [{accountTrusteeFlags: 5, uid:0}],
            };

            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(9);
            expect(cell.text()).toEqual("Y");
        });

        it("should render can create apps correctly when user does NOT have flag", () => {
            let props = {
                ...baseProps,
                data: [{accountTrusteeFlags: 1, uid:0}],
            };


            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(9);
            expect(cell.text()).toEqual("--");
        });
    });

    describe("App Manager?", () => {

        it("should render no apps correctly", () => {
            let props = {
                ...baseProps,
                data: [{numAppsManaged: 0, uid:0}],
            };


            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(10);
            expect(cell.text()).toEqual("--");
        });

        it("should render some apps correctly", () => {
            let props = {
                ...baseProps,
                data: [{numAppsManaged: 1, uid:0}],
            };


            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(10);
            expect(cell.text()).toEqual("Y");
        });
    });

    describe("In Realm Directory?", () => {

        it("should render in realm directory correctly when 0", () => {
            let props = {
                ...baseProps,
                data: [{realmDirectoryFlags: 0, uid:0}],
            };


            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(11);
            expect(cell.text()).toEqual("--");
        });

        it("should render in realm directory correctly when has some flags", () => {
            let props = {
                ...baseProps,
                data: [{realmDirectoryFlags: 1, uid:0}],
            };


            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(11);
            expect(cell.text()).toEqual("Y");
        });
    });

    describe("Realm Approved?", () => {

        it("should render realm approved correctly when flag is set", () => {
            let props = {
                ...baseProps,
                data: [{realmDirectoryFlags: 5, uid:0}],
            };


            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(12);
            expect(cell.text()).toEqual("Y");
        });

        it("should render realm approved correctly when flag is not set", () => {
            let props = {
                ...baseProps,
                data: [{realmDirectoryFlags: 1, uid:0}],
            };


            let component = mount(
                <Provider store={mockStore({})}>
                    <StandardGrid {...props} />
                </Provider>);
            let cell = component.find(QbCell).at(12);
            expect(cell.text()).toEqual("--");
        });
    });
});
