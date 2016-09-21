import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import ReportNavigation from '../../src/components/report/reportNavigation';

const fakeReportNavigationData = {
    valid: {
        pageStart: 2,
        pageEnd: 10,
        recordsCount: 1000,
        getPreviousReportPage: null,
        getNextReportPage: null
    },
    noPrevious: {
        pageStart: 1,
        pageEnd: 20,
        recordsCount: 1000,
        getPreviousReportPage: null,
        getNextReportPage: null
    },
    noNext: {
        pageStart: 2,
        pageEnd: 1000,
        recordsCount: 20,
        getPreviousReportPage: null,
        getNextReportPage: null
    },
    noPrevAndNext: {
        pageStart: 1,
        pageEnd: 1000,
        recordsCount: 20,
        getPreviousReportPage: null,
        getNextReportPage: null
    },
    noRecords: {
        pageStart: 1,
        pageEnd: 10,
        recordsCount: 0,
        getPreviousReportPage: null,
        getNextReportPage:null,
        reportData: {
            data: {
                recordsCount: 0
            }
        }
    },
    noFilteredRecordsReturned: {
        pageStart: 1,
        pageEnd: 10,
        recordsCount: 0,
        getPreviousReportPage: null,
        getNextReportPage:null,
        reportData: {
            data: {
                recordsCount: 10,
                filteredRecordsCount: 0
            },
            searchStringForFiltering: 'someRandomSearchString',
        }
    }

};

