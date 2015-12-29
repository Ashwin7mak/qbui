import React from 'react';
import TestUtils from 'react-addons-test-utils';
import EmailReportLink  from '../../src/components/actions/emailReportLink';

describe('EmailReportLink functions', () => {
    'use strict';

    let component;


    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<EmailReportLink />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });
});
