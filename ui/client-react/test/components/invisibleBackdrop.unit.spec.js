import React from 'react';
import TestUtils from 'react-addons-test-utils';
import InvisibleBackdrop  from '../../src/components/qbModal/invisibleBackdrop';

describe('InvisibleBackdrop functions', () => {
    'use strict';

    let component;


    it('test render of component hidden', () => {
        component = TestUtils.renderIntoDocument(<InvisibleBackdrop show={false} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render of component shown', () => {
        component = TestUtils.renderIntoDocument(<InvisibleBackdrop show={true} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });
});
