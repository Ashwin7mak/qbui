import React from "react";
import {shallow} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import {StandardGrid} from "../../../src/common/grid/standardGrid";
import * as AccountUsersActions from "../../../src/account/users/AccountUsersActions";
import * as FieldConsts from "../../../../client-react/src/constants/schema";
import StandardGridToolBar from "../../../src/common/grid/toolbar/StandardGridToolbar";
import * as Table from 'reactabular-table';

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
                doUpdate={AccountUsersActions.doUpdateUsers}
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
        expect(StandardGridToolbarComponent.props().doUpdate).toEqual(AccountUsersActions.doUpdateUsers);

        expect(StandardGridShallow.find('.qbGrid')).toBePresent();
        expect(StandardGridShallow.find('.noItemsExist')).not.toBePresent();
    });

    it('should not render the grid header when items are being fetched', () => {
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
                items={null}
                id={"accountUsers"}
                rowKey={"uid"}
            />
        );
        expect(StandardGridShallow).toBeDefined();
        expect(StandardGridShallow.length).toBeTruthy();
        let TableBody = StandardGridShallow.find(Table.Body);
        expect(TableBody).toHaveProp('rows', []);


        let StandardGridToolbarComponent = StandardGridShallow.find(StandardGridToolBar);
        expect(StandardGridToolbarComponent).toBeDefined();
        expect(StandardGridToolbarComponent.props().id).toEqual("accountUsers");
        expect(StandardGridToolbarComponent.props().doUpdate).toEqual(Actions.doUpdate);

    });

    it('should render the grid header when items are done fetching', () => {
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
                items={[]}
                id={"accountUsers"}
                rowKey={"uid"}
            />
        );
        expect(StandardGridShallow).toBeDefined();
        expect(StandardGridShallow.length).toBeTruthy();
        expect(StandardGridShallow.find('.noItemsExist')).toBePresent();

        let StandardGridToolbarComponent = StandardGridShallow.find(StandardGridToolBar);
        expect(StandardGridToolbarComponent).toBeDefined();
        expect(StandardGridToolbarComponent.props().id).toEqual("accountUsers");
        expect(StandardGridToolbarComponent.props().doUpdate).toEqual(Actions.doUpdate);

    });

    it('should not render the grid when no items exist', () => {
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
                doUpdate={AccountUsersActions.doUpdateUsers}
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


