import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Fluxxor from 'fluxxor';
import SmallHeader from '../../src/components/header/smallHeader';
import SearchBox from '../../src/components/search/searchBox';

describe('SmallHeader functions', () => {
    'use strict';

    let component;
    let navStore = Fluxxor.createStore({
        getState() {
            return {};
        }
    });
    let stores = {
        NavStore: new navStore()
    };

    let flux = new Fluxxor.Flux(stores);
    flux.actions = {
        toggleLeftNav() {
            return;
        }
    };

    beforeEach(() => {
        spyOn(flux.actions, 'toggleLeftNav');
    });

    afterEach(() => {
        flux.actions.toggleLeftNav.calls.reset();
    });

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<SmallHeader flux={flux}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test toggle nav', () => {
        let toggleNav = TestUtils.findRenderedDOMComponentWithClass(component, "toggleNavButton");
        TestUtils.Simulate.click(toggleNav);
        expect(flux.actions.toggleLeftNav).toHaveBeenCalled();
    });

    it('test title prop', () => {
        component = TestUtils.renderIntoDocument(<SmallHeader flux={flux} title="test"/>);

        let title = TestUtils.scryRenderedDOMComponentsWithClass(component, "title");
        expect(title[0].innerHTML).toEqual("test");
    });
    it('test search renders', () => {
        let TestParent = React.createFactory(React.createClass({
            render() {
                return <SmallHeader ref="header" flux={flux} />;
            }
        }));
        let parent = TestUtils.renderIntoDocument(TestParent());
        let header = TestUtils.scryRenderedComponentsWithType(parent.refs.header, SmallHeader);
        let searchBox = TestUtils.scryRenderedComponentsWithType(header[0], SearchBox);
        expect(searchBox.length).toEqual(1);
    });
    it('test search props', () => {
        let TestParent = React.createFactory(React.createClass({
            getInitialState() {
                return {
                    counter: 1
                };
            },
            handleSearchChange() {
                this.setState({counter: 2});
            },
            clearSearchString() {
                this.setState({counter: 3});
            },
            render() {
                return <SmallHeader ref="header" flux={flux}
                                    enableSearch={true}
                                    onSearchChange={this.handleSearchChange}
                                    onClearSearch={this.clearSearchString}
                                    searchPlaceHolder="placeholderString"
                                    searchValue="test"/>;
            }
        }));
        let parent = TestUtils.renderIntoDocument(TestParent());
        let header = TestUtils.scryRenderedComponentsWithType(parent.refs.header, SmallHeader);
        let searchBox = TestUtils.scryRenderedComponentsWithType(header[0], SearchBox);
        let searchInput = TestUtils.scryRenderedDOMComponentsWithTag(searchBox[0], 'input');
        expect(searchInput.length).toEqual(1);
        searchInput = searchInput[0];
        expect(searchInput.value).toEqual("test");
        expect(searchInput.placeholder).toEqual("placeholderString");
        searchInput.value = "new";
        TestUtils.Simulate.change(searchInput);
        expect(parent.state.counter).toEqual(2);
        let clearButton = TestUtils.scryRenderedDOMComponentsWithClass(searchBox[0], 'clearSearch');
        expect(clearButton.length).toEqual(1);
        TestUtils.Simulate.click(clearButton[0]);
        expect(parent.state.counter).toEqual(3);
    });
});
