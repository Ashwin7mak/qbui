import React from "react";
import {shallow} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import {StandardGrid} from "../../../src/common/grid/standardGrid";
import {QbCell} from '../../../../client-react/src/components/dataTable/qbGrid/qbCell';
import * as AccountUsersActions from "../../../src/account/users/AccountUsersActions";
import * as FieldConsts from "../../../../client-react/src/constants/schema";
import StandardGridToolBar from "../../../src/common/grid/toolbar/StandardGridToolbar";
import QBLoader from "../../../../reuse/client/src/components/loader/QBLoader";

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

describe('StandardGrid', () => {

    beforeEach(() => {
        jasmineEnzyme();
    });

    it('should render the grid', () => {

        let items = [{
            hasAppAccess: false,
            id: 99999,
            uid: 11111
        }];

        let component = shallow(<StandardGrid columns={columns}
                                              getFacetFields={()=>{}}
                                              doUpdate={AccountUsersActions.doUpdateUsers}
                                              items={items}
                                              id={"accountUsers"}
                                              rowKey={"uid"}
                                              cellRenderer={QbCell}
                                />);

        let StandardGridToolbarComponent = component.find(StandardGridToolBar);
        expect(StandardGridToolbarComponent).toBeDefined();
        expect(StandardGridToolbarComponent.props().id).toEqual("accountUsers");
        expect(StandardGridToolbarComponent.props().doUpdate).toEqual(AccountUsersActions.doUpdateUsers);

        expect(component.find('.qbGrid')).toBePresent();
        expect(component.find('.noItemsExist')).not.toBePresent();
    });

    it('should not render the grid header when items are being fetched', () => {

        let component = shallow(<StandardGrid columns={columns}
                                              getFacetFields={()=>{}}
                                              doUpdate={AccountUsersActions.doUpdate}
                                              items={null}
                                              id={"accountUsers"}
                                              rowKey={"uid"}
                                              cellRenderer={QbCell}
                                />);

        let StandardGridToolbarComponent = component.find(StandardGridToolBar);
        expect(StandardGridToolbarComponent).not.toBePresent();
    });

    it('should render the grid header when items are done fetching', () => {

        let component = shallow(<StandardGrid columns={columns}
                                              getFacetFields={()=>{}}
                                              doUpdate={AccountUsersActions.doUpdate}
                                              items={[]}
                                              id={"accountUsers"}
                                              rowKey={"uid"}
                                              cellRenderer={QbCell}
                                />);
        expect(component.find('.noItemsExist')).toBePresent();

        let StandardGridToolbarComponent = component.find(StandardGridToolBar);
        expect(StandardGridToolbarComponent).toBeDefined();
        expect(StandardGridToolbarComponent.props().id).toEqual("accountUsers");
        expect(StandardGridToolbarComponent.props().doUpdate).toEqual(AccountUsersActions.doUpdate);
    });

    it('should not render the grid when no items exist', () => {

        let component = shallow(<StandardGrid columns={columns}
                                              getFacetFields={()=>{}}
                                              doUpdate={AccountUsersActions.doUpdateUsers}
                                              items={[]}
                                              id={"accountUsers"}
                                              rowKey={"uid"}
                                              cellRenderer={QbCell}
                                />);

        let StandardGridToolbarComponent = component.find(StandardGridToolBar);
        expect(StandardGridToolbarComponent).toBeDefined();

        expect(component.find('.noItemsExist')).toBePresent();
        expect(component.find('.qbGrid')).not.toBePresent();
    });

    it('shows the loader when items is null', () => {

        let component = shallow(<StandardGrid columns={columns}
                                              getFacetFields={()=>{}}
                                              doUpdate={AccountUsersActions.doUpdateUsers}
                                              items={null}
                                              id={"accountUsers"}
                                              rowKey={"uid"}
                                              cellRenderer={QbCell}
                                />);

        let StandardGridToolbarComponent = component.find(StandardGridToolBar);
        expect(StandardGridToolbarComponent).not.toBePresent();

        expect(component.find('.noItemsExist')).not.toBePresent();
        expect(component.find('.qbGrid')).not.toBePresent();

        expect(component.find(QBLoader)).toBePresent();
        expect(component.find('.loading')).toBePresent();
    });
});


