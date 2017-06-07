import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import {ReportManagerTrowser, __RewireAPI__ as ReportManagerTrowserRewireAPI} from '../../src/components/report/reportManagerTrowser';

const ReportManagerMock = React.createClass({
    render: function() {
        return (
            <div className="reportManager">test</div>
        );
    }
});

describe('ReportManagerTrowser functions', () => {
    'use strict';

    let flux = {
        actions: {
            hideTrowser() {}
        }
    };

    let props = {
        filterReportsByName : () => {}
    };


    let component;

    beforeEach(() => {
        ReportManagerTrowserRewireAPI.__Rewire__('ReportManager', ReportManagerMock);

        spyOn(props, 'filterReportsByName');
    });

    afterEach(() => {
        ReportManagerTrowserRewireAPI.__ResetDependency__('ReportManager');

        props.filterReportsByName.calls.reset();
    });

    it('test render of loading component', () => {

        const table = {
            name: "tableName",
            icon: "iconName"
        };
        component = TestUtils.renderIntoDocument(<ReportManagerTrowser {...props} selectedTable={table} visible={true} />);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

    });

    it('test cancelling the report manager trowser', () => {

        component = TestUtils.renderIntoDocument(<ReportManagerTrowser {...props} visible={true} onHideTrowser={()=>{}}/>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const closeIcon = TestUtils.findRenderedDOMComponentWithClass(component, "iconUISturdy-close");
        TestUtils.Simulate.click(closeIcon);

        expect(props.filterReportsByName).toHaveBeenCalledWith("");
    });
});
