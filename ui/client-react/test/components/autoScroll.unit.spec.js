import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import AutoScroll from '../../../client-react/src/components/autoScroll/autoScroll';

let container = {
    containerBottom: 50,
    containerTop: 10
};

let mockParentContainer = <div></div>;
let mockGetBoundingClientRect = {
    getBoundingClientRect() {return container;}
};

describe('AutoScroll', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    describe('for desktop', () => {

        it('should call scrollUp when the mouse is in the top scroll zone', function() {

            let e = {
                clientY: 0
            };

            let component = shallow(<AutoScroll parentContainer={mockParentContainer} />);
            let instance = component.instance();

            spyOn(window, 'requestAnimationFrame');
            spyOn(instance, 'getContainerDimension').and.returnValue(container);
            spyOn(instance, 'stopScrolling');

            instance.updateMouseLocation(e);
            instance.updateScrolling();

            expect(window.requestAnimationFrame).toHaveBeenCalledWith(instance.scrollUp);
        });

        it('should call scrollDown when the mouse is in the bottom scroll zone', function() {

            let e = {
                clientY: 100
            };

            let component = shallow(<AutoScroll parentContainer={mockParentContainer}/>);
            let instance = component.instance();

            spyOn(window, 'requestAnimationFrame');
            spyOn(instance, 'getContainerDimension').and.returnValue(container);
            spyOn(instance, 'stopScrolling');

            instance.updateMouseLocation(e);
            instance.updateScrolling();

            expect(window.requestAnimationFrame).toHaveBeenCalledWith(instance.scrollDown);
        });

        it('should call stopScrolling when the mouse is not in a scroll zone', function() {

            let e = {
                clientY: 50
            };

            let component = shallow(<AutoScroll parentContainer={mockParentContainer}/>);
            let instance = component.instance();

            spyOn(window, 'requestAnimationFrame');
            spyOn(instance, 'getContainerDimension').and.returnValue(container);
            spyOn(instance, 'stopScrolling');

            instance.updateMouseLocation(e);
            instance.updateScrolling();

            expect(instance.stopScrolling.calls.count()).toBe(1);
        });

        it('should add extra pixels to the top of the container scroll zone when pixelsFromTopForLargeDevices prop is passed through', function() {

            let component = shallow(<AutoScroll pixelsFromTopForLargeDevices={5}/>);
            let instance = component.instance();

            spyOn(instance, 'getContainerDimension').and.returnValue(container);
            spyOn(instance, 'getContainerTop');

            instance.updateScrolling();

            expect(instance.getContainerTop).toHaveBeenCalled();
        });

        it('should add extra pixels to the bottom of the container scroll zone when pixelsFromBottomForLargeDevices prop is passed through', function() {

            let component = shallow(<AutoScroll parentContainer={mockParentContainer} pixelsFromBottomForLargeDevices={5}/>);
            let instance = component.instance();

            spyOn(instance, 'getContainerDimension').and.returnValue(container);
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

            let component = shallow(<AutoScroll parentContainer={mockParentContainer} />);
            let instance = component.instance();

            spyOn(window, 'requestAnimationFrame');
            spyOn(instance, 'getContainerDimension').and.returnValue(container);
            spyOn(instance, 'stopScrolling');

            instance.updateScrolling(e);

            expect(window.requestAnimationFrame).toHaveBeenCalledWith(instance.scrollUp);
        });

        it('should call scrollDown when touch is in the bottom scroll zone', function() {

            let e = {
                type: 'touchmove',
                touches: [{clientY: 100, clientX: 55}]
            };

            let component = shallow(<AutoScroll parentContainer={mockParentContainer} />);
            let instance = component.instance();

            spyOn(window, 'requestAnimationFrame');
            spyOn(instance, 'getContainerDimension').and.returnValue(container);
            spyOn(instance, 'stopScrolling');

            instance.updateScrolling(e);

            expect(window.requestAnimationFrame).toHaveBeenCalledWith(instance.scrollDown);
        });

        it('should call stopScrolling when touch is not in a scroll zone', function() {

            let e = {
                type: 'touchmove',
                touches: [{clientY: 50, clientX: 45}]
            };

            let component = shallow(<AutoScroll parentContainer={mockParentContainer} />);
            let instance = component.instance();

            spyOn(window, 'requestAnimationFrame');
            spyOn(instance, 'getContainerDimension').and.returnValue(container);
            spyOn(instance, 'stopScrolling');

            instance.updateScrolling(e);

            expect(instance.stopScrolling.calls.count()).toBe(1);
        });

        it('should have default props', function() {

            let component = mount(<AutoScroll parentContainer={mockParentContainer} />);

            expect(component.props().pixelsPerFrame).toBe(10);
            expect(component.props().pixelsFromBottomForLargeDevices).toBe(30);
            expect(component.props().pixelsFromTopForLargeDevices).toBe(30);
            expect(component.props().pixelsFromTopForMobile).toBe(30);
            expect(component.props().pixelsFromBottomForMobile).toBe(30);
        });

        it('remove touch & mouse events on unmount', () => {
            spyOn(document, 'removeEventListener');
            spyOn(document, 'addEventListener');
            const mockAutoScrollProp = {
                addEventListener() {},
                removeEventListener() {}
            };
            spyOn(mockAutoScrollProp, 'addEventListener');
            spyOn(mockAutoScrollProp, 'removeEventListener');

            const component = mount(<AutoScroll parentContainer={mockParentContainer} />);
            const instance = component.instance();
            instance.autoScroll = mockAutoScrollProp;

            instance.componentWillUnmount();

            expect(document.removeEventListener).toHaveBeenCalled();
            expect(mockAutoScrollProp.removeEventListener).toHaveBeenCalled();
        });
    });
});
