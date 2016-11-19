import React from 'react';
import TestUtils from 'react-addons-test-utils';

import PageTitle from '../../src/components/pageTitle/pageTitle';
import HtmlUtils from '../../src/utils/htmlUtils';
import BaseService from '../../src/services/baseService';
import Locale from '../../src/locales/locales';
import {DEFAULT_PAGE_TITLE, NEW_RECORD_VALUE} from '../../src/constants/urlConstants';

let component;
let testRealm = 'Astley';

describe('PageTitle', () => {
    beforeEach(() => {
        spyOn(HtmlUtils, 'updatePageTitle');
        spyOn(BaseService.prototype, 'getSubdomain').and.returnValue(testRealm);
    });

    function generateTestTitle(titles) {
        let titleArray = titles;
        if (!Array.isArray(titles)) {
            titleArray = [titles];
        }

        titleArray.push(DEFAULT_PAGE_TITLE);
        return titleArray.join(Locale.getMessage('pageTitles.pageTitleSeparator'));
    }

    let testTitle = 'Never gonna give you up';
    let mockApp = {name: 'Never gonna let you down'};
    let mockTable = {name: 'Never gonna run around'};
    let mockReport = {name: 'And desert you'};
    let mockRecordId = '1987';

    let testCases = [
        {
            description: 'updates the page title to the provided title string',
            title: testTitle,
            app: null,
            table: null,
            report: null,
            recordId: null,
            expectedTitles: testTitle
        },
        {
            description: 'overrides detecting title based on context if a title is explicitly provided',
            title: testTitle,
            app: mockApp,
            table: null,
            report: null,
            recordId: null,
            expectedTitles: testTitle
        },
        {
            description: 'displays the realm name in the page title if no context detected and no title provided',
            title: null,
            app: null,
            table: null,
            report: null,
            recordId: null,
            expectedTitles: testRealm
        },
        {
            description: 'displays the app name if an app has been selected',
            title: null,
            app: mockApp,
            table: null,
            report: null,
            recordId: null,
            expectedTitles: mockApp.name
        },
        {
            description: 'displays the table name if a table has been selected',
            title: null,
            app: null,
            table: mockTable,
            report: null,
            recordId: null,
            expectedTitles: mockTable.name
        },
        {
            description: 'displays the report name if a report has been selected',
            title: null,
            app: null,
            table: null,
            report: mockReport,
            recordId: null,
            expectedTitles: mockReport.name
        },
        {
            description: 'displays a message about editing a specific record if a record ID has been provided',
            title: null,
            app: null,
            table: null,
            report: null,
            recordId: mockRecordId,
            expectedTitles: Locale.getMessage('pageTitles.editingRecord', {recordId: mockRecordId})
        },
        {
            description: 'displays a message about adding a record if the record ID is new',
            title: null,
            app: null,
            table: null,
            report: null,
            recordId: NEW_RECORD_VALUE,
            expectedTitles: Locale.getMessage('pageTitles.newRecord')
        },
        {
            description: 'creates title that goes from most to least specific (record - report - table - app)',
            title: null,
            app: mockApp,
            table: mockTable,
            report: mockReport,
            recordId: mockRecordId,
            expectedTitles: [
                Locale.getMessage('pageTitles.editingRecord', {recordId: mockRecordId}),
                mockReport.name,
                mockTable.name,
                mockApp.name
            ]
        },
    ];

    testCases.forEach(testCase => {
        it(testCase.description, () => {
            component = TestUtils.renderIntoDocument(
                <PageTitle
                    title={testCase.title}
                    app={testCase.app}
                    table={testCase.table}
                    report={testCase.report}
                    recordId={testCase.recordId}
                />
            );

            expect(HtmlUtils.updatePageTitle).toHaveBeenCalledWith(generateTestTitle(testCase.expectedTitles));
        });
    });
});
