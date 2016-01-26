import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReportStage  from '../../src/components/report/reportStage';

var I18nMessageMock = React.createClass({
    render: function() {
        return (
            <div>test</div>
        );
    }
});

/* TODO: When the expand/collapse behavior is added, add related tests */

describe('Report stage functions', () => {
    'use strict';

    let component;

    beforeEach(() => {
        ReportStage.__Rewire__('I18nMessage', I18nMessageMock);
    });

    afterEach(() => {
        ReportStage.__ResetDependency__('I18nMessage');
    });

    it('test render of component', () => {
        const reportData = {
            data: {
                name: 'My Report',
                appId: '123',
                tblId: '456',
                rptId: '789'
            }
        };
        component = TestUtils.renderIntoDocument(<ReportStage reportData={reportData}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let header = TestUtils.scryRenderedDOMComponentsWithClass(component, "header");
        expect(header.length).toEqual(2);
        expect(header[0].textContent).toEqual("My Report");
    });

});
