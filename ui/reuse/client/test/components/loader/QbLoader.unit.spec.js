import React from "react";
import {shallow} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import QbLoader, {__RewireAPI__ as QbLoaderRewireAPI} from "../../../src/components/loader/QbLoader";
import BodyMovin from "../../../src/components/bodyMovin/bodyMovin";

let mockAnimationData = {
    "name": "Spinning Bar"
};

describe('QbLoader', () => {
    beforeEach(() => {
        jasmineEnzyme();
        QbLoaderRewireAPI.__Rewire__('QbLoaderAnimationData', mockAnimationData);
    });

    afterEach(() => {
        QbLoaderRewireAPI.__ResetDependency__('QbLoaderAnimationData');
    });

    it('shows a loader animation', () => {
        let component = shallow(<QbLoader />);

        expect(component.find(BodyMovin)).toBePresent();
        expect(component.find(BodyMovin)).toHaveProp('animationData', mockAnimationData);
    });
});
