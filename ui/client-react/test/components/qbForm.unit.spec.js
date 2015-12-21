import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import QBForm from '../../src/components/QBForm/qbform.js';

const fakeQBFormData = {
    data: {
        activeTab: "0"
    }
};

describe('qbForm functions', () => {
    'use strict';

    var component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<QBForm activeTab={fakeQBFormData.data.activeTab}></QBForm>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        var qbForm = ReactDOM.findDOMNode(component);
        expect(qbForm).toBeDefined();
    });
});
