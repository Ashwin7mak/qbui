import React from 'react';
import {mount, shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import IconChooser, {__RewireAPI__ as IconChooserCutsRewireAPI} from 'REUSE/components/iconChooser/iconChooser';

let component;

const mockParentFunctions = {
    onOpen() {},
    onClose() {},
    setIconChoice() {},
    getIcon() {}
};

let icons = ['a', 'b', 'c', 'd', 'e'];
let instance;

let fontName = 'someFont';

const mockLocale = {
    locale: {getMessage() {}}
};

describe('IconChooser', () => {
    beforeEach(() => {
        jasmineEnzyme();
        IconChooserCutsRewireAPI.__Rewire__('I18nMessage', ({message}) => <div className="mockMessage">{message}</div>);
        IconChooserCutsRewireAPI.__Rewire__('Locale', mockLocale.locale);
    });

    afterEach(() => {
        IconChooserCutsRewireAPI.__ResetDependency__('I18nMessage');
        IconChooserCutsRewireAPI.__ResetDependency__('Locale');
    });

    it('renders closed icon chooser', () => {

        let selectedIcon = icons[0];

        component = mount(<IconChooser selectedIcon={selectedIcon}
                                       isOpen={false}
                                       onOpen={mockParentFunctions.onOpen}
                                       onClose={mockParentFunctions.onClose}
                                       font={fontName}
                                       listOfIconsByNames={icons}
                                       setIconChoice={mockParentFunctions.setIconChoice} />);

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
                                       listOfIconsByNames={icons}
                                       setIconChoice={mockParentFunctions.setIconChoice} />);

        let toggle = component.find(".iconChooser.closed .showAllToggle").at(0);
        toggle.simulate('click');
        expect(mockParentFunctions.onOpen).toHaveBeenCalled();

        mockParentFunctions.onOpen.calls.reset();
    });

    it('renders an expanded chooser, selects an icon', () => {
        spyOn(mockParentFunctions, 'setIconChoice');
        spyOn(mockParentFunctions, 'onClose');

        let selectedIcon = icons[0];
        component = mount(<IconChooser selectedIcon={selectedIcon}
                                         isOpen={true}
                                         onOpen={mockParentFunctions.onOpen}
                                         onClose={mockParentFunctions.onClose}
                                         font={fontName}
                                         listOfIconsByNames={icons}
                                         setIconChoice={mockParentFunctions.setIconChoice} />);

        expect(component.find(".iconChooser.open")).toBePresent();

        let renderedIcons = component.find(".allIcons .qbIcon");

        expect(renderedIcons.length).toBe(icons.length);

        let selectIconIndex = 2;
        renderedIcons.at(selectIconIndex).simulate('click');

        expect(mockParentFunctions.setIconChoice).toHaveBeenCalledWith(icons[selectIconIndex]);
        expect(mockParentFunctions.onClose).toHaveBeenCalled();

        mockParentFunctions.setIconChoice.calls.reset();
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
                                         listOfIconsByNames={iconsForFiltering}
                                         listOfIconsByTagNames={iconsByTag}
                                         classes="myClass"
                                         setIconChoice={mockParentFunctions.setIconChoice} />);

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

    describe('getSuggestedIcons', () => {
        it('will typeForSuggestionsText if name is an empty string', () => {
            component = mount(<IconChooser name=""
                                             listOfIconsByNames={[]}
                                             listOfIconsByTagNames={[]}
                                             typeForSuggestionsText="mockTypeForSuggestionsText"
                                             noSuggestedIconsText="mockNoSuggestedIconsText"/>);

            instance = component.instance();
            spyOn(instance, 'getIcon');
            instance.getSuggestedIcons();

            expect(component.find('.noSuggestedIcons .iconList')).toBePresent();
            expect(component.find('.noSuggestedIcons .iconList')).toIncludeText("mockTypeForSuggestionsText");
            expect(component.find('.noSuggestedIcons .iconList')).not.toIncludeText("mockNoSuggestedIconsText");
            expect(instance.getIcon).not.toHaveBeenCalled();
        });

        it('will render mockNoSuggestedIconsText if a user search does not match an icon in the listOfIconsByNames', () => {
            component = mount(<IconChooser name="mockName"
                                           listOfIconsByNames={[]}
                                           listOfIconsByTagNames={[]}
                                           typeForSuggestionsText="mockTypeForSuggestionsText"
                                           noSuggestedIconsText="mockNoSuggestedIconsText"/>);

            instance = component.instance();
            spyOn(instance, 'getIcon');
            instance.getSuggestedIcons();

            expect(component.find('.noSuggestedIcons .iconList')).toBePresent();
            expect(component.find('.noSuggestedIcons .iconList')).toIncludeText("mockNoSuggestedIconsText");
            expect(component.find('.noSuggestedIcons .iconList')).not.toIncludeText("mockTypeForSuggestionsText");
            expect(instance.getIcon).not.toHaveBeenCalled();
        });

        it('will invoke getIcon if a user search matches an icon in the listOfIconsByNames', () => {
            let dragonIcon = 'dragon';
            component = mount(<IconChooser name={dragonIcon}
                                           listOfIconsByNames={[dragonIcon]}
                                           listOfIconsByTagNames={[]}
                                           typeForSuggestionsText="mockTypeForSuggestionsText"
                                           noSuggestedIconsText="mockNoSuggestedIconsText"/>);

            instance = component.instance();
            spyOn(instance, 'getIcon');
            instance.getSuggestedIcons();

            expect(component.find('.noSuggestedIcons .iconList')).not.toBePresent();
            expect(component.find('.iconList')).toBePresent();
            expect(instance.getIcon).toHaveBeenCalledWith(dragonIcon);
        });

        it('will invoke selectIconDoNotToggle when the icon is clicked on', () => {
            let dragonIcon = 'dragon';
            component = mount(<IconChooser name={dragonIcon}
                                           listOfIconsByNames={[dragonIcon]}
                                           listOfIconsByTagNames={[]}
                                           typeForSuggestionsText="mockTypeForSuggestionsText"
                                           noSuggestedIconsText="mockNoSuggestedIconsText"/>);

            instance = component.instance();
            spyOn(instance, 'getIcon');
            spyOn(instance, 'selectIconDoNotToggle');
            instance.getSuggestedIcons();

            let iconList = component.find('.iconList button');
            iconList.simulate('click');

            expect(component.find('.noSuggestedIcons .iconList')).not.toBePresent();
            expect(instance.selectIconDoNotToggle).toHaveBeenCalledWith(dragonIcon);
            expect(instance.getIcon).toHaveBeenCalledWith(dragonIcon);
        });
    });
});
