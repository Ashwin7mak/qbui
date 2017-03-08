import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import AutoScroll from '../../../client-react/src/components/autoScroll/autoScroll';

let container = {
    offsetWidth: 50,
    offsetLeft: 50,
    offsetHeight: 50,
    offsetTop: 10
};

describe('AutoScroll', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    describe('for desktop', () => {

        it('should call scrollUp when the mouse is in the top scroll zone', function() {

            let e = {
                clientX: 55,
                clientY: 0
            };

            let component = shallow(<AutoScroll/>);
            let instance = component.instance();

            spyOn(window, 'requestAnimationFrame');
            spyOn(instance, 'getContainer').and.returnValue(container);
            spyOn(instance, 'stopScrolling');

            instance.updateMouseLocation(e);
            instance.updateScrolling();

            expect(window.requestAnimationFrame).toHaveBeenCalledWith(instance.scrollUp);
        });

        it('should call scrollDown when the mouse is in the bottom scroll zone', function() {

            let e = {
                clientX: 55,
                clientY: 100
            };

            let component = shallow(<AutoScroll/>);
            let instance = component.instance();

            spyOn(window, 'requestAnimationFrame');
            spyOn(instance, 'getContainer').and.returnValue(container);
            spyOn(instance, 'stopScrolling');

            instance.updateMouseLocation(e);
            instance.updateScrolling();

            expect(window.requestAnimationFrame).toHaveBeenCalledWith(instance.scrollDown);
        });

        it('should call stopScrolling when the mouse is not in a scroll zone', function() {

            let e = {
                clientX: 45,
                clientY: 50
            };

            let component = shallow(<AutoScroll/>);
            let instance = component.instance();

            spyOn(window, 'requestAnimationFrame');
            spyOn(instance, 'getContainer').and.returnValue(container);
            spyOn(instance, 'stopScrolling');

            instance.updateMouseLocation(e);
            instance.updateScrolling();

            expect(instance.stopScrolling.calls.count()).toBe(2);
        });

        it('should add extra pixels to the top of the container scroll zone when pixelsFromTopForLargeDevices prop is passed through', function() {

            let component = shallow(<AutoScroll pixelsFromTopForLargeDevices={5}/>);
            let instance = component.instance();

            spyOn(instance, 'getContainer').and.returnValue(container);
            spyOn(instance, 'getContainerTop');

            instance.updateScrolling();

            expect(instance.getContainerTop).toHaveBeenCalled();
        });

        it('should add extra pixels to the bottom of the container scroll zone when pixelsFromBottomForLargeDevices prop is passed through', function() {

            let component = shallow(<AutoScroll pixelsFromBottomForLargeDevices={5}/>);
            let instance = component.instance();

            spyOn(instance, 'getContainer').and.returnValue(container);
            spyOn(instance, 'getContainerBottom');

            instance.updateScrolling();

            expect(instance.getContainerBottom).toHaveBeenCalled();
        });
    });

    describe('for touch devices', () => {

        it('should call scrollUp when touch is in the top scroll zone', function() {

            let e = {
                type: 'touchmove',
                touches: [{clientY: 0, clientX: 55}]
            };

            let component = shallow(<AutoScroll/>);
            let instance = component.instance();

            spyOn(window, 'requestAnimationFrame');
            spyOn(instance, 'getContainer').and.returnValue(container);
            spyOn(instance, 'stopScrolling');

            instance.updateScrolling(e);

            expect(window.requestAnimationFrame).toHaveBeenCalledWith(instance.scrollUp);
        });

        it('should call scrollDown when touch is in the bottom scroll zone', function() {

            let e = {
                type: 'touchmove',
                touches: [{clientY: 100, clientX: 55}]
            };

            let component = shallow(<AutoScroll/>);
            let instance = component.instance();

            spyOn(window, 'requestAnimationFrame');
            spyOn(instance, 'getContainer').and.returnValue(container);
            spyOn(instance, 'stopScrolling');

            instance.updateScrolling(e);

            expect(window.requestAnimationFrame).toHaveBeenCalledWith(instance.scrollDown);
        });

        it('should call stopScrolling when touch is not in a scroll zone', function() {

            let e = {
                type: 'touchmove',
                touches: [{clientY: 50, clientX: 45}]
            };

            let component = shallow(<AutoScroll/>);
            let instance = component.instance();

            spyOn(window, 'requestAnimationFrame');
            spyOn(instance, 'getContainer').and.returnValue(container);
            spyOn(instance, 'stopScrolling');

            instance.updateScrolling(e);

            expect(instance.stopScrolling.calls.count()).toBe(2);
        });

        it('should add extra pixels to the top of the container scroll zone when pixelsFromTopForMobile prop is passed through', function() {

            let component = shallow(<AutoScroll pixelsFromTopForMobile={5}/>);
            let instance = component.instance();

            spyOn(instance, 'getContainer').and.returnValue(container);
            spyOn(instance, 'getContainerTop');

            instance.updateScrolling();

            expect(instance.getContainerTop).toHaveBeenCalled();
        });

        it('should add extra pixels to the bottom of the container scroll zone when pixelsFromBottomForMobile prop is passed through', function() {

            let component = shallow(<AutoScroll pixelsFromBottomForMobile={5}/>);
            let instance = component.instance();

            spyOn(instance, 'getContainer').and.returnValue(container);
            spyOn(instance, 'getContainerBottom');

            instance.updateScrolling();

            expect(instance.getContainerBottom).toHaveBeenCalled();
        });
    });
});
