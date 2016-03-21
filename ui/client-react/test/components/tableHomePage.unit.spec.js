import React from 'react';
import TestUtils from 'react-addons-test-utils';
import TableHomePage  from '../../src/components/table/tableHomePageRoute';

//TODO this is a placeholder file to add tests as table home page gets built out

describe('TableHomePage functions', () => {
    'use strict';

    let component;
    let flux = {
        actions:{
            selectTableId: function() {return;},
            loadReports: function() {return;},
            showTopNav: function() {return;}
        }
    };

    beforeEach(() => {
        spyOn(flux.actions, 'loadReports');
        spyOn(flux.actions, 'selectTableId');
    });

    afterEach(() => {
        flux.actions.loadReports.calls.reset();
        flux.actions.selectTableId.calls.reset();
    });

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<TableHomePage flux={flux}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with url params', () => {

        let params = {
            appId:1,
            tblId:2
        };

        let oldProps = {
            reportData: {
                appId: 0,
                tblId: 0
            }
        };
        component = TestUtils.renderIntoDocument(<TableHomePage params={params} {...oldProps} flux={flux}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test url changes ', () => {

        var TestParent = React.createFactory(React.createClass({
            getInitialState() {
                let params = {
                    appId:1,
                    tblId:1
                };
                let reportData = {
                    appId: 1,
                    tblId: 1
                };
                return {params, reportData};
            },
            render() {
                return <TableHomePage ref="thp" params={this.state.params} reportData={this.state.reportData} flux={flux} />;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());
        expect(TestUtils.isCompositeComponent(parent.refs.thp)).toBeTruthy();

        // change params
        parent.setState({params: {appId:2, tblId:2}});
        expect(TestUtils.isCompositeComponent(parent.refs.thp)).toBeTruthy();

        // change params to match current props
        parent.setState({params: {appId:1, tblId:1}});
        expect(TestUtils.isCompositeComponent(parent.refs.thp)).toBeTruthy();
    });

});
