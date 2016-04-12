import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FilterSearchBox  from '../../src/components/facet/filterSearchBox';
import Store from '../../src/stores/reportDataSearchStore';
import * as actions from '../../src/constants/actions';
import Fluxxor from 'fluxxor';

describe('facetSearchBox functions', () => {
    'use strict';
    let stores = {
        ReportDataSearchStore:  new Store()
    };

    let flux = new Fluxxor.Flux(stores);
    let component;

    beforeEach(() => {
        flux.store('ReportDataSearchStore').initInput();
    });

    it('test render FilterSearchBox', () => {
        component = TestUtils.renderIntoDocument(<FilterSearchBox flux={flux} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });
});

