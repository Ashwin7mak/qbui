import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Fluxxor from 'fluxxor';
import TableHomePage  from '../../src/components/table/tableHomePageRoute';
import FacetSelections  from '../../src/components/facet/facetSelections';

describe('TableHomePage functions', () => {
    'use strict';

    let component;
    let reportDataSearchStore = Fluxxor.createStore({
        getState() {
            return {searchStringInput :''};
        }
    });

    let stores = {
        ReportDataSearchStore: new reportDataSearchStore()
    };

    let flux = new Fluxxor.Flux(stores);

    flux.actions = {
        selectTableId() {
            return;
        },
        loadReport() {
            return;
        },
        showTopNav() {
            return;
        },
        setTopTitle() {
            return;
        },
        hideTopNav() {
            return;
        }
    };

    beforeEach(() => {
        spyOn(flux.actions, 'loadReport');
        spyOn(flux.actions, 'selectTableId');
    });

    afterEach(() => {
        flux.actions.loadReport.calls.reset();
        flux.actions.selectTableId.calls.reset();
    });

    it('test render of component with url params', () => {

        let params = {
            appId:1,
            tblId:2
        };

        let oldProps = {
            reportData: {
                appId: 0,
                tblId: 0,
                selections: new FacetSelections(),
                data: {
                    name: "test",
                    filteredRecords: [{
                        col_num: 1,
                        col_text: "abc",
                        col_date: "01-01-2015"
                    }],
                    columns: [{
                        field: "col_num",
                        headerName: "col_num"
                    },
                        {
                            field: "col_text",
                            headerName: "col_text"
                        },
                        {
                            field: "col_date",
                            headerName: "col_date"
                        }]
                }
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
                    tblId: 1,
                    data: {
                        name: "test",
                        filteredRecords: [{
                            col_num: 1,
                            col_text: "abc",
                            col_date: "01-01-2015"
                        }],
                        columns: [{
                            field: "col_num",
                            headerName: "col_num"
                        },
                            {
                                field: "col_text",
                                headerName: "col_text"
                            },
                            {
                                field: "col_date",
                                headerName: "col_date"
                            }]
                    }
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
