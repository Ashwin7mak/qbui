import React from "react";
import {shallow, mount} from "enzyme";
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
        QbLoaderRewireAPI.__Rewire__('BodyMovin', (props) => <div className={props.className}></div>);
    });

    afterEach(() => {
        QbLoaderRewireAPI.__ResetDependency__('QbLoaderAnimationData');
        QbLoaderRewireAPI.__ResetDependency__('BodyMovin');
    });

    it('does not show a loader animation when isLoading is false', () => {
        let component = shallow(<QbLoader isLoading={false}/>);

        expect(component.find(BodyMovin)).not.toBePresent();
    });

    it('renders children when isLoading is false', () => {
        let component = shallow(
            <QbLoader isLoading={true} >
                <div className="children"></div>
                <div className="children"></div>
            </QbLoader>);

        expect(component.find('.children')).toBePresent();
    });

    it('gets fired after a certain time', (done) => {

        let component = mount(<QbLoader isLoading={true} waitTime={1}/>);

        expect(component.find('.visible')).not.toBePresent();
        setTimeout(() => {
            expect(component.find('.visible')).toBePresent();
            done();
        }, 1);
    });

    it('clears the timeout on unmount', () => {
        spyOn(window, 'clearTimeout').and.callThrough();

        let component = mount(<QbLoader isLoading={true} waitTime={1500} />);

        component.unmount();
        expect(window.clearTimeout).toHaveBeenCalled();
    });
});
