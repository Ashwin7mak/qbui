import React from 'react';
import TestUtils from 'react-addons-test-utils';
import PageTitle from 'REUSE/components/pageTitle/pageTitle';

import Locale from 'REUSE/locales/locale';

// TEMPORARY IMPORTS FROM CLIENT-REACT
import HtmlUtils from 'APP/utils/htmlUtils';
import WindowLocationUtils from 'APP/utils/windowLocationUtils';
import {DEFAULT_PAGE_TITLE} from 'APP/constants/urlConstants';
// TEMPORARY IMPORTS FROM CLIENT-REACT

let component;
let testRealm = 'NinjaTurtles';

describe('PageTitle', () => {
    beforeEach(() => {
        spyOn(HtmlUtils, 'updatePageTitle');
        spyOn(WindowLocationUtils, 'getHostname').and.returnValue(testRealm);
    });

    function generateTestTitle(titles) {
        let titleArray = titles;
        if (!Array.isArray(titles)) {
            titleArray = [titles];
        }

        titleArray.push(DEFAULT_PAGE_TITLE);
        return titleArray.join(Locale.getMessage('pageTitles.pageTitleSeparator'));
    }

    let testTitle = 'Raphael';

    let testCases = [
        {
            description: 'updates the page title to the provided title string',
            title: testTitle,
            expectedTitles: testTitle
        },
        {
            description: 'displays the realm name in the page title if no title provided',
            expectedTitles: testRealm
        }
    ];

    testCases.forEach(testCase => {
        it(testCase.description, () => {
            component = TestUtils.renderIntoDocument(<PageTitle title={testCase.title} />);

            expect(HtmlUtils.updatePageTitle).toHaveBeenCalledWith(generateTestTitle(testCase.expectedTitles));
        });
    });
});
