import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {AppHomePageRoute}  from '../../../src/components/app/appHomePageRoute';
import HtmlUtils from '../../../src/utils/htmlUtils';
import {DEFAULT_PAGE_TITLE} from '../../../src/constants/urlConstants';

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
    const apps = [
        {id: 1, name: 'Washington'},
        {id: selectedAppId, name: selectedAppName},
        {id: 3, name: 'Jefferson'}
    ];

    beforeEach(() => {
        spyOn(HtmlUtils, 'updatePageTitle');
    });

    afterEach(() => {
        HtmlUtils.updatePageTitle.calls.reset();
    });

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<AppHomePageRoute {...props} selectedApp={selectedApp}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with url params', () => {

        let params = {
            appId:1
        };


        component = TestUtils.renderIntoDocument(<AppHomePageRoute {...props} match={{params}} selectedAppId={1} selectedApp={selectedApp}/>);
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
                return <AppHomePageRoute ref="ahp" match={{params:this.state.params}} selectedAppId={this.state.selectedAppId} {...props} selectedApp={selectedApp}/>;
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
            <AppHomePageRoute {...props} apps={apps} selectedAppId={selectedAppId} selectedApp={selectedApp}/>
        );

        expect(HtmlUtils.updatePageTitle).toHaveBeenCalledWith(`${selectedAppName} - ${DEFAULT_PAGE_TITLE}`);
    });

    describe('getSelectedAppName', () => {
        let nonExistingAppId = 4;

        let testCases = [
            {
                description: 'returns the name of the currently selected app',
                apps: apps,
                selectedAppId: selectedAppId,
                expectedName: selectedAppName
            },
            {
                description: 'returns null if the app does not exist',
                apps: apps,
                selectedAppId: nonExistingAppId,
                expectedName: null
            },
            {
                description: 'returns null if there are no apps',
                apps: [],
                selectedAppId: selectedAppId,
                expectedName: null
            },
            {
                description: 'returns null if apps is null',
                apps: null,
                selectedAppId: selectedAppId,
                expectedName: null
            },
            {
                description: 'returns null if there is not a currently selected app',
                apps: apps,
                selectedAppId: null,
                expectedName: null
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                component = TestUtils.renderIntoDocument(
                    <AppHomePageRoute {...props} selectedAppId={testCase.selectedAppId} selectedApp={selectedApp} apps={testCase.apps}/>
                );

                expect(component.getSelectedAppName()).toEqual(testCase.expectedName);
            });
        });
    });
});
