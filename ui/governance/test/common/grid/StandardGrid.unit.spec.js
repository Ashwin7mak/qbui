import React from "react";
import {shallow} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import {StandardGrid} from "../../../src/common/grid/standardGrid";
import * as Actions from "../../../src/account/users/AccountUsersActions";
import * as FieldConsts from '../../../../client-react/src/constants/schema';

describe('StandardGrid', () => {

    beforeEach(() => {
        jasmineEnzyme();
    });

    it('should render', () => {
        let columns = [{
            property: 'firstName',
            header: {
                label: 'First Name'
            },
            fieldDef: {
                id: 1,
                datatypeAttributes: {
                    type: FieldConsts.TEXT
                }
            }
        }];
        let StandardGridShallow = shallow(
            <StandardGrid
                columns={columns}
                doUpdate={Actions.doUpdate}
                data={[]}
                id={"accountUsers"}
                rowKey={"uid"}
            />
        );
        expect(StandardGridShallow).toBeDefined();
        expect(StandardGridShallow.length).toBeTruthy();
    });
});


