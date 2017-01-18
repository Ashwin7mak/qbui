import React from 'react';
import TestUtils from 'react-addons-test-utils';
import SmallHeader from '../../src/components/header/smallHeader';
import SearchBox from '../../src/components/search/searchBox';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {Provider} from "react-redux";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

import * as types from '../../src/actions/types';

describe('SmallHeader functions', () => {
    'use strict';

    it('test render of component', () => {
        const initialState = {};
        const store = mockStore(initialState);
        let component = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <SmallHeader title="test"/>
            </Provider>
        );

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test toggle nav action is called', () => {
        const initialState = {};
        const store = mockStore(initialState);
        let component = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <SmallHeader title="test"/>
            </Provider>
        );

        let toggleNav = TestUtils.findRenderedDOMComponentWithClass(component, "toggleNavButton");
        TestUtils.Simulate.click(toggleNav);

        const actions = store.getActions();
        expect(actions[0].type).toEqual(types.TOGGLE_LEFT_NAV_EXPANDED);
    });

    it('test title prop', () => {
        const initialState = {};
        const store = mockStore(initialState);
        let component = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <SmallHeader title="test"/>
            </Provider>
        );

        let title = TestUtils.scryRenderedDOMComponentsWithClass(component, "title");
        expect(title[0].innerHTML).toEqual("test");
    });

    it('test search renders', () => {
        const initialState = {};
        const store = mockStore(initialState);
        let TestParent = React.createFactory(React.createClass({
            render() {
                return <Provider store={store}><SmallHeader ref="header"/></Provider>;
            }
        }));

        let parent = TestUtils.renderIntoDocument(TestParent());
        let header = TestUtils.scryRenderedComponentsWithType(parent.refs.header, SmallHeader);
        let searchBox = TestUtils.scryRenderedComponentsWithType(header[0], SearchBox);
        expect(searchBox.length).toEqual(1);
    });

    it('test search props', () => {
        const initialState = {};
        const store = mockStore(initialState);
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
                return <Provider store={store}>
                        <SmallHeader ref="header"
                                     enableSearch={true}
                                     onSearchChange={this.handleSearchChange}
                                     onClearSearch={this.clearSearchString}
                                     searchPlaceHolder="placeholderString"
                                     searchValue="test"/>
                       </Provider>;
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
