import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Fluxxor from 'fluxxor';
import TableHomePageRoute  from '../../src/components/table/tableHomePageRoute';
import FacetSelections  from '../../src/components/facet/facetSelections';
import Constants from '../../../common/src/constants';

describe('TableHomePageRoute functions', () => {
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

    let routeParams = {appId:1, tblId:2};
    let reportDataParams = {
        reportData: {
            pageOffset:Constants.PAGE.DEFAULT_OFFSET,
            numRows:Constants.PAGE.DEFAULT_NUM_ROWS,
            selections: new FacetSelections(),
            data: {
                columns: [
                    {field: "col_num", headerName: "col_num"}
                ]
            }
        }
    };

    let flux = new Fluxxor.Flux(stores);

    flux.actions = {
        selectTableId() {return;},
        loadTableHomePage() {return;},
        loadFields() {return;},
        hideTopNav() {return;}
    };

    beforeEach(() => {
        spyOn(flux.actions, 'loadTableHomePage');
        spyOn(flux.actions, 'loadFields');
        spyOn(flux.actions, 'selectTableId');
    });

    afterEach(() => {
        flux.actions.loadTableHomePage.calls.reset();
        flux.actions.loadFields.calls.reset();
        flux.actions.selectTableId.calls.reset();
    });

    it('test render of component with url params', () => {

        let params = {
            appId:1,
            tblId:2,
            offset:Constants.PAGE.DEFAULT_OFFSET,
            numRows:Constants.PAGE.DEFAULT_NUM_ROWS
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
        component = TestUtils.renderIntoDocument(<TableHomePageRoute params={params} {...oldProps} flux={flux}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test url changes ', () => {

        var TestParent = React.createFactory(React.createClass({
            getInitialState() {
                let params = {
                    appId:1,
                    tblId:1,
                    offset:Constants.PAGE.DEFAULT_OFFSET,
                    numRows:Constants.PAGE.DEFAULT_NUM_ROWS
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
                return <TableHomePageRoute ref="thp" params={this.state.params} reportData={this.state.reportData} flux={flux} />;
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

    it('test flux action loadTableHomePage is called with app data', () => {
        component = TestUtils.renderIntoDocument(<TableHomePageRoute params={routeParams} reportData={reportDataParams.reportData} flux={flux}></TableHomePageRoute>);
        expect(flux.actions.loadTableHomePage).toHaveBeenCalledWith(routeParams.appId, routeParams.tblId, reportDataParams.reportData.pageOffset, reportDataParams.reportData.numRows);
    });

    it('test flux action loadTableHomePage is not called on 2nd called with same app data', () => {
        var div = document.createElement('div');
        ReactDOM.render(<TableHomePageRoute params={routeParams} reportData={reportDataParams.reportData} flux={flux}></TableHomePageRoute>, div);
        expect(flux.actions.loadTableHomePage).toHaveBeenCalled();
        //  on subsequent call with same parameter data, the loadReport function is not called
        ReactDOM.render(<TableHomePageRoute params={routeParams} reportData={reportDataParams.reportData} flux={flux}></TableHomePageRoute>, div);
        expect(flux.actions.loadTableHomePage).not.toHaveBeenCalledWith();
    });

    it('test flux action loadTableHomePage is not called with missing app data', () => {
        routeParams.appId = null;
        component = TestUtils.renderIntoDocument(<TableHomePageRoute params={routeParams} reportData={reportDataParams.reportData} flux={flux}></TableHomePageRoute>);
        expect(flux.actions.loadTableHomePage).not.toHaveBeenCalled();
    });

});
