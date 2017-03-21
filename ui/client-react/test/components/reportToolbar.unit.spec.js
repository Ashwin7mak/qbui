import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Fluxxor from 'fluxxor';
import IconActions from '../../src/components/actions/iconActions';
import ReportToolbar  from '../../src/components/report/reportToolbar';
import {__RewireAPI__ as ReportToolbarRewireAPI} from '../../src/components/report/reportToolbar';
import FacetSelections  from '../../src/components/facet/facetSelections';
import facetMenuActions from '../../src/actions/facetMenuActions';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {Provider} from "react-redux";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('ReportToolbar functions', () => {
    'use strict';

    let navStore = Fluxxor.createStore({
        getState() {
            return {leftNavOpen: true};
        }
    });

    let stores = {
        NavStore: new navStore()
    };

    let flux = new Fluxxor.Flux(stores);
    flux.actions = {
        onToggleRowPopUpMenu() {
            return;
        }
    };
    const pageActions = <IconActions flux={flux} actions={[]}/>;

    let fakefacets = [
        {
            id: 1, name: "Types", type: "TEXT", blanks: true,
            values: [{value: "Design"}, {value: "Development"}, {value: "Planning"}, {value: "Test"}]
        },
        {
            id: 2, name: "Names", type: "TEXT", blanks: false,
            values: [
                {value: "Aditi Goel"}, {value: "Christopher Deery"}, {value: "Claire Martinez"}, {value: "Claude Keswani"}, {value: "Deborah Pontes"},
                {value: "Donald Hatch"}, {value: "Drew Stevens"}, {value: "Erica Rodrigues"}, {value: "Kana Eiref"},
                {value: "Ken LaBak"}, {value: "Lakshmi Kamineni"}, {value: "Lisa Davidson"}, {value: "Marc Labbe"},
                {value: "Matthew Saforrian"}, {value: "Micah Zimring"}, {value: "Rick Beyer"}, {value: "Sam Jones"}, {value: "XJ He"}
            ]
        },
        {
            id: 3, name: "Status", type: "TEXT", blanks: false,
            values: [{value: "No Started"}, {value: "In Progress"}, {value: "Blocked"}, {value: "Completed"}]
        },
        {
            id: 4, name: "Flag", type: "CHECKBOX", blanks: false,
            values: [{value: true}, {value: false}]
        }
    ];

    //  mock SortAndGroup component as it requires redux store references.
    //  NOTE: could instead rewrite the tests to use enzyme.shallow
    let mockSortAndGroup = React.createClass({
        render: function() {
            return <div class="sortAndGroup">Mock SortAndGroup</div>;
        }
    });
    let mockSearchBox = React.createClass({
        render: function() {
            return <div className="filterSearchBox">Mock Filter searchBox</div>;
        }
    });
    let mockFacetsMenu = React.createClass({
        render: function() {
            return <div className="facetsMenu">Mock facets</div>;
        }
    });
    let mockRecordsCount = React.createClass({
        render: function() {
            return <div className="recordsCount">Mock record count</div>;
        }
    });
    let mockReportNavigation = React.createClass({
        render: function() {
            return <div className="reportNavigation">Mock report navigation</div>;
        }
    });

    let props = {};
    let callBacks = {};
    let store = {};
    beforeEach(() => {
        store = mockStore({});
        // init props
        props = {
            reportData: {},
            pageStart: 1,
            pageEnd: 0,
            recordsCount: 0,
            search: {
                searchInput: ''
            }
        };
        callBacks = {
            filterOnSelections: function() {
            },
            searchTheString: function() {
            }
        };
        spyOn(callBacks, 'searchTheString');
        spyOn(callBacks, 'filterOnSelections');
        ReportToolbarRewireAPI.__Rewire__('FacetsMenu', mockFacetsMenu);
        ReportToolbarRewireAPI.__Rewire__('FilterSearchBox', mockSearchBox);
        ReportToolbarRewireAPI.__Rewire__('RecordsCount', mockRecordsCount);
        ReportToolbarRewireAPI.__Rewire__('ReportNavigation', mockReportNavigation);
        ReportToolbarRewireAPI.__Rewire__('SortAndGroup', mockSortAndGroup);
    });

    afterEach(() => {
        callBacks.searchTheString.calls.reset();
        callBacks.filterOnSelections.calls.reset();
        ReportToolbarRewireAPI.__ResetDependency__('FacetsMenu');
        ReportToolbarRewireAPI.__ResetDependency__('FilterSearchBox');
        ReportToolbarRewireAPI.__ResetDependency__('RecordsCount');
        ReportToolbarRewireAPI.__ResetDependency__('ReportNavigation');
        ReportToolbarRewireAPI.__ResetDependency__('SortAndGroup');
    });

    const fakeReportData_no_records = {
        loading: false,
        countingTotalRecords: false,
        error: null,
        data: {
            recordsCount: 0,
            pageEnd:0,
            pageStart:1,
            numRows:20
        }
    };

    const fakeReportData_simple = {
        loading: false,
        countingTotalRecords: false,
        data: {
            name: "testReportToolbar",
            records: [
                {
                    col_num: 1,
                    col_text: "Design",
                    col_date: "01-01-2015"
                },
                {
                    col_num: 2,
                    col_text: "Development",
                    col_date: "02-02-2015"
                }, {
                    col_num: 3,
                    col_text: "Planning",
                    col_date: "03-03-2015"
                }],
            filteredRecords: [{
                col_num: 1,
                col_text: "Planning",
                col_date: "01-01-2015"
            }],
            columns: [
                {
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
                }],
            facets: fakefacets,
            recordsCount: 3,
            filteredRecordsCount: 1
        }
    };

    it('test render reportToolbar with no facets', () => {
        let fakeReportWithNoFacets = _.cloneDeep(fakeReportData_simple);
        fakeReportWithNoFacets.data.facets = null;
        let component = TestUtils.renderIntoDocument(<ReportToolbar {...props}
                                                                reportData={fakeReportWithNoFacets}
                                                                selections={null}
                                                                pageActions={pageActions}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        // empty filter icon is no shown
        let filterIcon = TestUtils.scryRenderedDOMComponentsWithClass(component, "iconTableUISturdy-filter-tool");
        expect(filterIcon.length).toEqual(0);

    });

    it('test render reportToolbar with selected facet values and add Boolean filter', () => {

        let selected = new FacetSelections();
        selected.addSelection(1, 'Development');

        let initialSelected = selected.copy();
        let fakeReportWithFacets = _.cloneDeep(fakeReportData_simple);

        let component = TestUtils.renderIntoDocument(<ReportToolbar {...props}
                                                                selections={initialSelected}
                                                                reportData={fakeReportWithFacets}
                                                                filterOnSelections={callBacks.filterOnSelections}
                                                                searchTheString={callBacks.searchTheString}
                                                                pageActions={pageActions} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        //add bool facet
        component.handleFacetSelect(null, {id: 4}, 'Yes');

        // ensure the boolean facet becomes a member
        selected.addSelection(4, 'Yes');
        expect(callBacks.filterOnSelections).toHaveBeenCalledWith(selected);
    });

    it('test render reportToolbar with selected values then clear a field selection', () => {

        let fakeReportWithFacets = _.cloneDeep(fakeReportData_simple);
        let component = TestUtils.renderIntoDocument(<ReportToolbar {...props}
                                                                reportData={fakeReportWithFacets}
                                                                filterOnSelections={callBacks.filterOnSelections}
                                                                searchTheString={callBacks.searchTheString}
                                                                pageActions={pageActions}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        //select a couple of facets
        component.handleFacetSelect(null, {id: 1}, 'Development');
        component.handleFacetSelect(null, {id: 1}, 'Planning');
        expect(callBacks.filterOnSelections).toHaveBeenCalled();
        callBacks.filterOnSelections.calls.reset();

        //clear all selection for field 1
        component.handleFacetClearFieldSelects({id: 1});
        expect(callBacks.filterOnSelections).toHaveBeenCalled();

    });

    it('test render reportToolbar with selected values then clear a value selection', () => {
        let fakeReportWithFacets = _.cloneDeep(fakeReportData_simple);
        let startingSelections = new FacetSelections();
        startingSelections.addSelection(1, "Development");
        let component = TestUtils.renderIntoDocument(<ReportToolbar {...props}
                                                                selections={startingSelections}
                                                                reportData={fakeReportWithFacets}
                                                                filterOnSelections={callBacks.filterOnSelections}
                                                                searchTheString={callBacks.searchTheString}
                                                                pageActions={pageActions}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        //select a couple of facets
        component.handleFacetDeselect(null, {id: 1}, 'Development');
        expect(callBacks.filterOnSelections).toHaveBeenCalled();
    });


    it('test render reportToolbar with selected values then clear all selection', () => {
        let fakeReportWithFacets = _.cloneDeep(fakeReportData_simple);
        let component = TestUtils.renderIntoDocument(<ReportToolbar {...props}
                                                                reportData={fakeReportWithFacets}
                                                                filterOnSelections={callBacks.filterOnSelections}
                                                                searchTheString={callBacks.searchTheString}
                                                                pageActions={pageActions}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        //select a couple of facets
        component.handleFacetSelect(null, {id: 1}, 'Development');
        component.handleFacetSelect(null, {id: 2}, 'Claire Martinez');
        callBacks.filterOnSelections.calls.reset();

        //clear all selects
        component.handleFacetClearAllSelects();

        expect(callBacks.filterOnSelections).toHaveBeenCalled();
    });

});

