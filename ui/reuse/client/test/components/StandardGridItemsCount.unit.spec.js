import React from "react";
import {shallow} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import StandardGridItemsCount from "../../../../reuse/client/src/components/itemsCount/StandardGridItemsCount";

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
        component = shallow(<StandardGridItemsCount totalItems={5} totalFilteredItems={5} itemTypePlural={"mockPlural"} itemTypeSingular={"mockSingular"} />);

        expect(component.find('.itemCount')).toHaveText('5 mockPlural');
        expect(component.find('.itemCount')).not.toHaveText('5 mockSingular');
    });

    it('renders the filtered items count when the filteredItemCount not equals itemCount', () => {
        component = shallow(<StandardGridItemsCount totalItems={5} totalFilteredItems={1} itemTypePlural={"mockPlural"} itemTypeSingular={"mockSingular"} />);

        expect(component.find('.itemCount')).toHaveText('1 of 5 mockSingular');
        expect(component.find('.itemCount')).not.toHaveText('1 of 5 mockPlural');
    });

    it('renders single item type value when item count is 1', () => {
        component = shallow(<StandardGridItemsCount totalItems={1} totalFilteredItems={1} itemTypePlural={"mockPlural"} itemTypeSingular={"mockSingular"} />);

        expect(component.find('.itemCount')).toHaveText('1 mockSingular');
        expect(component.find('.itemCount')).not.toHaveText('1 mockPlural');
    });

});
