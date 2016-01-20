import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FacetsMenuButton  from '../../src/components/facet/facetsMenuButton';

describe('FacetsMenuButton functions', () => {
    'use strict';

    let component;
    let reportDataParams = {reportData: {loading:false}};
    const fakeReportData_valid = {
        data: {
            facets : {
                list : [{fid:1, name:'test', values:["A", "B", "C"]}]
            }
        }
    };
    let reportParams = {appId:1, tblId:2, rptId:3};

    it('test render FacetsMenuButton no facets', () => {
        component = TestUtils.renderIntoDocument(<FacetsMenuButton params={reportParams} reportData={reportDataParams} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render FacetsMenuButton', () => {
        component = TestUtils.renderIntoDocument(<FacetsMenuButton params={reportParams} reportData={fakeReportData_valid} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });
    //TODO

});

