import React from 'react';
import TestUtils from 'react-addons-test-utils';
import RecordActions  from '../../src/components/actions/recordActions';

fdescribe('RecordActions functions', () => {
    'use strict';

    let component;
    let flux = {
        actions:{
            deleteRecord: function() {return;}
        }
    };

    beforeEach(() => {
        spyOn(flux.actions, 'deleteRecord');
    });

    afterEach(() => {
        flux.actions.deleteRecord.calls.reset();
    });

    beforeEach(() => {
        component = TestUtils.renderIntoDocument(<RecordActions flux={flux}/>);
    });

    it('test render of component', () => {
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test extra actions', () => {
        component = TestUtils.renderIntoDocument(<RecordActions flux={flux}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let actions = TestUtils.scryRenderedDOMComponentsWithTag(component, "a");
        expect(actions.length).toBeGreaterThan(0);
        TestUtils.Simulate.click(actions[actions.length - 1]);
    });
});
