import React from "react";
import {shallow} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import {StandardGrid} from "../../../src/common/grid/standardGrid";
import * as Actions from "../../../src/account/users/AccountUsersActions";
import * as FieldConsts from "../../../../client-react/src/constants/schema";
import StandardGridToolBar from "../../../src/common/grid/toolbar/StandardGridToolbar";

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
                getFacetFields={()=>{}}
                doUpdate={Actions.doUpdate}
                data={[]}
                id={"accountUsers"}
                rowKey={"uid"}
            />
        );
        expect(StandardGridShallow).toBeDefined();
        expect(StandardGridShallow.length).toBeTruthy();

        let StandardGridToolbarComponent = StandardGridShallow.find(StandardGridToolBar);
        expect(StandardGridToolbarComponent).toBeDefined();
        expect(StandardGridToolbarComponent.props().id).toEqual("accountUsers");
        expect(StandardGridToolbarComponent.props().doUpdate).toEqual(Actions.doUpdate);
    });
});


