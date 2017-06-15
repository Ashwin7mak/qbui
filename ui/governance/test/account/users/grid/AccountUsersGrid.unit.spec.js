import React from "react";
import {shallow} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import AccountUsersGrid from "GOVERNANCE/account/users/grid/AccountUsersGrid";
import {GetAccountUsersGridColumns} from "GOVERNANCE/account/users/grid/AccountUsersGridColumns";
import StandardGrid from "GOVERNANCE/common/grid/standardGrid";
import * as AccountUsersActions from "GOVERNANCE/account/users/AccountUsersActions";

describe('AccountUsersGrid', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    describe("Component", () => {

        const baseProps = {
            showAccountColumns: true,
            showRealmColumns: true,
            id: "accountUsers",
            users:[{'name': 'test'}]
        };

        it("should pass the correct props", ()=> {
            let component = shallow(<AccountUsersGrid {...baseProps} />);
            expect(component).toBeDefined();
            let standardGrid = component.find(StandardGrid);
            expect(standardGrid.props().id).toEqual("accountUsers");
            expect(standardGrid.props().rowKey).toEqual("uid");
            expect(standardGrid.props().doUpdate).toEqual(AccountUsersActions.doUpdateUsers);
            expect(standardGrid.props().columns).toEqual(GetAccountUsersGridColumns(baseProps.showAccountColumns, baseProps.showRealmColumns));
        });
    });
});
