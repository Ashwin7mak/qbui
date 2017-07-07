import React from "react";
import {mount} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import BodyMovin, {__RewireAPI__ as BodyMovinRewireAPI} from "../../src/components/bodyMovin/bodyMovin";

describe('BodyMovin', () => {
    let bodyMovinMock;
    let mockAnimationData = { container: "bodyMovinRef", renderer: 'svg', loop: true, autoplay: true, animationData: 'mockAnimationData' };

    beforeEach(() => {
        jasmineEnzyme();

        bodyMovinMock = {
            loadAnimation: jasmine.createSpy('loadAnimation'),
            destroy: jasmine.createSpy('destroy')
        };

        BodyMovinRewireAPI.__Rewire__('bodymovin', bodyMovinMock);
    });

    afterEach(() => {
        BodyMovinRewireAPI.__ResetDependency__('bodymovin');
    });

    fit('loads the animation when the component mounts', () => {
        let component = mount(<BodyMovin animationData="mockAnimationData" />);

        let testComponent = component;
        debugger;

        expect(bodyMovinMock.loadAnimation).toHaveBeenCalledWith(mockAnimationData);
        expect(component.getDOMNode()).to.have.property('ref');
    });

    it('removes the bodymovin animation from the dom', () => {
        let component = mount(<BodyMovin />);
        component.unmount();
        expect(bodyMovinMock.destroy).toHaveBeenCalled();
    });
});
