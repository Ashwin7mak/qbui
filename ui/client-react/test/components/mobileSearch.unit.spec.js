import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import MobileSearchBar  from '../../src/components/search/mobileSearchBar';


let flux = {
    actions:{
        setSearching: function() { },
        searchFor: function() { }
    }
};

describe('Mobile search functions', () => {
    'use strict';

    var component;

    beforeEach(() => {
        spyOn(flux.actions, 'setSearching');
        spyOn(flux.actions, 'searchFor');
    });

    afterEach(() => {
        flux.actions.setSearching.calls.reset();
        flux.actions.searchFor.calls.reset();
    });

    it('test render of open mobile search', () => {

        let searching = false;

        var div = document.createElement('div');
        component = ReactDOM.render(<MobileSearchBar  searching={searching} flux={flux} />, div);

        var input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
        expect(input).toBeDefined();

        TestUtils.Simulate.focus(input);
        expect(flux.actions.setSearching).toHaveBeenCalledWith(true);
    });

    it('test render of open active mobile search', () => {

        let searching = true;

        var div = document.createElement('div');
        component = ReactDOM.render(<MobileSearchBar searching={searching} flux={flux} />, div);

        var input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
        expect(input).toBeDefined();

        TestUtils.Simulate.change(input, {target: {value:'abc'}});
        expect(flux.actions.searchFor).toHaveBeenCalledWith('abc');

        var cancel = TestUtils.findRenderedDOMComponentWithClass(component, 'cancel');
        expect(cancel).toBeDefined();
        TestUtils.Simulate.click(cancel);
        expect(flux.actions.setSearching).toHaveBeenCalledWith(false);
        expect(flux.actions.searchFor).toHaveBeenCalledWith('');

        TestUtils.Simulate.blur(input);
        expect(flux.actions.setSearching).toHaveBeenCalledWith(false);
    });
});
