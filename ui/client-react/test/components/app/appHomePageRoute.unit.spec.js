import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ConnectedAppHomePage, {AppHomePageRoute}  from '../../../src/components/app/appHomePageRoute';
import HtmlUtils from '../../../src/utils/htmlUtils';
import {DEFAULT_PAGE_TITLE} from '../../../src/constants/urlConstants';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

//TODO this is a placeholder file to add tests as app home page gets built out

describe('AppHomePageRoute functions', () => {
    'use strict';

    let component;

    const props = {
        showTopNav: () => {}
    };
    const selectedAppId = 2;
    const selectedAppName = 'Adams';
    const selectedApp = {name: selectedAppName};

    beforeEach(() => {
        spyOn(HtmlUtils, 'updatePageTitle');
    });

    afterEach(() => {
        HtmlUtils.updatePageTitle.calls.reset();
    });

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<AppHomePageRoute {...props} app={selectedApp}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with url params', () => {

        let params = {
            appId:1
        };


        component = TestUtils.renderIntoDocument(<AppHomePageRoute {...props} match={{params}} app={selectedApp}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test url changes ', () => {

        var TestParent = React.createFactory(React.createClass({
            getInitialState() {
                let params = {
                    appId: 1
                };

                return {params, selectedAppId: 1};
            },
            render() {
                return <AppHomePageRoute ref="ahp" match={{params: this.state.params}} {...props} app={selectedApp}/>;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());
        expect(TestUtils.isCompositeComponent(parent.refs.ahp)).toBeTruthy();

        // change params
        parent.setState({params: {appId:2}});
        expect(TestUtils.isCompositeComponent(parent.refs.ahp)).toBeTruthy();

        // change params to match current props
        parent.setState({params: {appId:1}, selectedAppId: 3});
        expect(TestUtils.isCompositeComponent(parent.refs.ahp)).toBeTruthy();

        // change params to match current props
        parent.setState({params: {appId:1}});
        expect(TestUtils.isCompositeComponent(parent.refs.ahp)).toBeTruthy();
    });

    it('sets the page title to the currently selected app', () => {
        component = TestUtils.renderIntoDocument(
            <AppHomePageRoute {...props} app={selectedApp}/>
        );

        expect(HtmlUtils.updatePageTitle).toHaveBeenCalledWith(`${selectedAppName} - ${DEFAULT_PAGE_TITLE}`);
    });

    it('shows a loader if the app is not loaded yet', () => {
        component = TestUtils.renderIntoDocument(<AppHomePageRoute {...props} isLoading={true} />);

        expect(TestUtils.findRenderedDOMComponentWithClass(component, 'loader')).not.toBeNull();
    });

    it('shows an error message if the app does not exist', () => {
        component = TestUtils.renderIntoDocument(<AppHomePageRoute {...props} isLoading={false} app={null} />);

        expect(TestUtils.findRenderedDOMComponentWithClass(component, 'alertBanner')).not.toBeNull();
    });

    it('loads props from the store', () => {
        const appName = 'test';
        const currentState = {
            tableProperties: {},
            app: {
                app: {name: appName, id: 1},
                isLoading: false
            }
        };

        const currentRouteParams = {params: {appId: 1}};

        component = TestUtils.renderIntoDocument(
            <Provider store={mockStore(currentState)}>
                <ConnectedAppHomePage {...props} match={currentRouteParams} />
            </Provider>
        );

        let headline = TestUtils.findRenderedDOMComponentWithClass(component, 'appHeadLine');
        expect(headline.textContent).toContain(appName);

        // Loading spinner should not be present when the app is loaded
        expect(TestUtils.scryRenderedDOMComponentsWithClass(component, 'loader').length).toEqual(0);
    });

    describe('getSelectedAppName', () => {
        let testCases = [
            {
                description: 'returns the name of the currently selected app',
                app: selectedApp,
                expectedName: selectedAppName
            },
            {
                description: 'returns null if there is not a currently selected app',
                app: null,
                expectedName: null
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                component = TestUtils.renderIntoDocument(
                    <AppHomePageRoute {...props} app={testCase.app} />
                );

                expect(component.getSelectedAppName()).toEqual(testCase.expectedName);
            });
        });
    });
});
