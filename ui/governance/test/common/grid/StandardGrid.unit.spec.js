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

    it('should render the grid', () => {
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

        let items = [{
            hasAppAccess: false,
            id: 99999,
            uid: 11111
        }];

        let StandardGridShallow = shallow(
            <StandardGrid
                columns={columns}
                getFacetFields={()=>{}}
                doUpdate={Actions.doUpdate}
                items={items}
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

        expect(StandardGridShallow.find('.qbGrid')).toBePresent();
        expect(StandardGridShallow.find('.noItemsExist')).not.toBePresent();
    });

    it('should not render the grid with no users (render the noItemsFound UI)', () => {
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

        let items = [];

        let StandardGridShallow = shallow(
            <StandardGrid
                columns={columns}
                getFacetFields={()=>{}}
                doUpdate={Actions.doUpdate}
                items={items}
                id={"accountUsers"}
                rowKey={"uid"}
            />
        );
        expect(StandardGridShallow).toBeDefined();
        expect(StandardGridShallow.length).toBeTruthy();

        let StandardGridToolbarComponent = StandardGridShallow.find(StandardGridToolBar);
        expect(StandardGridToolbarComponent).toBeDefined();

        expect(StandardGridShallow.find('.noItemsExist')).toBePresent();
        expect(StandardGridShallow.find('.qbGrid')).not.toBePresent();
    });
});


