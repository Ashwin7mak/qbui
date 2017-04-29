import React from "react";
import {mount, shallow} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import * as Actions from "../../../src/account/users/AccountUsersActions";
import {StandardGridToolBar} from "../../../src/common/grid/toolbar/StandardGridToolbar";
import {StandardGridNavigation} from "../../../src/common/grid/toolbar/StandardGridNavigation";
import IconInputBox from "../../../../reuse/client/src/components/iconInputBox/iconInputBox";
import {Provider} from "react-redux";
import configureMockStore from "redux-mock-store";

describe('StandardGridToolBar', () => {

    beforeEach(() => {
        jasmineEnzyme();
    });

    it('should render with navigation component and search component', () => {

        // let component = mount(
        //     <Provider store={store}>
        //         <StandardGridToolBar {...baseProps} />
        //     </Provider>);
        //
        // let StandardGridToolBarShallow = shallow(
        //     <StandardGridToolBar
        //         doUpdate={Actions.doUpdate}
        //         id={"accountUsers"}
        //         rowKey={"uid"}
        //     />
        // );
        // expect(StandardGridToolBarShallow).toBeDefined();
        // expect(StandardGridToolBarShallow.length).toBeTruthy();

        // let StandardGridNavigationComponent = StandardGridToolBarShallow.find(StandardGridNavigation);
        // expect(StandardGridNavigationComponent).toBeDefined();
        // expect(StandardGridNavigationComponent.length).toBeTruthy();
        // expect(StandardGridNavigationComponent.props().id).toEqual("accountUsers");
        // let StandardGridSearchComponent = StandardGridToolBarShallow.find(IconInputBox);
        // expect(StandardGridToolBarShallow.debug()).toEqual("sf");
        // expect(StandardGridSearchComponent).toBeDefined();
        // expect(StandardGridSearchComponent.length).toBeTruthy();
        // expect(StandardGridSearchComponent.props().placeholder).toEqual("Search users");
        // expect(StandardGridSearchComponent.props().onChange).toEqual(Actions.doUpdate);

    });
});


