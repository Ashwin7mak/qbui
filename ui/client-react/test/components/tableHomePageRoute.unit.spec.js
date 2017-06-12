import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import {
    TableHomePageRoute,
    __RewireAPI__ as TableHomePageRewireAPI
} from '../../src/components/table/tableHomePageRoute';
import FacetSelections  from '../../src/components/facet/facetSelections';
import Constants from '../../../common/src/constants';
import {CONTEXT} from '../../src/actions/context';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {Provider} from "react-redux";
import {shallow, mount} from 'enzyme';
import _ from 'lodash';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('TableHomePageRoute functions', () => {
    'use strict';

    const props = {
        clearSearchInput: () => {},
        hideTopNav: () => {},
        loadFields: (app, tbl) => {},
        loadTableHomePage: () => {},
        selectTable: () => {},
        reportBuilder: {
            isInBuilderMode: true,
            isCollapsed: true,
            addBeforeColumn: null,
            availableColumns: []
        },
        match: {
            params: {
                appId: 1,
                tblId: 2,
                offset:Constants.PAGE.DEFAULT_OFFSET,
                numRows:Constants.PAGE.DEFAULT_NUM_ROWS
            }
        }
    };

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

    class mockReportToolsAndContent extends React.Component {
        render() {
            return <div />;
        }
    }

    class mockReportFieldSelectMenu extends React.Component {
        render() {
            return <div />;
        }
    }

    beforeEach(() => {
        spyOn(props, 'clearSearchInput');
        spyOn(props, 'loadFields');
        spyOn(props, 'loadTableHomePage');
        spyOn(props, 'selectTable');
        TableHomePageRewireAPI.__Rewire__('ReportToolsAndContent', mockReportToolsAndContent);
        TableHomePageRewireAPI.__Rewire__('ReportFieldSelectMenu', mockReportFieldSelectMenu);
    });

    afterEach(() => {
        props.clearSearchInput.calls.reset();
        props.loadFields.calls.reset();
        props.loadTableHomePage.calls.reset();
        props.selectTable.calls.reset();
        TableHomePageRewireAPI.__ResetDependency__('ReportToolsAndContent');
        TableHomePageRewireAPI.__ResetDependency__('ReportFieldSelectMenu');
    });

    const initialState = {};
    const store = mockStore(initialState);

    it('test render of component with url params', () => {
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

        let wrapper = shallow(<TableHomePageRoute {...props} {...oldProps}/>);
        expect(wrapper).toBeDefined();
    });

    it('test action loadTableHomePage is called with app data', () => {
        // we need to `mount` so componentDidMount will fire
        let wrapper = mount(<Provider store={store}><TableHomePageRoute {...props} reportData={reportDataParams.reportData}/></Provider>);
        expect(props.clearSearchInput).toHaveBeenCalled();
        expect(props.loadFields).toHaveBeenCalledWith(props.match.params.appId, props.match.params.tblId);
        expect(props.selectTable).toHaveBeenCalledWith(props.match.params.appId, props.match.params.tblId);
        expect(props.loadTableHomePage).toHaveBeenCalledWith(CONTEXT.REPORT.NAV, props.match.params.appId, props.match.params.tblId, reportDataParams.reportData.pageOffset, reportDataParams.reportData.numRows);
    });

    it('test action loadTableHomePage is not called with missing app data', () => {
        let propsCopy = _.clone(props);
        propsCopy.match.params.appId = null;
        let wrapper = mount(<Provider store={store}><TableHomePageRoute {...propsCopy} reportData={reportDataParams.reportData}/></Provider>);
        expect(props.loadTableHomePage).not.toHaveBeenCalled();
    });
});
