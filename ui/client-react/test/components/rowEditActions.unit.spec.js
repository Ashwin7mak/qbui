import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import RowEditActions from '../../src/components/dataTable/agGrid/rowEditActions';

fdescribe('RowEditActions', () => {
    let component;
    let renderedComponent;

    it('should render without errors', () => {
        component = TestUtils.renderIntoDocument(<RowEditActions />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });
});
