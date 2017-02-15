import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReportStage  from '../../src/components/report/reportStage';

/* TODO: When the expand/collapse behavior is added, add related tests */

describe('Report stage functions', () => {
    'use strict';


    it('test render of component', () => {
        const reportData = {
            data: {
                name: 'My Report',
                appId: '123',
                tblId: '456',
                rptId: '789'
            }
        };
        let component = TestUtils.renderIntoDocument(<ReportStage reportData={reportData}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of description', () => {
        const reportData = {
            data: {
                name: 'My Report',
                description: "Report description",
                appId: '123',
                tblId: '456',
                rptId: '789'
            }
        };
        let component = TestUtils.renderIntoDocument(<ReportStage reportData={reportData}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let descElement = TestUtils.scryRenderedDOMComponentsWithClass(component, "stage-showHide-content");
        expect(descElement.length).toEqual(1);
        expect(descElement[0].innerHTML).toEqual(reportData.data.description);
    });

});
