import Fluxxor from 'fluxxor';
import React from 'react/addons';
import TableHomePage  from '../../src/components/table/tableHomePageRoute';

//TODO this is a placeholder file to add tests as table home page gets built out
var TestUtils = React.addons.TestUtils;

describe('TableHomePage functions', () => {
    'use strict';

    let component;
    let flux = {}

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<TableHomePage flux={flux}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

});
