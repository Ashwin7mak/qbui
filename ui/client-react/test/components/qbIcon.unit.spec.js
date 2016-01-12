import React from 'react';
import TestUtils from 'react-addons-test-utils';
import QBicon  from '../../src/components/qbIcon/qbIcon';

describe('QBicon functions', () => {
    'use strict';

    let component;


    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<QBicon icon="pencil" />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });
});
