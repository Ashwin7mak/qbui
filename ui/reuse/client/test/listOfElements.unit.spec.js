import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import ListOfElements, {__RewireAPI__ as ListOfElementsRewireAPI} from 'REUSE/components/sideNavs/listOfElements';

const FieldTokenInMenuMock = React.createClass({
    render: function() {
        return (
            <div>{this.props.title}</div>
        );
    }
});

const testElements = [
    {
        key: 'group1',
        title: 'group1',
        children: [
            {key: 'element1', title: 'elementA1'},
            {key: 'element2', title: 'element2'}
        ]
    },
    {
        key: 'group2',
        title: 'group2',
        children: [
            {key: 'element3', title: 'elementA3'},
        ]
    },
    {key: 'ungroupedElement', title: 'ungroupedElement'},
];

// Mock this out so that no animations occur during a unit test.
const mockFlipMove = ({children, className}) => <ul className={className}>{children}</ul>;

const mockLocale = {
    getMessage(message) {return message;}
};

let component;

describe('ListOfElements', () => {
    beforeEach(() => {
        jasmineEnzyme();

        ListOfElementsRewireAPI.__Rewire__('Locale', mockLocale);
        ListOfElementsRewireAPI.__Rewire__('FlipMove', mockFlipMove);
    });

    afterEach(() => {
        ListOfElementsRewireAPI.__ResetDependency__('Locale');
        ListOfElementsRewireAPI.__ResetDependency__('FlipMove');
    });

    it('displays groups of fields', () => {
        component = mount(<ListOfElements renderer={FieldTokenInMenuMock} elements={testElements}/>);

        const headers = component.find('.listOfElementsItemHeader');
        expect(headers.length).toEqual(testElements.length - 1); // Subtract one to account for single ungrouped element
        expect(headers.at(0)).toHaveText(testElements[0].title);
        expect(headers.at(1)).toHaveText(testElements[1].title);
    });

    it('does not display titles for a group of fields', () => {
        component = mount(<ListOfElements hideTitle={true} renderer={FieldTokenInMenuMock} elements={testElements}/>);

        const headers = component.find('.listOfElementsItemHeader');
        expect(headers.length).toEqual(0); // Subtract one to account for single ungrouped element
    });

    it('displays an un-grouped element', () => {
        component = mount(<ListOfElements renderer={FieldTokenInMenuMock} elements={testElements}/>);

        const unGroupedElement = component.find('.listOfElementsMainList > .listOfElementsItem');

        expect(unGroupedElement).toBePresent();
        expect(unGroupedElement).toHaveText(testElements[2].title);
    });

    it('displays grouped child elements', () => {
        component = mount(<ListOfElements renderer={FieldTokenInMenuMock} elements={testElements}/>);

        const groupedElements = component.find('.listOfElementsItemList .listOfElementsItem');

        expect(groupedElements.length).toEqual(3);
        expect(groupedElements.at(0)).toHaveText(testElements[0].children[0].title);
        expect(groupedElements.at(1)).toHaveText(testElements[0].children[1].title);
        expect(groupedElements.at(2)).toHaveText(testElements[1].children[0].title);
    });

    describe('filtering elements', () => {
        it('filters elements based on the filter text', () => {
            component = mount(<ListOfElements renderer={FieldTokenInMenuMock} elements={testElements}/>);

            component.setState({activeFieldFilter: 'elementa'});

            expect(component.find('.listOfElementsItem').length).toEqual(2);
            expect(component.find('.animatedListOfElementsItemList').length).toEqual(0);
            expect(component.find('.emptySearchResult')).not.toBePresent();
        });

        it('will animate children if animateChildren is set to true', () => {
            component = mount(<ListOfElements animateChildren={true} renderer={FieldTokenInMenuMock}
                                              elements={testElements}/>);

            expect(component.find('.listOfElementsItemList').length).toEqual(0);
            expect(component.find('.animatedListOfElementsItemList').length).toEqual(2);
        });

        it('shows a message if no fields match the filter text', () => {
            component = mount(<ListOfElements renderer={FieldTokenInMenuMock} elements={testElements}/>);

            component.setState({activeFieldFilter: 'zzz'});

            expect(component.find('.emptySearchResult')).toBePresent();
            expect(component.find('.listOfElementsItem')).not.toBePresent();
        });

        describe('Empty state Message', () => {
            it('doesn\'t display an empty message when elements and emptyMessage are not defined', () => {
                component = mount(<ListOfElements renderer={FieldTokenInMenuMock}/>);

                expect(component.find('.listOfElementsItem').length).toEqual(0);
                expect(component.find('.emptyStateMessage')).toBePresent();
                expect(component.find('.emptyStateMessage').text()).toEqual("");
            });

            it('returns empty message when elements are not defined', () => {
                component = mount(<ListOfElements renderer={FieldTokenInMenuMock} emptyMessage="MockemptyMessage"/>);

                expect(component.find('.listOfElementsItem').length).toEqual(0);
                expect(component.find('.emptyStateMessage')).toBePresent();
                expect(component.find('.emptyStateMessage').text()).toEqual("MockemptyMessage");
            });

            it('returns empty message when elements are not present', () => {
                component = mount(<ListOfElements renderer={FieldTokenInMenuMock} elements={[]}
                                                  emptyMessage="MockemptyMessage"/>);

                expect(component.find('.listOfElementsItem').length).toEqual(0);
                expect(component.find('.emptyStateMessage')).toBePresent();
                expect(component.find('.emptyStateMessage').text()).toEqual("MockemptyMessage");
            });

            it('doesn\'t return empty message when elements are present', () => {
                component = mount(<ListOfElements renderer={FieldTokenInMenuMock} elements={testElements}
                                                  emptyMessage="MockemptyMessage"/>);

                expect(component.find('.listOfElementsItem').length).toEqual(4);
                expect(component.find('.emptyStateMessage')).not.toBePresent();
            });
        });
    });
});
