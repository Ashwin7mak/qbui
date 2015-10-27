import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReportStage  from '../../src/components/report/dataTable/stage';
//import I18nMessage from '../../src/utils/i18nMessage';

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
        component = TestUtils.renderIntoDocument(<ReportStage reportName={"appheader"}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let header = TestUtils.scryRenderedDOMComponentsWithClass(component, "header");
        expect(header.length).toEqual(2);
        expect(header[0].textContent).toEqual("appheader");
    });

});
