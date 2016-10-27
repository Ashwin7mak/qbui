import React from 'react';
import ReactDOM from 'react-dom';

import TestUtils, {Simulate} from 'react-addons-test-utils';
import Locales from '../../src/locales/locales';
import {ReportContent, __RewireAPI__ as ReportContentRewireAPI} from '../../src/components/report/dataTable/reportContent';


import ReportContentError from '../../src/components/report/dataTable/reportContentError';

var LocalesMock = {
    getLocale: function() {
        return 'en-us';
    },
    getMessage: function(message) {
        return message;
    },
    getCurrencyCode: function() {
        return 'usd';
    }
};

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
    beforeEach(() => {
        // ReportContentError.__Rewire__('Locales', LocalesMock);
    });

    afterEach(() => {
        // ReportContentError.__ResetDependency__('Locales');
    });

    it('displays when report content is in an error state', () => {
        component = TestUtils.renderIntoDocument(
            <ReportContent flux={{}} pendEdits={{}} reportData={{error: true, errorDetails: mockErrorDetails}} />
        );
        let reportErrorContent = TestUtils.findRenderedComponentWithType(component, ReportContentError);

        expect(reportErrorContent).not.toBeNull();
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

            expect(domComponent.textContent).toContain(contentTestCase.expectedContent);
        });
    });



});


