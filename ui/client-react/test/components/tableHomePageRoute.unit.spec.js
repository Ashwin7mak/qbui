import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Fluxxor from 'fluxxor';
import {TableHomePageRoute} from '../../src/components/table/tableHomePageRoute';
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

    let props = {
        clearSearchInput: () => {},
        loadFields: (app, tbl) => {},
        loadTableHomePage: () => {},
        params: {
            appId: 1,
            tblId: 2,
            offset:Constants.PAGE.DEFAULT_OFFSET,
            numRows:Constants.PAGE.DEFAULT_NUM_ROWS
        }
    };

    let mockedStore = Fluxxor.createStore({
        getState() {
            return {};
        }
    });

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

    let stores = {
        MockStore: new mockedStore()
    };
    let flux = new Fluxxor.Flux(stores);
    flux.actions = {
        selectTableId() {return;},
        hideTopNav() {return;}
    };

    beforeEach(() => {
        spyOn(flux.actions, 'hideTopNav');
        spyOn(flux.actions, 'selectTableId');
        spyOn(props, 'clearSearchInput');
        spyOn(props, 'loadFields');
        spyOn(props, 'loadTableHomePage');
    });

    afterEach(() => {
        flux.actions.hideTopNav.calls.reset();
        flux.actions.selectTableId.calls.reset();
        props.clearSearchInput.calls.reset();
        props.loadFields.calls.reset();
        props.loadTableHomePage.calls.reset();
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

        let wrapper = shallow(<TableHomePageRoute {...props} {...oldProps} flux={flux}/>);
        expect(wrapper).toBeDefined();
    });

    it('test action loadTableHomePage is called with app data', () => {
        let wrapper = mount(<Provider store={store}><TableHomePageRoute {...props} reportData={reportDataParams.reportData} flux={flux}></TableHomePageRoute></Provider>);
        expect(props.clearSearchInput).toHaveBeenCalled();
        expect(props.loadFields).toHaveBeenCalledWith(props.params.appId, props.params.tblId);
        expect(props.loadTableHomePage).toHaveBeenCalledWith(CONTEXT.REPORT.NAV, props.params.appId, props.params.tblId, reportDataParams.reportData.pageOffset, reportDataParams.reportData.numRows);
    });

    it('test flux action loadTableHomePage is not called with missing app data', () => {
        let propsCopy = _.clone(props);
        propsCopy.params.appId = null;
        let wrapper = mount(<Provider store={store}><TableHomePageRoute {...propsCopy} reportData={reportDataParams.reportData} flux={flux}></TableHomePageRoute></Provider>);
        expect(props.loadTableHomePage).not.toHaveBeenCalled();
    });
});
