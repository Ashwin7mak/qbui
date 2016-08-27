import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import CardViewFooter from '../../src/components/dataTable/cardView/cardViewFooter';

const fakeData = {
    valid: {
        getPreviousReportPage: null
    }
};

describe('CardViewFooter element render tests', () => {
    'use strict';

    var component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<CardViewFooter getPreviousReportPage={fakeData.valid.getPreviousReportPage}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        var parentDiv = ReactDOM.findDOMNode(component);

        // Test render of footer div
        var footerDiv  = parentDiv.getElementsByClassName("cardViewFooter");
        expect(footerDiv).toBeDefined();

        // Test render of fetch next button
        var buttonDiv = parentDiv.getElementsByClassName("fetchNextButton");
        expect(buttonDiv).toBeDefined();

        // Test render of fetch next arrow
        var fetchNextArrow = parentDiv.getElementsByClassName("fetchNextArrow");
        expect(fetchNextArrow).toBeDefined();

        // Test render of loading indicator
        var loadingIndicator = parentDiv.getElementsByClassName("footerLoadingIndicator");
        expect(loadingIndicator).toBeDefined();
    });
});

