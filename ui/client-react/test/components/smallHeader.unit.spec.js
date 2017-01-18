import React from 'react';
import TestUtils from 'react-addons-test-utils';
import SmallHeader from '../../src/components/header/smallHeader';
import SearchBox from '../../src/components/search/searchBox';

describe('SmallHeader functions', () => {
    'use strict';

    let component;
    let mockCallbacks = {};
    let mockShellActions = {
        toggleLeftNav: function() {}
    };

    beforeEach(() => {
        mockCallbacks = {
            dispatch: function(action) {}
        };
        spyOn(mockCallbacks, 'dispatch');
        spyOn(mockShellActions, 'toggleLeftNav');

        SmallHeader.__Rewire__('ShellActions', mockShellActions);
        component = TestUtils.renderIntoDocument(<SmallHeader dispatch={mockCallbacks.dispatch} title="test"/>);
    });

    afterEach(() => {
        mockCallbacks.dispatch.calls.reset();
        mockShellActions.toggleLeftNav.calls.reset();
        SmallHeader.__ResetDependency__('ShellActions');
    });

    it('test render of component', () => {
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test toggle nav', () => {
        let toggleNav = TestUtils.findRenderedDOMComponentWithClass(component, "toggleNavButton");
        TestUtils.Simulate.click(toggleNav);
        expect(mockCallbacks.dispatch).toHaveBeenCalled();
        expect(mockShellActions.toggleLeftNav).toHaveBeenCalled();
    });

    it('test title prop', () => {
        let title = TestUtils.scryRenderedDOMComponentsWithClass(component, "title");
        expect(title[0].innerHTML).toEqual("test");
    });
    it('test search renders', () => {
        let TestParent = React.createFactory(React.createClass({
            render() {
                return <SmallHeader ref="header"/>;
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
                return <SmallHeader ref="header"
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
