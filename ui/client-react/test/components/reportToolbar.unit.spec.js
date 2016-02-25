import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Fluxxor from 'fluxxor';
import ReportToolbar  from '../../src/components/report/reportToolbar';
import FacetSelections  from '../../src/components/facet/facetSelections';

describe('ReportToolbar functions', () => {
    'use strict';

    let component;

    let navStore = Fluxxor.createStore({
        getState: function() {
            return {leftNavOpen: true};
        }
    });

    let appStore = Fluxxor.createStore({
        getState: function() {
            return [];
        }
    });
    let reportsStore = Fluxxor.createStore({
        getState: function() {
            return [];
        }
    });

    let reportDataStore = Fluxxor.createStore({
        getState: function() {
            return [];
        }
    });

    let stores = {
        NavStore: new navStore(),
        AppsStore: new appStore(),
        ReportsStore: new reportsStore(),
        ReportDataStore: new reportDataStore()
    };

    let flux = new Fluxxor.Flux(stores);

    flux.actions = {
        selectTableId: function() {
            return;
        },
        loadReports: function() {
            return;
        },
        searchFor: function(text) {
            return;
        }
    };

    let fakefacets = {
        list: [
            {
                id: 1, name: "Types", type: "text", blanks: true,
                values: [{value: "Design"}, {value: "Development"}, {value: "Planning"}, {value: "Test"}]
            },
            {
                id: 2, name: "Names", type: "text", blanks: false,
                values: [
                    {value: "Aditi Goel"}, {value: "Christopher Deery"}, {value: "Claire Martinez"}, {value: "Claude Keswani"}, {value: "Deborah Pontes"},
                    {value: "Donald Hatch"}, {value: "Drew Stevens"}, {value: "Erica Rodrigues"}, {value: "Kana Eiref"},
                    {value: "Ken LaBak"}, {value: "Lakshmi Kamineni"}, {value: "Lisa Davidson"}, {value: "Marc Labbe"},
                    {value: "Matthew Saforrian"}, {value: "Micah Zimring"}, {value: "Rick Beyer"}, {value: "Sam Jones"}, {value: "XJ He"}
                ]
            },
            {
                id: 3, name: "Status", type: "text", blanks: false,
                values: [{value: "No Started"}, {value: "In Progress"}, {value: "Blocked"}, {value: "Completed"}]
            },
            {
                id: 4, name: "Flag", type: "bool", blanks: false,
                values: [{value: "True"}, {value: "False"}]
            },
            //{id : 4, name : "Dates", type: "date",  blanks: false,
            //    range : {start: 1, end: 2}},
        ],
    };


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
            columns: ["col_num", "col_text", "col_date"],
            facets: fakefacets
        }
    };

    it('test render reportToolbar no records', () => {
        component = TestUtils.renderIntoDocument(<ReportToolbar flux={flux}
                                                                fieldSelections={[]}
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
                                                                fieldSelections={[]}
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

    it('test render reportToolbar with no selected facet values', () => {
        let selected = new FacetSelections();
        let fakeReportWithFacets = _.cloneDeep(fakeReportData_simple);
        component = TestUtils.renderIntoDocument(<ReportToolbar flux={flux}
                                                                reportData={fakeReportWithFacets}
                                                                fieldSelections={selected}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        // empty filter icon is shown
        let filterIcon = TestUtils.scryRenderedDOMComponentsWithClass(component, "iconssturdy-filter-tool");
        expect(filterIcon.length).toEqual(1);

    });

    it('test render reportToolbar with selected facet values', () => {
        let selected = new FacetSelections();
        selected.addSelection(1, 'Development');
        let fakeReportWithFacets = _.cloneDeep(fakeReportData_simple);
        component = TestUtils.renderIntoDocument(<ReportToolbar flux={flux}
                                                                reportData={fakeReportWithFacets}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        component.handleFacetSelect(null, 1, 'Development');
        // filled filter icon is shown when there's a selection
        let filterIcon = TestUtils.scryRenderedDOMComponentsWithClass(component, "iconssturdy-filter-status");
        expect(filterIcon.length).toEqual(1);

        //clear select button shown
        let clearAllFacets = TestUtils.scryRenderedDOMComponentsWithClass(component, "clearAllFacets");
        expect(clearAllFacets.length).toEqual(1);

        // count has 2 numbers X of X when there is a selection
        let recordsCount = TestUtils.scryRenderedDOMComponentsWithClass(component, "recordsCount");
        expect(recordsCount.length).toEqual(1);
        let span = recordsCount[0];
        expect(span).not.toBeNull();
        expect(span.innerText.match(/\d+ .*\d+/)).toBeTruthy();
    });

    it('test render reportToolbar searches text', (done) => {
        let delay = 200;
        component = TestUtils.renderIntoDocument(<ReportToolbar flux={flux}
                                                                debounceInputTime={delay}
                                                                reportData={fakeReportData_simple}/>);

        // check for the search box shows up
        let filterSearchBox = TestUtils.scryRenderedDOMComponentsWithClass(component, "filterSearchBox");
        expect(filterSearchBox.length).toEqual(1);

        // check that search input is debounced
        spyOn(flux.actions, 'searchFor').and.callThrough();
        var searchInput = filterSearchBox[0];
        var testValue = 'xxx';

        //simulate search string was input
        TestUtils.Simulate.change(searchInput, {target: {value: testValue}});
        //initially don't search until debounced time has passed
        expect(flux.actions.searchFor).not.toHaveBeenCalled();

        // count has 1 number e.g. X records when there is no search (not x of y records)
        let recordsCount = TestUtils.scryRenderedDOMComponentsWithClass(component, "recordsCount");
        expect(recordsCount.length).toEqual(1);
        let span = recordsCount[0];
        expect(span).not.toBeNull();
        expect(span.innerText.match(/\d+ .+\d+/)).toBeFalsy();
        flux.actions.searchFor.calls.reset();

        //timeout for debounce
        setTimeout(function() {
            // check that search ran after debounce time
            expect(flux.actions.searchFor).toHaveBeenCalledWith(testValue);
            // check that its considered filtered
            expect(component.isFiltered()).toBe(true);
            flux.actions.searchFor.calls.reset();
            done();
        }, delay + 10);

    });

    it('test render reportToolbar with selected values then clear a field selection', () => {
        let fakeReportWithFacets = _.cloneDeep(fakeReportData_simple);
        component = TestUtils.renderIntoDocument(<ReportToolbar flux={flux}
                                                                reportData={fakeReportWithFacets}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        //select a couple of facets
        component.handleFacetSelect(null, {id: 1}, 'Development');
        component.handleFacetSelect(null, {id: 1}, 'Planning');
        //clear all selection for field 1
        component.handleFacetClearFieldSelects({id: 1});
        // empty filter icon is shown no selection
        let filterIcon = TestUtils.scryRenderedDOMComponentsWithClass(component, "iconssturdy-filter-tool");
        expect(filterIcon.length).toEqual(1);

    });

    it('test render reportToolbar with selected values then clear some field selections', () => {
        let fakeReportWithFacets = _.cloneDeep(fakeReportData_simple);
        component = TestUtils.renderIntoDocument(<ReportToolbar flux={flux}
                                                                reportData={fakeReportWithFacets}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        //select a couple of facets
        component.handleFacetSelect(null, {id: 1}, 'Development');
        component.handleFacetSelect(null, {id: 2}, 'Claire Martinez');
        //clear all selection for field 1
        component.handleFacetClearFieldSelects({id: 1});
        // nonempty filter icon is shown still some selections for field 2
        let filterIcon = TestUtils.scryRenderedDOMComponentsWithClass(component, "iconssturdy-filter-status");
        expect(filterIcon.length).toEqual(1);

    });

    it('test render reportToolbar with selected values then clear all selection', () => {
        let fakeReportWithFacets = _.cloneDeep(fakeReportData_simple);
        component = TestUtils.renderIntoDocument(<ReportToolbar flux={flux}
                                                                reportData={fakeReportWithFacets}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        //select a couple of facets
        component.handleFacetSelect(null, {id: 1}, 'Development');
        component.handleFacetSelect(null, {id: 2}, 'Claire Martinez');
        //clear all selects
        component.handleFacetClearAllSelects();
        // empty filter icon is shown no selections
        let filterIcon = TestUtils.scryRenderedDOMComponentsWithClass(component, "iconssturdy-filter-tool");
        expect(filterIcon.length).toEqual(1);

    });

});

