import React from 'react';
import TestUtils from 'react-addons-test-utils';
import AppsRoute  from '../../src/components/apps/appsRoute';

//TODO this is a placeholder file to add tests as apps home page gets built out

describe('AppsRoute functions', () => {
    'use strict';

    let component;
    let flux = {
    };
    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<AppsRoute flux={flux}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

});
