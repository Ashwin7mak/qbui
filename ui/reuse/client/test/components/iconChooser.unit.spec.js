import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import IconChooser from 'REUSE/components/iconChooser/iconChooser';

let component;

const mockParentFunctions = {
    onOpen() {},
    onClose() {},
    onSelect() {}
};

let icons = ['a', 'b', 'c', 'd', 'e'];

let fontName = 'someFont';

describe('IconChooser', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders closed icon chooser', () => {

        let selectedIcon = icons[0];

        component = mount(<IconChooser selectedIcon={selectedIcon}
                                        isOpen={false}
                                        onOpen={mockParentFunctions.onOpen}
                                        onClose={mockParentFunctions.onClose}
                                        font={fontName}
                                        icons={icons}
                                        onSelect={mockParentFunctions.onSelect} />);

        expect(component.find(".iconChooser.closed")).toBePresent();
        expect(component.find(`.iconChooser.closed .showAllToggle .qbIcon.${fontName}-${selectedIcon}`)).toBePresent();
    });

    it('toggles a closed icon chooser', () => {
        spyOn(mockParentFunctions, 'onOpen');

        let selectedIcon = icons[1];
        component = mount(<IconChooser selectedIcon={selectedIcon}
                                        isOpen={false}
                                        onOpen={mockParentFunctions.onOpen}
                                        onClose={mockParentFunctions.onClose}
                                        font={fontName}
                                        icons={icons}
                                        onSelect={mockParentFunctions.onSelect} />);

        let toggle = component.find(".iconChooser.closed .showAllToggle").at(0);
        toggle.simulate('click');
        expect(mockParentFunctions.onOpen).toHaveBeenCalled();

        mockParentFunctions.onOpen.calls.reset();
    });

    it('renders an expanded chooser, selects an icon', () => {
        spyOn(mockParentFunctions, 'onSelect');
        spyOn(mockParentFunctions, 'onClose');

        let selectedIcon = icons[0];
        component = mount(<IconChooser selectedIcon={selectedIcon}
                                        isOpen={true}
                                        onOpen={mockParentFunctions.onOpen}
                                        onClose={mockParentFunctions.onClose}
                                        font={fontName}
                                        icons={icons}
                                        onSelect={mockParentFunctions.onSelect} />);

        expect(component.find(".iconChooser.open")).toBePresent();

        let renderedIcons = component.find(".allIcons .qbIcon");

        expect(renderedIcons.length).toBe(icons.length);

        let selectIconIndex = 2;
        renderedIcons.at(selectIconIndex).simulate('click');

        expect(mockParentFunctions.onSelect).toHaveBeenCalledWith(icons[selectIconIndex]);
        expect(mockParentFunctions.onClose).toHaveBeenCalled();

        mockParentFunctions.onSelect.calls.reset();
        mockParentFunctions.onClose.calls.reset();
    });

    it('renders an expanded chooser, filters icons by icon name and tag', () => {

        let iconsForFiltering = [
            'person',
            'car',
            'truck',
            'project',
            'bus'
        ];

        let vehicleIcons = ['car', 'truck', 'bus'];
        let iconsByTag = [
            {
                tag: 'vehicle',
                icons: vehicleIcons
            }
        ];

        let selectedIcon = icons[0];
        component = mount(<IconChooser selectedIcon={selectedIcon}
                                        isOpen={true}
                                        onOpen={mockParentFunctions.onOpen}
                                        onClose={mockParentFunctions.onClose}
                                        font={fontName}
                                        icons={iconsForFiltering}
                                        iconsByTag={iconsByTag}
                                        classes="myClass"
                                        onSelect={mockParentFunctions.onSelect} />);

        expect(component.find(".iconChooser.open")).toBePresent();

        let renderedIcons = component.find(".allIcons .qbIcon");

        expect(renderedIcons.length).toBe(icons.length);

        let input = component.find("input").at(0);

        // filter without a match
        input.node.value = 'kdsfjlksdjf';
        input.simulate('change', input);

        renderedIcons = component.find(".allIcons .qbIcon");

        expect(renderedIcons.length).toBe(0);

        // filter on the person icon name
        input.node.value = 'person';
        input.simulate('change', input);

        renderedIcons = component.find(".allIcons .qbIcon");

        expect(renderedIcons.length).toBe(1);
        expect(component.find(`.allIcons .qbIcon.${fontName}-person`)).toBePresent();

        // filter on the vehicle tag
        input.node.value = 'veh';
        input.simulate('change', input);

        renderedIcons = component.find(".allIcons .qbIcon");

        expect(renderedIcons.length).toBe(vehicleIcons.length);

        vehicleIcons.forEach((vehicle) => {
            expect(component.find(`.allIcons .qbIcon.${fontName}-${vehicle}`)).toBePresent();
        });
    });
});
