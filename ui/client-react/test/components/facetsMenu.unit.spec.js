import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FacetsMenu  from '../../src/components/facet/facetsMenu';
import _ from 'lodash';

describe('FacetsMenu functions', () => {
    'use strict';

    let component;
    let reportDataParams = {reportData: {loading:false}};
    const fakeReportData_valid = {
        data: {
            facets : {
                list : [{id:1, name:'test', type:"text",
                        values:[{value:"a"}, {value:"b"}, {value:"c"}]}]
            }
        }
    };

    let reportParams = {appId:1, tblId:2, rptId:3};

    it('test render FacetsMenu no facets', () => {
        component = TestUtils.renderIntoDocument(<FacetsMenu params={reportParams} reportData={reportDataParams} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render FacetsMenu', () => {
        component = TestUtils.renderIntoDocument(<FacetsMenu params={reportParams} reportData={fakeReportData_valid} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render FacetsMenu with facets open', () => {
        component = TestUtils.renderIntoDocument(<FacetsMenu params={reportParams} allInitiallyCollapsed={false} reportData={fakeReportData_valid} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render FacetsMenu click facet button', () => {
        component = TestUtils.renderIntoDocument(<FacetsMenu params={reportParams} reportData={fakeReportData_valid} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(component.state.show).toBeFalsy();
        let facetsMenuButton = TestUtils.findRenderedDOMComponentWithClass(component, "facetsMenuButton");
        TestUtils.Simulate.click(facetsMenuButton);
        expect(component.state.show).toBeTruthy();
    });

    describe('Expand/Collapse sections', () => {
        let mountPoint;

        beforeEach(() => {
            mountPoint = document.createElement('div');
            document.body.appendChild(mountPoint);
        });

        afterEach(() => {
            ReactDOM.unmountComponentAtNode(mountPoint);
            document.body.removeChild(mountPoint);
        });

        it('test render FacetsMenu click facet section expand ', () => {

            component = ReactDOM.render(<FacetsMenu params={reportParams}
                                                                    allInitiallyCollapsed={true}
                                                                    reportData={fakeReportData_valid} />
                                                        , mountPoint);
            const testContainer = ReactDOM.findDOMNode(component);
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

            let facetsMenu = component;

            // show the menu
            var facetsMenuButton = TestUtils.findRenderedDOMComponentWithClass(facetsMenu, 'facetsMenuButton');
            TestUtils.Simulate.click(facetsMenuButton);
            expect(facetsMenu.state.show).toBeTruthy();

            // make sure it rendered
            var popupLists = document.getElementsByClassName('facetMenuPopup');
            expect(popupLists.length).toBe(1);
            let popupList = popupLists[0];

            // check that tht field facet exists
            let facetPanels = popupList.getElementsByClassName('panel');
            expect(facetPanels.length).toBe(1);
            let facetPanel = facetPanels[0];

            // expand the facet panel
            component.handleToggleCollapse(null, {id:1});

            //ensure its in the expanded list
            expect(_.includes(component.state.expandedFacetFields, 1)).toBeTruthy();

            let panelCollapses = facetPanel.getElementsByClassName('panel-collapse');
            expect(panelCollapses.length).toBe(1);

            expect(panelCollapses[0].innerText).toBe('abc');
            //and not hidden
            expect(panelCollapses[0].style.height).not.toBe("0px");


        });


        it('test render FacetsMenu click facet section collapse ', () => {
            component = ReactDOM.render(<FacetsMenu params={reportParams}
                                                    allInitiallyCollapsed={true}
                                                    reportData={fakeReportData_valid} />
                , mountPoint);
            const testContainer = ReactDOM.findDOMNode(component);
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

            let facetsMenu = component;

            // show the menu
            var facetsMenuButton = TestUtils.findRenderedDOMComponentWithClass(facetsMenu, 'facetsMenuButton');
            TestUtils.Simulate.click(facetsMenuButton);
            expect(facetsMenu.state.show).toBeTruthy();

            // make sure it rendered
            var popupLists = document.getElementsByClassName('facetMenuPopup');
            expect(popupLists.length).toBe(1);
            let popupList = popupLists[0];

            // check that tht field facet exists
            let facetPanels = popupList.getElementsByClassName('panel');
            expect(facetPanels.length).toBe(1);
            let facetPanel = facetPanels[0];

            // expand the facet panel
            component.handleToggleCollapse(null, {id:1});
            // then collapse the facet panel
            component.handleToggleCollapse(null, {id:1});

            //ensure its not  the expanded list
            expect(_.includes(component.state.expandedFacetFields, 1)).toBeFalsy();

            // and not visible
            let panelCollapses = facetPanel.getElementsByClassName('panel-collapse');
            expect(panelCollapses.length).toBe(1);
            expect(panelCollapses[0].style.height).toBe("0px"); //collapsed height

        });
    });
});

