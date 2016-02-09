import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import {FacetsMenu}  from '../../src/components/facet/facetsMenu';

describe('FacetsMenu functions', () => {
    'use strict';

    let component;
    let reportDataParams = {reportData: {loading:false}};
    const fakeReportData_valid = {
        data: {
            facets : {
                list : [{id:1, name:'test', values:["A", "B", "C"]}]
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
    //TODO

});