describe('Report Navigation tests', () => {
    'use strict';

    var component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<ReportNavigation recordsCount={fakeReportNavigationData.valid.recordsCount}
                                                                   pageStart={fakeReportNavigationData.valid.pageStart}
                                                                   pageEnd={fakeReportNavigationData.valid.pageEnd}
                                                                   getPreviousReportPage={fakeReportNavigationData.valid.getPreviousReportPage}
                                                                   getNextReportPage={fakeReportNavigationData.valid.getNextReportPage}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        var reportNavigation = ReactDOM.findDOMNode(component);
        expect(reportNavigation).toBeDefined();
    });

    //  temporarily disabled until paging is re-implemented..
    xit('test previous link is generated', () => {
        component = TestUtils.renderIntoDocument(<ReportNavigation recordsCount={fakeReportNavigationData.valid.recordsCount}
                                                                   pageStart={fakeReportNavigationData.valid.pageStart}
                                                                   pageEnd={fakeReportNavigationData.valid.pageEnd}
                                                                   getPreviousReportPage={fakeReportNavigationData.valid.getPreviousReportPage}
                                                                   getNextReportPage={fakeReportNavigationData.valid.getNextReportPage}/>);
        var node = ReactDOM.findDOMNode(component);
        var previousButton = node.getElementsByClassName("previousButton");
        expect(previousButton).toBeDefined();
    });

    it('test previous link is NOT generated', () => {
        component = TestUtils.renderIntoDocument(<ReportNavigation recordsCount={fakeReportNavigationData.noPrevious.recordsCount}
                                                                   pageStart={fakeReportNavigationData.noPrevious.pageStart}
                                                                   pageEnd={fakeReportNavigationData.noPrevious.pageEnd}
                                                                   getPreviousReportPage={fakeReportNavigationData.noPrevious.getPreviousReportPage}
                                                                   getNextReportPage={fakeReportNavigationData.noPrevious.getNextReportPage}/>);
        var previousPage = TestUtils.findAllInRenderedTree(component, function(inst) {
            return TestUtils.isDOMComponent(inst) && inst.id === "previousReportPage";
        });
        expect(previousPage.length).toBe(0);
    });

    //  temporarily disabled until paging is re-implemented..
    xit('test next link is generated', () => {
        component = TestUtils.renderIntoDocument(<ReportNavigation recordsCount={fakeReportNavigationData.valid.recordsCount}
                                                                   pageStart={fakeReportNavigationData.valid.pageStart}
                                                                   pageEnd={fakeReportNavigationData.valid.pageEnd}
                                                                   getPreviousReportPage={fakeReportNavigationData.valid.getPreviousReportPage}
                                                                   getNextReportPage={fakeReportNavigationData.valid.getNextReportPage}/>);
        var node = ReactDOM.findDOMNode(component);
        var nextButton = node.getElementsByClassName("nextButton");
        expect(nextButton).toBeDefined();
    });

    it('test next link is NOT generated', () => {
        component = TestUtils.renderIntoDocument(<ReportNavigation recordsCount={fakeReportNavigationData.noNext.recordsCount}
                                                                   pageStart={fakeReportNavigationData.noNext.pageStart}
                                                                   pageEnd={fakeReportNavigationData.noNext.pageEnd}
                                                                   getPreviousReportPage={fakeReportNavigationData.noNext.getPreviousReportPage}
                                                                   getNextReportPage={fakeReportNavigationData.noNext.getNextReportPage}/>);
        var nextPage = TestUtils.findAllInRenderedTree(component, function(inst) {
            return TestUtils.isDOMComponent(inst) && inst.id === "nextReportPage";
        });
        expect(nextPage.length).toBe(0);
    });

    //  temporarily disabled until paging is re-implemented..
    xit('test next link and previous link are generated', () => {
        component = TestUtils.renderIntoDocument(<ReportNavigation recordsCount={fakeReportNavigationData.valid.recordsCount}
                                                                   pageStart={fakeReportNavigationData.valid.pageStart}
                                                                   pageEnd={fakeReportNavigationData.valid.pageEnd}
                                                                   getPreviousReportPage={fakeReportNavigationData.valid.getPreviousReportPage}
                                                                   getNextReportPage={fakeReportNavigationData.valid.getNextReportPage}/>);
        var node = ReactDOM.findDOMNode(component);
        var previousButton = node.getElementsByClassName("previousButton");
        expect(previousButton).toBeDefined();

        node = ReactDOM.findDOMNode(component);
        var nextButton = node.getElementsByClassName("nextButton");
        expect(nextButton).toBeDefined();
    });

    it('test next link and previous link are NOT generated', () => {
        component = TestUtils.renderIntoDocument(<ReportNavigation recordsCount={fakeReportNavigationData.noPrevAndNext.recordsCount}
                                                                   pageStart={fakeReportNavigationData.noPrevAndNext.pageStart}
                                                                   pageEnd={fakeReportNavigationData.noPrevAndNext.pageEnd}
                                                                   getPreviousReportPage={fakeReportNavigationData.noPrevAndNext.getPreviousReportPage}
                                                                   getNextReportPage={fakeReportNavigationData.noPrevAndNext.getNextReportPage}/>);
        var pageButton = TestUtils.findAllInRenderedTree(component, function(inst) {
            return TestUtils.isDOMComponent(inst) && inst.id === "previousReportPage";
        });
        expect(pageButton.length).toBe(0);
        var nextPage = TestUtils.findAllInRenderedTree(component, function(inst) {
            return TestUtils.isDOMComponent(inst) && inst.id === "nextReportPage";
        });
        expect(nextPage.length).toBe(0);
    });
    it('test navigation arrows are are not shown when records count is zero', () => {
        component = TestUtils.renderIntoDocument(<ReportNavigation recordsCount={fakeReportNavigationData.noRecords.recordsCount}
                                                                   pageStart={fakeReportNavigationData.noRecords.pageStart}
                                                                   pageEnd={fakeReportNavigationData.noRecords.pageEnd}
                                                                   getPreviousReportPage={fakeReportNavigationData.noRecords.getPreviousReportPage}
                                                                   getNextReportPage={fakeReportNavigationData.noRecords.getNextReportPage}
                                                                   reportData={fakeReportNavigationData.noRecords.reportData}/>);
        var pageButton = TestUtils.findAllInRenderedTree(component, function(inst) {
            return TestUtils.isDOMComponent(inst) && inst.id === "previousReportPage";
        });
        expect(pageButton.length).toBe(0);
        var nextPage = TestUtils.findAllInRenderedTree(component, function(inst) {
            return TestUtils.isDOMComponent(inst) && inst.id === "nextReportPage";
        });
        expect(nextPage.length).toBe(0);
    });
    it('test navigation arrows are are not shown when filtered records count is zero', () => {
        component = TestUtils.renderIntoDocument(<ReportNavigation recordsCount={fakeReportNavigationData.noFilteredRecordsReturned.recordsCount}
                                                                   pageStart={fakeReportNavigationData.noFilteredRecordsReturned.pageStart}
                                                                   pageEnd={fakeReportNavigationData.noFilteredRecordsReturned.pageEnd}
                                                                   getPreviousReportPage={fakeReportNavigationData.noFilteredRecordsReturned.getPreviousReportPage}
                                                                   getNextReportPage={fakeReportNavigationData.noFilteredRecordsReturned.getNextReportPage}
                                                                   reportData={fakeReportNavigationData.noFilteredRecordsReturned.reportData}/>);
        var pageButton = TestUtils.findAllInRenderedTree(component, function(inst) {
            return TestUtils.isDOMComponent(inst) && inst.id === "previousReportPage";
        });
        expect(pageButton.length).toBe(0);
        var nextPage = TestUtils.findAllInRenderedTree(component, function(inst) {
            return TestUtils.isDOMComponent(inst) && inst.id === "nextReportPage";
        });
        expect(nextPage.length).toBe(0);
    });

});

