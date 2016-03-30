import React from 'react';
import TestUtils from 'react-addons-test-utils';
import AppHomePageRoute  from '../../src/components/app/appHomePageRoute';

//TODO this is a placeholder file to add tests as app home page gets built out

describe('AppHomePageRoute functions', () => {
    'use strict';

    let component;
    let flux = {
        actions:{
            selectAppId: function() {return;},
            showTopNav: function() {return;},
            setTopTitle: function() {return;}
        }
    };

    beforeEach(() => {
        spyOn(flux.actions, 'selectAppId');
    });

    afterEach(() => {
        flux.actions.selectAppId.calls.reset();
    });

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<AppHomePageRoute flux={flux}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with url params', () => {

        let params = {
            appId:1
        };


        component = TestUtils.renderIntoDocument(<AppHomePageRoute params={params} selectedAppId={1} flux={flux}/>);
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
                return <AppHomePageRoute ref="ahp" params={this.state.params} selectedAppId={this.state.selectedAppId} flux={flux} />;
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

});
