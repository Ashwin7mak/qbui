import React from "react";
import {shallow} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import QBLoader, {__RewireAPI__ as QBLoaderRewireAPI} from "../../../src/components/loader/QBLoader";
import BodyMovin from "../../../src/components/bodyMovin/bodyMovin";

let mockAnimationData = {
    "name": "Spinning Bar"
};

describe('QBLoader', () => {
    beforeEach(() => {
        jasmineEnzyme();
        QBLoaderRewireAPI.__Rewire__('QBLoaderJSON', mockAnimationData);
    });

    afterEach(() => {
        QBLoaderRewireAPI.__ResetDependency__('QBLoaderJSON');
    });

    it('shows a loader animation', () => {
        let component = shallow(<QBLoader />);

        expect(component.find(BodyMovin)).toBePresent();
        expect(component.find(BodyMovin)).toHaveProp('animationData', mockAnimationData);
    });
});
