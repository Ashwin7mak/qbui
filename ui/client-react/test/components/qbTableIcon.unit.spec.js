import React from 'react';
import TestUtils from 'react-addons-test-utils';
import TableIcon  from '../../src/components/qbTableIcon/qbTableIcon';

describe('TableIcon functions', () => {
    'use strict';

    let component;


    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<TableIcon icon="dots" />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });
});
