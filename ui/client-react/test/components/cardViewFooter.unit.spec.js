import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import CardViewFooter from '../../src/components/dataTable/cardView/cardViewFooter';

const fakeReportNavigationData = {
    valid: {
        pageStart: 2,
        pageEnd: 10,
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
    }
};

fdescribe('CardViewFooter Navigation tests', () => {
    'use strict';

    var component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<CardViewFooter recordsCount={fakeReportNavigationData.valid.recordsCount}
                                                                   pageStart={fakeReportNavigationData.valid.pageStart}
                                                                   pageEnd={fakeReportNavigationData.valid.pageEnd}
                                                                   getPreviousReportPage={fakeReportNavigationData.valid.getPreviousReportPage}
                                                                   getNextReportPage={fakeReportNavigationData.valid.getNextReportPage}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        var reportNavigation = ReactDOM.findDOMNode(component);
        expect(reportNavigation).toBeDefined();
    });

    it('test next button is generated', () => {
        component = TestUtils.renderIntoDocument(<CardViewFooter recordsCount={fakeReportNavigationData.valid.recordsCount}
                                                                   pageStart={fakeReportNavigationData.valid.pageStart}
                                                                   pageEnd={fakeReportNavigationData.valid.pageEnd}
                                                                   getPreviousReportPage={fakeReportNavigationData.valid.getPreviousReportPage}
                                                                   getNextReportPage={fakeReportNavigationData.valid.getNextReportPage}/>);
        var node = ReactDOM.findDOMNode(component);
        var nextPage = node.getElementsByClassName("cardViewFooter");
        expect(nextPage).toBeDefined();
    });

    it('test next button is NOT generated', () => {
        component = TestUtils.renderIntoDocument(<CardViewFooter  recordsCount={fakeReportNavigationData.noNext.recordsCount}
                                                                   pageStart={fakeReportNavigationData.noNext.pageStart}
                                                                   pageEnd={fakeReportNavigationData.noNext.pageEnd}
                                                                   getPreviousReportPage={fakeReportNavigationData.noNext.getPreviousReportPage}
                                                                   getNextReportPage={fakeReportNavigationData.noNext.getNextReportPage}/>);
        var nextPage = TestUtils.findAllInRenderedTree(component, function(inst) {
            return TestUtils.isDOMComponent(inst) && inst.id === "nextReportPage";
        });
        expect(nextPage.length).toBe(0);
    });
});

