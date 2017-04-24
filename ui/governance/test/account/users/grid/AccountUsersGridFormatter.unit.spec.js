import React from "react";
import jasmineEnzyme from "jasmine-enzyme";
import * as Formatters from "../../../../src/account/users/Grid/AccountUsersGridFormatters";

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

    it("should format the user status correctly", ()=> {
        expect(Formatters.FormatUserStatusText(true, basicUserInfo)).toEqual("Paid Seat");
        expect(Formatters.FormatUserStatusText(false, basicUserInfo)).toEqual("No App Access");
        expect(Formatters.FormatUserStatusText(true, {rowData:{...basicUserInfo.rowData, systemRights: 1}})).toEqual("QuickBase Staff");
        expect(Formatters.FormatUserStatusText(true, {rowData:{...basicUserInfo.rowData, realmDirectoryFlags: 8}})).toEqual("Denied");
        expect(Formatters.FormatUserStatusText(true, {rowData:{...basicUserInfo.rowData, userBasicFlags: 68}})).toEqual("Deactivated");
    });
});
