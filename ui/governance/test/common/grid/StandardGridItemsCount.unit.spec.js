import React from "react";
import {shallow} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import StandardGridItemsCount from "../../../src/common/grid/toolbar/StandardGridItemsCount";

let component;

describe('StandardGridItemsCount', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders itemCount class name', () => {
        component = shallow(<StandardGridItemsCount />);

        expect(component.find('.itemCount')).toBePresent();
    });

    it('renders the total items count when the filteredItemCount equals itemCount', () => {
        component = shallow(<StandardGridItemsCount itemCount={5} filteredItemCount={5} itemTypePlural={"mockPlural"} itemTypeSingular={"mockSingular"} />);

        expect(component.find('.itemCount')).toHaveText('5 mockPlural');
        expect(component.find('.itemCount')).not.toHaveText('5 mockSingular');
    });

    it('renders the filtered items count when the filteredItemCount not equals itemCount', () => {
        component = shallow(<StandardGridItemsCount itemCount={5} filteredItemCount={1} itemTypePlural={"mockPlural"} itemTypeSingular={"mockSingular"} />);

        expect(component.find('.itemCount')).toHaveText('1 of 5 mockPlural');
        expect(component.find('.itemCount')).not.toHaveText('1 of 5 mockSingular');
    });

    it('renders single item type value when item count is 1', () => {
        component = shallow(<StandardGridItemsCount itemCount={1} filteredItemCount={1} itemTypePlural={"mockPlural"} itemTypeSingular={"mockSingular"} />);

        expect(component.find('.itemCount')).toHaveText('1 mockSingular');
        expect(component.find('.itemCount')).not.toHaveText('1 mockPlural');
    });

});
