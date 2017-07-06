import React from "react";
import {shallow} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import QBLoader from "../../../../src/common/grid/loader/QBLoader";
import BodyMovin from "../../../../../reuse/client/src/components/bodyMovin/bodyMovin";

describe('QBLoader', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    let mockAnimationData = {
        "name": "Spinning Bar"
    };

    it('renders bodyMovin component', () => {
        let component = shallow(<QBLoader />);

        expect(component.find(BodyMovin)).toBePresent();
    });

    fit('passes correct prop to BodyMovin component', () => {
        let component = shallow(<QBLoader />);

        expect(component.find(BodyMovin)).toHaveProp('animationData', mockAnimationData);
    });
});
