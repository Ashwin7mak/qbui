import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Fluxxor from 'fluxxor';
import * as actions from '../../src/constants/actions';
import IconActions from '../../src/components/actions/iconActions';
import ReportToolbar  from '../../src/components/report/reportToolbar';
import FacetSelections  from '../../src/components/facet/facetSelections';
import facetMenuActions from '../../src/actions/facetMenuActions';

describe('ReportToolbar functions', () => {
    'use strict';

    let component;

    let navStore = Fluxxor.createStore({
        getState() {
            return {leftNavOpen: true};
        }
    });

    let appStore = Fluxxor.createStore({
        getState() {
            return [];
        }
    });
    let reportsStore = Fluxxor.createStore({
        getState() {
            return [];
        }
    });

    let reportDataStore = Fluxxor.createStore({
        getState() {
            return [];
        }
    });

    let facetMenuStore = Fluxxor.createStore({
        initMenu() {

        },
        getState() {
            return {};
        }
    });


    let stores = {
        NavStore: new navStore(),
        AppsStore: new appStore(),
        ReportsStore: new reportsStore(),
        ReportDataStore: new reportDataStore(),
        FacetMenuStore:  new facetMenuStore()
    };

    let flux = new Fluxxor.Flux(stores);

    flux.actions = {
        selectTableId() {
            return;
        },
        loadReports() {
            return;
        },
        searchFor(text) {
            return;
        },
        filterReport() {
            return;
        },
        getState() {
            return;
        },
    };


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
            values: [{value: "Yes"}, {value: "No"}]
        },
        //{id : 4, name : "Dates", type: "date",  blanks: false,
        //    range : {start: 1, end: 2}},
    ];

    beforeEach(() => {
        flux.store('FacetMenuStore').initMenu();
    });

    const fakeReportData_simple = {
        loading: false,
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

    const pageActions = <IconActions actions={[]}/>;

    it('test render reportToolbar no records', () => {
        component = TestUtils.renderIntoDocument(<ReportToolbar flux={flux}
                                                                pageActions={pageActions}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let filterSearchBox = TestUtils.scryRenderedDOMComponentsWithClass(component, "filterSearchBox");
        expect(filterSearchBox.length).toEqual(0);
        let facetsMenuContainer = TestUtils.scryRenderedDOMComponentsWithClass(component, "facetsMenuContainer");
        expect(facetsMenuContainer.length).toEqual(0);
        let facetsMenuButton = TestUtils.scryRenderedDOMComponentsWithClass(component, "facetsMenuButton");
        expect(facetsMenuButton.length).toEqual(0);
        let facetButtons = TestUtils.scryRenderedDOMComponentsWithClass(component, "facetButtons");
        expect(facetButtons.length).toEqual(0);
        let recordsCount = TestUtils.scryRenderedDOMComponentsWithClass(component, "recordsCount");
        expect(recordsCount.length).toEqual(0);
    });


    it('test render reportToolbar with records', () => {
        component = TestUtils.renderIntoDocument(<ReportToolbar flux={flux}
                                                                reportData={fakeReportData_simple}
                                                                pageActions={pageActions}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let filterSearchBox = TestUtils.scryRenderedDOMComponentsWithClass(component, "filterSearchBox");

        expect(filterSearchBox.length).toEqual(1);
        let facetsMenuContainer = TestUtils.scryRenderedDOMComponentsWithClass(component, "facetsMenuContainer");
        expect(facetsMenuContainer.length).toEqual(1);
        let facetsMenuButton = TestUtils.scryRenderedDOMComponentsWithClass(component, "facetsMenuButton");
        expect(facetsMenuButton.length).toEqual(1);
        let facetButtons = TestUtils.scryRenderedDOMComponentsWithClass(component, "facetButtons");
        expect(facetButtons.length).toEqual(1);
        let recordsCount = TestUtils.scryRenderedDOMComponentsWithClass(component, "recordsCount");
        expect(recordsCount.length).toEqual(1);

    });

    it('test render reportToolbar with no facets', () => {
        let fakeReportWithNoFacets = _.cloneDeep(fakeReportData_simple);
        fakeReportWithNoFacets.data.facets = null;
        component = TestUtils.renderIntoDocument(<ReportToolbar flux={flux}
                                                                reportData={fakeReportWithNoFacets}
                                                                selections={null}
                                                                pageActions={pageActions}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        // empty filter icon is no shown
        let filterIcon = TestUtils.scryRenderedDOMComponentsWithClass(component, "iconssturdy-filter-tool");
        expect(filterIcon.length).toEqual(0);

    });

    it('test render reportToolbar with no selected facet values', () => {
        let selected = new FacetSelections();
        let fakeReportWithFacets = _.cloneDeep(fakeReportData_simple);
        component = TestUtils.renderIntoDocument(<ReportToolbar flux={flux}
                                                                reportData={fakeReportWithFacets}
                                                                selections={selected}
                                                                pageActions={pageActions}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        // empty filter icon is shown
        let filterIcon = TestUtils.scryRenderedDOMComponentsWithClass(component, "iconssturdy-filter-tool");
        expect(filterIcon.length).toEqual(1);

    });

    it('test render reportToolbar with selected facet values', () => {
        let selected = new FacetSelections();
        selected.addSelection(1, 'Development');
        selected.addSelection(4, 'Yes');
        let fakeReportWithFacets = _.cloneDeep(fakeReportData_simple);
        component = TestUtils.renderIntoDocument(<ReportToolbar flux={flux} selections={selected}
                                                                reportData={fakeReportWithFacets} pageActions={pageActions} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();


        // count has 2 numbers X of X when there is a selection
        let recordsCount = TestUtils.scryRenderedDOMComponentsWithClass(component, "recordsCount");
        expect(recordsCount.length).toEqual(1);
        let span = recordsCount[0];
        expect(span).not.toBeNull();
        expect(span.innerText.match(/\d+ .*\d+/)).toBeTruthy();
    });

    it('test render reportToolbar with selected facet values and add Boolean filter', () => {

        let selected = new FacetSelections();
        selected.addSelection(1, 'Development');
        let fakeReportWithFacets = _.cloneDeep(fakeReportData_simple);
        component = TestUtils.renderIntoDocument(<ReportToolbar flux={flux} selections={selected}
                                                                reportData={fakeReportWithFacets} pageActions={pageActions} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        spyOn(flux.actions, 'filterReport').and.callThrough();

        //add bool facet
        selected.addSelection(4, 'Yes');
        //search
        component.filterOnSearch('');

        // ensure the boolean facet becomes a number
        expect(flux.actions.filterReport).toHaveBeenCalledWith(undefined, undefined, undefined, true,
            {selections : selected, facet: [{fid : '1', values:['Development']}, {fid: '4', values:[1]}], search : ''});

        flux.actions.filterReport.calls.reset();
    });

    it('test render reportToolbar searches text', (done) => {

        let delay = 200;
        component = TestUtils.renderIntoDocument(<ReportToolbar flux={flux}
                                                                debounceInputTime={delay} pageActions={pageActions}
                                                                reportData={fakeReportData_simple}/>);

        // check for the search box shows up
        let filterSearchBox = TestUtils.scryRenderedDOMComponentsWithClass(component, "filterSearchBox");
        expect(filterSearchBox.length).toEqual(1);

        // check that search input is debounced
        spyOn(flux.actions, 'filterReport').and.callThrough();
        var searchInput = filterSearchBox[0];
        var testValue = 'xxx';

        //simulate search string was input
        TestUtils.Simulate.change(searchInput, {target: {value: testValue}});
        //initially don't search until debounced time has passed
        expect(flux.actions.filterReport).not.toHaveBeenCalled();
        flux.actions.filterReport.calls.reset();

        // count has 1 number e.g. X records when there is no search (not x of y records)
        let recordsCount = TestUtils.scryRenderedDOMComponentsWithClass(component, "recordsCount");
        expect(recordsCount.length).toEqual(1);
        let span = recordsCount[0];
        expect(span).not.toBeNull();
        expect(span.innerText.match(/\d+ .+\d+/)).toBeFalsy();

        //timeout for debounce
        setTimeout(function() {
            // check that search ran after debounce time
            expect(flux.actions.filterReport).toHaveBeenCalledWith(undefined, undefined, undefined, true, Object({selections: jasmine.any(Object), facet: [], search: testValue}));
            flux.actions.filterReport.calls.reset();
            done();
        }, delay + 100);

    });

    it('test render reportToolbar with search text', (done) => {
        component = TestUtils.renderIntoDocument(<ReportToolbar flux={flux}
                                                                searchStringForFiltering={"abc"}
                                                                reportData={fakeReportData_simple}
                                                                pageActions={pageActions} />);

        // check for the search box shows up
        let filterSearchBox = TestUtils.scryRenderedDOMComponentsWithClass(component, "filterSearchBox");
        expect(filterSearchBox.length).toEqual(1);
        expect(filterSearchBox[0].value).toEqual("abc");

        // check that report is considered filter
        expect(component.isFiltered()).toBeTruthy();
        done();

    });

    it('test render reportToolbar with selected values then clear a field selection', () => {
        let fakeReportWithFacets = _.cloneDeep(fakeReportData_simple);
        component = TestUtils.renderIntoDocument(<ReportToolbar flux={flux}
                                                                reportData={fakeReportWithFacets}
                                                                pageActions={pageActions}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        spyOn(flux.actions, 'filterReport').and.callThrough();

        //select a couple of facets
        component.handleFacetSelect(null, {id: 1}, 'Development');
        component.handleFacetSelect(null, {id: 1}, 'Planning');
        expect(flux.actions.filterReport).toHaveBeenCalled();
        flux.actions.filterReport.calls.reset();

        //clear all selection for field 1
        component.handleFacetClearFieldSelects({id: 1});
        expect(flux.actions.filterReport).toHaveBeenCalled();
        flux.actions.filterReport.calls.reset();

    });

    it('test render reportToolbar with selected values then clear a value selection', () => {
        let fakeReportWithFacets = _.cloneDeep(fakeReportData_simple);
        let startingSelections = new FacetSelections();
        startingSelections.addSelection(1, "Development");
        component = TestUtils.renderIntoDocument(<ReportToolbar flux={flux}
                                                                selections={startingSelections}
                                                                reportData={fakeReportWithFacets}
                                                                pageActions={pageActions}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        spyOn(flux.actions, 'filterReport').and.callThrough();

        //select a couple of facets
        component.handleFacetDeselect(null, {id: 1}, 'Development');
        expect(flux.actions.filterReport).toHaveBeenCalled();
        flux.actions.filterReport.calls.reset();
    });


    it('test render reportToolbar with selected values then clear all selection', () => {
        let fakeReportWithFacets = _.cloneDeep(fakeReportData_simple);
        component = TestUtils.renderIntoDocument(<ReportToolbar flux={flux}
                                                                reportData={fakeReportWithFacets}
                                                                pageActions={pageActions}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        //select a couple of facets
        component.handleFacetSelect(null, {id: 1}, 'Development');
        component.handleFacetSelect(null, {id: 2}, 'Claire Martinez');
        spyOn(flux.actions, 'filterReport').and.callThrough();

        //clear all selects
        component.handleFacetClearAllSelects();

        expect(flux.actions.filterReport).toHaveBeenCalled();
        flux.actions.filterReport.calls.reset();
    });


    it('test render reportToolbar with selected values and search then clear all ', () => {
        let fakeReportWithFacets = _.cloneDeep(fakeReportData_simple);
        component = TestUtils.renderIntoDocument(<ReportToolbar flux={flux}
                                                                searchStringForFiltering={'abc'}
                                                                reportData={fakeReportWithFacets}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        //select a couple of facets
        component.handleFacetSelect(null, {id: 1}, 'Development');
        component.handleFacetSelect(null, {id: 2}, 'Claire Martinez');
        spyOn(flux.actions, 'filterReport').and.callThrough();
        spyOn(component, 'filterReport').and.callThrough();

        //clear all selects and search
        component.handleFacetClearAllSelectsAndSearch();

        expect(flux.actions.filterReport).toHaveBeenCalled();
        expect(component.filterReport).toHaveBeenCalledWith('', new FacetSelections());
        flux.actions.filterReport.calls.reset();
    });


});

