import React from "react";
import {mount, shallow} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import {GovernanceLeftNav} from "../../../src/common/leftNav/GovernanceLeftNav";
import GovernanceBundleLoader from "../../../src/locales/governanceBundleLoader";

describe('<GovernanceLeftNav />', () => {
    beforeEach(() => {
        jasmineEnzyme();
        GovernanceBundleLoader.changeLocale('en-us');
    });

    afterEach(() => {
        GovernanceBundleLoader.changeLocale('en-us');
    });

    const baseProps = {
        fetchData: () => false,
        isNavOpen: false,
        isNavCollapsed: false,
        isLoading: false,
        accountId: 1,
    };

    it("should should call fetch on mount", ()=> {
        let props = {
            ...baseProps
        };

        spyOn(props, 'fetchData');
        mount(<GovernanceLeftNav {...props} />);
        expect(props.fetchData.calls.any()).toEqual(true);
    });

    it("should propagate necessary props to StandardLeftNav", ()=> {
        let props = {
            ...baseProps,
            isLoading: true,
            isNavOpen: true,
            isNavCollapsed: true,
        };
        let component = shallow(<GovernanceLeftNav {...props} />);
        let childComponent = component.find('StandardLeftNav');
        expect(childComponent.props().showLoadingIndicator).toEqual(props.isLoading);
        expect(childComponent.props().isCollapsed).toEqual(props.isNavCollapsed);
        expect(childComponent.props().isOpen).toEqual(props.isNavOpen);
    });
});
