import React from 'react';
import ReactDOM from 'react-dom';

import TestUtils, {Simulate} from 'react-addons-test-utils';
import {ReportContent, __RewireAPI__ as ReportContentRewireAPI} from '../../src/components/report/dataTable/reportContent';


import ReportContentError from '../../src/components/report/dataTable/reportContentError';

let mockErrorDetails = {
    tid: '1234',
    sid: '5678',
    errorMessages: [
        {code: 1, message: 'There was a big problems'}
    ]
};

let component;
let domComponent;

describe('ReportContentError', () => {
    it('displays when report content is in an error state', () => {
        component = TestUtils.renderIntoDocument(
            <ReportContent flux={{}} pendEdits={{}} reportData={{error: true, errorDetails: mockErrorDetails}} />
        );
        let reportErrorContent = TestUtils.findRenderedComponentWithType(component, ReportContentError);

        expect(reportErrorContent).not.toBeNull();
    });

    it('plays the errorGraphic when the errorGraphic image is clicked', () => {
        component = TestUtils.renderIntoDocument(<ReportContentError errorDetails={mockErrorDetails} />);

        let showMeGraphic = ReactDOM.findDOMNode(component).querySelector('.errorImage');

        Simulate.click(showMeGraphic);

        expect(component.state.playingErrorGraphic).toBeTruthy();
        expect(showMeGraphic.classList).toContain('errorImage--animation');
    });

    it('stops the errorGraphic when the errorGraphic image is clicked', () => {
        component = TestUtils.renderIntoDocument(<ReportContentError errorDetails={mockErrorDetails} />);
        component.setState({playingErrorGraphic: true});

        let showMeGraphic = ReactDOM.findDOMNode(component).querySelector('.errorImage');

        Simulate.click(showMeGraphic);

        expect(component.state.playingErrorGraphic).toBeFalsy();
        expect(showMeGraphic.classList).toContain('errorImage--still');
    });

    it('plays the errorGraphic when the space bar is pressed while focused on the errorGraphic image', () => {
        component = TestUtils.renderIntoDocument(<ReportContentError errorDetails={mockErrorDetails} />);

        let showMeGraphic = ReactDOM.findDOMNode(component).querySelector('.errorImage');

        Simulate.keyDown(showMeGraphic, {
            keyCode: 32
        });

        expect(component.state.playingErrorGraphic).toBeTruthy();
        expect(showMeGraphic.classList).toContain('errorImage--animation');
    });

    let contentTestCases = [
        {
            description: 'shows the transaction ID (tid)',
            expectedContent: mockErrorDetails.tid
        },
        {
            description: 'shows the SID',
            expectedContent: mockErrorDetails.sid
        }
    ];

    contentTestCases.forEach(contentTestCase => {
        it(contentTestCase.description, () => {
            component = TestUtils.renderIntoDocument(<ReportContentError errorDetails={mockErrorDetails} />);
            domComponent = ReactDOM.findDOMNode(component);

            let toggleSupportInfoButton = domComponent.querySelector('.toggleSupportInfoBtn');

            Simulate.click(toggleSupportInfoButton);

            expect(domComponent.textContent).toContain(contentTestCase.expectedContent);
        });
    });
});


