import React from "react";
import {mount} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import BodyMovin, {__RewireAPI__ as BodyMovinRewireAPI} from "../../src/components/bodyMovin/bodyMovin";

describe('BodyMovin', () => {
    let bodyMovinMock;

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

    it('mounts to the dom', () => {
        let component = mount(<BodyMovin />);
        expect(bodyMovinMock.loadAnimation).toHaveBeenCalled();
    });

    it('unmounts from dom', () => {
        let component = mount(<BodyMovin />);
        component.unmount();
        expect(bodyMovinMock.destroy).toHaveBeenCalled();
    });
});
