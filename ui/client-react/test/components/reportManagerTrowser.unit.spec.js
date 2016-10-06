import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import ReportManagerTrowser from '../../src/components/report/reportManagerTrowser';

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

        }
    };

    let component;

    beforeEach(() => {
        ReportManagerTrowser.__Rewire__('ReportManager', ReportManagerMock);
    });

    afterEach(() => {
        ReportManagerTrowser.__ResetDependency__('ReportManager');
    });

    it('test render of loading component', () => {

        component = TestUtils.renderIntoDocument(<ReportManagerTrowser flux={flux} visible={true} />);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();


    });
});
