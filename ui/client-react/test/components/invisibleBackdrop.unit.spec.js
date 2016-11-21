import React from 'react';

import TestUtils from 'react-addons-test-utils';
import InvisibleBackdrop  from '../../src/components/qbModal/invisibleBackdrop';

describe('InvisibleBackdrop functions', () => {
    'use strict';
    let component;

    it('test render of component not show', () => {

        component = TestUtils.renderIntoDocument(<InvisibleBackdrop show={false} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        var componentDom = document.querySelector('.invisibleBackdropModal-dialog');
        expect(componentDom).toBeNull();

        var link = document.querySelector('.invisibleLink');
        expect(link).toBeNull();

    });

    it('test render of component shown', () => {

        component = TestUtils.renderIntoDocument(<InvisibleBackdrop show={true} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        var componentDom = document.querySelector('.invisibleBackdropModal-dialog');
        expect(componentDom).not.toBeNull();

        var link = document.querySelector('.invisibleLink');
        expect(link).not.toBeNull();

    });

});
