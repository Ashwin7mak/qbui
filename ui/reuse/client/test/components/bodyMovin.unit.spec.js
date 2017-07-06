import React from "react";
import ReactDOM from "react-dom";
import {shallow} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import BodyMovin from "../../src/components/bodyMovin/bodyMovin";

describe('BodyMovin', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    fit('has the correct ref', () => {
        const wrapper = mount(<BodyMovin />);
        expect(wrapper.getDOMNode()).to.have.property('ref');
    })
});
