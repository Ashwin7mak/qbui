import React from 'react';

import ReactDOM from 'react-dom';
import SortAndGroup  from '../../src/components/sortGroup/sortAndGroup';

import TestUtils from 'react-addons-test-utils';


describe('SortAndGroup functions', () => {
    'use strict';

    var component;
    let flux = {
    };

    it('test render of visible SortAndGroup', () => {
        component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux} visible={true}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of not visible SortAndGroup', () => {
        component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux} visible={false} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

});
