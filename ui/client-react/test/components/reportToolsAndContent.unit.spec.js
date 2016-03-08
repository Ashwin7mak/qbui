import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReportToolsAndContent  from '../../src/components/report/reportToolsAndContent';


describe('ReportToolsAndContent functions', () => {
    'use strict';

    let component;
    let flux = {
    };
    let reportData = {

    };

    var ReportContentMock = React.createClass({
        render: function() {
            return (
                <div>ReportContentMock</div>
            );
        }
    });

    beforeEach(() => {
        ReportToolsAndContent.__Rewire__('ReportContent', ReportContentMock);
    });

    afterEach(() => {
        ReportToolsAndContent.__ResetDependency__('ReportContent', ReportContentMock);
    });

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<ReportToolsAndContent flux={flux} reportData={reportData}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


});
