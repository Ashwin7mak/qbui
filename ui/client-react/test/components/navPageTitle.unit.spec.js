import React from 'react';
import TestUtils from 'react-addons-test-utils';

import NavPageTitle from '../../src/components/pageTitle/navPageTitle';
import HtmlUtils from '../../src/utils/htmlUtils';
import BaseService from '../../src/services/baseService';
import Locale from '../../src/locales/locales';
import {DEFAULT_PAGE_TITLE, NEW_RECORD_VALUE} from '../../src/constants/urlConstants';

let component;
let testRealm = 'Astley';

describe('NavPageTitle', () => {
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

    let mockApp = {name: 'Never gonna let you down'};
    let mockTable = {name: 'Never gonna run around'};
    let mockReport = {name: 'And desert you'};
    let mockRecordId = '1987';

    let testCases = [
        {
            description: 'displays the app name if an app has been selected',
            app: mockApp,
            table: null,
            report: null,
            recordId: null,
            expectedTitles: mockApp.name
        },
        {
            description: 'displays the table name if a table has been selected',
            app: null,
            table: mockTable,
            report: null,
            recordId: null,
            expectedTitles: mockTable.name
        },
        {
            description: 'displays the report name if a report has been selected',
            app: null,
            table: null,
            report: mockReport,
            recordId: null,
            expectedTitles: mockReport.name
        },
        {
            description: 'displays a message about editing a specific record if a record ID has been provided',
            app: null,
            table: null,
            report: null,
            recordId: mockRecordId,
            expectedTitles: Locale.getMessage('pageTitles.editingRecord', {recordId: mockRecordId})
        },
        {
            description: 'displays a message about adding a record if the record ID is new',
            app: null,
            table: null,
            report: null,
            recordId: NEW_RECORD_VALUE,
            expectedTitles: Locale.getMessage('pageTitles.newRecord')
        },
        {
            description: 'creates title that goes from most to least specific (record - report - table - app)',
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
                <NavPageTitle
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
