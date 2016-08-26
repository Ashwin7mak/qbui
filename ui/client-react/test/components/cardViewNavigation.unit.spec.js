import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import CardViewNavigation from '../../src/components/dataTable/cardView/cardViewNavigation';

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
    }
};

fdescribe('CardViewNavigation tests', () => {
    'use strict';

    var component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<CardViewNavigation recordsCount={fakeReportNavigationData.valid.recordsCount}
                                                                     pageStart={fakeReportNavigationData.valid.pageStart}
                                                                     pageEnd={fakeReportNavigationData.valid.pageEnd}
                                                                     getPreviousReportPage={fakeReportNavigationData.valid.getPreviousReportPage}
                                                                     getNextReportPage={fakeReportNavigationData.valid.getNextReportPage}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        var reportNavigation = ReactDOM.findDOMNode(component);
        expect(reportNavigation).toBeDefined();
    });

    it('test previous link is generated', () => {
        component = TestUtils.renderIntoDocument(<CardViewNavigation recordsCount={fakeReportNavigationData.valid.recordsCount}
                                                                   pageStart={fakeReportNavigationData.valid.pageStart}
                                                                   pageEnd={fakeReportNavigationData.valid.pageEnd}
                                                                   getPreviousReportPage={fakeReportNavigationData.valid.getPreviousReportPage}
                                                                   getNextReportPage={fakeReportNavigationData.valid.getNextReportPage}/>);
        var node = ReactDOM.findDOMNode(component);
        var previousButton = node.getElementsByClassName("cardViewHeader");
        expect(previousButton).toBeDefined();
    });

    it('test previous link is NOT generated', () => {
        component = TestUtils.renderIntoDocument(<CardViewNavigation recordsCount={fakeReportNavigationData.noPrevious.recordsCount}
                                                                   pageStart={fakeReportNavigationData.noPrevious.pageStart}
                                                                   pageEnd={fakeReportNavigationData.noPrevious.pageEnd}
                                                                   getPreviousReportPage={fakeReportNavigationData.noPrevious.getPreviousReportPage}
                                                                   getNextReportPage={fakeReportNavigationData.noPrevious.getNextReportPage}/>);
        var previousPage = TestUtils.findAllInRenderedTree(component, function(inst) {
            return TestUtils.isDOMComponent(inst) && inst.id === "previousReportPage";
        });
        expect(previousPage.length).toBe(0);
    });
});

