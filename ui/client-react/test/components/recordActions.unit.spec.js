import React from 'react';
import TestUtils from 'react-addons-test-utils';
import RecordActions  from '../../src/components/actions/recordActions';

describe('RecordActions functions', () => {
    'use strict';

    let component;

    let flux = {};
    let fluxParams = {
        context: {
            flux : flux
        }
    };

    beforeEach(() => {
        component = TestUtils.renderIntoDocument(<RecordActions params={fluxParams}/>);
    });
    it('test render of component', () => {
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test extra actions', () => {
        component = TestUtils.renderIntoDocument(<RecordActions params={fluxParams}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let actions = TestUtils.scryRenderedDOMComponentsWithTag(component, "a");
        expect(actions.length).toBeGreaterThan(0);
        TestUtils.Simulate.click(actions[actions.length - 1]);
    });
});
