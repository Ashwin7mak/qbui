import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FacetsAspect  from '../../src/components/facet/facetsAspect';
import FacetsItem  from '../../src/components/facet/facetsItem';
import FacetsList  from '../../src/components/facet/facetsList';
import FacetSelections  from '../../src/components/facet/facetSelections';

describe('FacetList functions', () => {
    'use strict';
    var I18nMessageMock = React.createClass({
        render() {
            return (
                <div>test</div>
            );
        }
    });

    beforeEach(() => {
        FacetsList.__Rewire__('I18nMessage', I18nMessageMock);
        FacetsItem.__Rewire__('I18nMessage', I18nMessageMock);
        FacetsAspect.__Rewire__('I18nMessage', I18nMessageMock);
    });

    afterEach(() => {
        FacetsList.__ResetDependency__('I18nMessage');
        FacetsItem.__ResetDependency__('I18nMessage');
        FacetsAspect.__ResetDependency__('I18nMessage');
    });



    let component;

    let fakefacets =  [
            {id : 1, name : "Types", type: "TEXT", blanks: true,
                values : [{value:"Design"}, {value:"Development"}, {value:"Planning"}, {value:"Test"}]},
            {id : 2, name : "Names", type: "TEXT", blanks: false,
                values : [
                    {value: "Aditi Goel"}, {value: "Christopher Deery"}, {value: "Claire Martinez"}, {value: "Claude Keswani"}, {value: "Deborah Pontes"},
                    {value: "Donald Hatch"}, {value: "Drew Stevens"}, {value: "Erica Rodrigues"}, {value: "Kana Eiref"},
                    {value: "Ken LaBak"}, {value: "Lakshmi Kamineni"}, {value: "Lisa Davidson"}, {value: "Marc Labbe"},
                    {value: "Matthew Saforrian"}, {value: "Micah Zimring"}, {value: "Rick Beyer"}, {value: "Sam Jones"}, {value: "XJ He"}
                ]},
            {id : 3, name : "Status", type: "TEXT", blanks: false,
                values : [{value: "No Started"}, {value: "In Progress"}, {value: "Blocked"}, {value: "Completed"}]},
            {id : 4, name : "Flag", type: "CHECKBOX",  blanks: false,
                values : [{value: "Yes"}, {value: "No"}]},
            //{id : 4, name : "Dates", type: "date",  blanks: false,
            //    range : {start: 1, end: 2}},
    ];


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

    const fakeReportData_noValues = {
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
            facets:  [{id : 1, name : "Types", type: "TEXT", blanks: true, values : []},
                      {id : 2, name : "Names", type: "TEXT", blanks: false, values : []}]

        }
    };


    it('test render FacetsList no facets', () => {
        component = TestUtils.renderIntoDocument(<FacetsList popoverId={2}
                                                             selectedValues={{}}
                                                             reportData={{}}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render FacetsList', () => {
        component = TestUtils.renderIntoDocument(<FacetsList popoverId={1}
                                                             selectedValues={{}}
                                                             reportData={fakeReportData_simple}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render FacetsList with no values for a facet', () => {
        let selected = new FacetSelections();
        component = TestUtils.renderIntoDocument(<FacetsList popoverId={1}
                                                             selectedValues={{}}
                                                             reportData={fakeReportData_noValues}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let noOptions = TestUtils.scryRenderedDOMComponentsWithClass(component, "noOptions");
        expect(noOptions.length).toBe(2);
    });


    it('test render FacetsList with empty selections', () => {
        let selected = new FacetSelections();
        component = TestUtils.renderIntoDocument(<FacetsList popoverId={1}
                                                             selectedValues={{}}
                                                             reportData={fakeReportData_simple}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render FacetsList with selections', () => {
        let selected = new FacetSelections();
        selected.addSelection(1, 'Development');
        component = TestUtils.renderIntoDocument(<FacetsList popoverId={1}
                                                             selectedValues={selected}
                                                             reportData={fakeReportData_simple}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


});

