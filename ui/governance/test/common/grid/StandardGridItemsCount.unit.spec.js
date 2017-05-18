import React from "react";
import {shallow} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import StandardGridItemsCount from "../../../src/common/grid/toolbar/StandardGridItemsCount";

let component;

fdescribe('StandardGridItemsCount', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    fit('renders itemCount class name', () => {
        component = shallow(<StandardGridItemsCount />);

        expect(component.find('.itemCount')).toBePresent();
    });
});
