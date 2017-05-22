import React from "react";
import jasmineEnzyme from "jasmine-enzyme";
import * as Formatters from "../../../../src/account/users/grid/AccountUsersGridFormatters";

describe('AccountUsersGridFormatter', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    let basicUserInfo = {
        rowData: {
            userBasicFlags: 0,
            realmDirectoryFlags: 0,
            systemRights: 0,
            accountTrusteeFlags: 0
        }
    };

    it("should format the access status correctly", ()=> {
        expect(Formatters.FormatAccessStatusText(true, basicUserInfo)).toEqual("Paid Seat");
        expect(Formatters.FormatAccessStatusText(false, basicUserInfo)).toEqual("No App Access");
        expect(Formatters.FormatAccessStatusText(true, {rowData:{...basicUserInfo.rowData, systemRights: 1}})).toEqual("Quick Base Staff");
        expect(Formatters.FormatAccessStatusText(true, {rowData:{...basicUserInfo.rowData, realmDirectoryFlags: 8}})).toEqual("Denied");
        expect(Formatters.FormatAccessStatusText(true, {rowData:{...basicUserInfo.rowData, userBasicFlags: 68}})).toEqual("Deactivated");
    });

    it("should format the user status correctly", ()=> {
        expect(Formatters.FormatUserStatusText(true, {rowData:{...basicUserInfo.rowData, realmDirectoryFlags: 0}})).toEqual("Unregistered");
        expect(Formatters.FormatUserStatusText(true, {rowData:{...basicUserInfo.rowData, realmDirectoryFlags: 5170}})).toEqual("Registered");
        expect(Formatters.FormatUserStatusText(true, {rowData:{...basicUserInfo.rowData, realmDirectoryFlags: 5138}})).toEqual("Unverified");
        expect(Formatters.FormatUserStatusText(true, {rowData:{...basicUserInfo.rowData, realmDirectoryFlags: 5122}})).toEqual("Unregistered");
    });

    it("should format the user name when the username is the same as the email correctly", ()=> {
        let username = "foo@foo.com",
            email = "foo@foo.com";
        let user = {
            rowData: {
                email: email,
                userName: username
            }
        };
        expect(Formatters.FormatUsernameString(username, user)).toEqual("");
    });

    it("should format the user name when the username is NOT the same as the email correctly", ()=> {

        let username = "foo@foo.com",
            email = "bar@bar.com";
        let user = {
            rowData: {
                email: email,
                userName: username
            }
        };
        expect(Formatters.FormatUsernameString(username, user)).toEqual(username);
    });
});
