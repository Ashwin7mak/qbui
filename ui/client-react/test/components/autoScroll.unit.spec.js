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

    it('should call scrollUp when the mouse is in the top scroll zone', function() {

        let e = {
            type: 'foo',
            touches: [{clientY: 90}, {clientX: 90}],
            clientX: 55,
            clientY: 0
        };

        let component = shallow(<AutoScroll/>);
        let instance = component.instance();

        spyOn(window, 'requestAnimationFrame');
        spyOn(instance, 'getContainer').and.returnValue(container);
        spyOn(instance, 'stopScrolling');

        instance.updateScrolling(e);

        expect(window.requestAnimationFrame).toHaveBeenCalledWith(instance.scrollUp);
    });

    it('should call scrollDown when the mouse is in the bottom scroll zone', function() {

        let e = {
            type: 'foo',
            touches: [{clientY: 90}, {clientX: 90}],
            clientX: 55,
            clientY: 100
        };

        let component = shallow(<AutoScroll/>);
        let instance = component.instance();

        spyOn(window, 'requestAnimationFrame');
        spyOn(instance, 'getContainer').and.returnValue(container);
        spyOn(instance, 'stopScrolling');

        instance.updateScrolling(e);

        expect(window.requestAnimationFrame).toHaveBeenCalledWith(instance.scrollDown);
    });

    it('should call stopScrolling when the mouse not in a scroll zone', function() {

        let e = {
            type: 'foo',
            touches: [{clientY: 90}, {clientX: 90}],
            clientX: 45,
            clientY: 50
        };

        let component = shallow(<AutoScroll/>);
        let instance = component.instance();

        spyOn(window, 'requestAnimationFrame');
        spyOn(instance, 'getContainer').and.returnValue(container);
        spyOn(instance, 'stopScrolling');

        instance.updateScrolling(e);

        expect(instance.stopScrolling).toHaveBeenCalled();
    });

    it('should add extra pixels to the top of the container scroll zone when pixelsFromTop prop is passed through', function() {

        let e = {
            type: 'foo',
            touches: [{clientY: 90}, {clientX: 90}],
            clientX: 45,
            clientY: 50
        };

        let component = shallow(<AutoScroll pixelsFromTop={5}/>);
        let instance = component.instance();

        spyOn(instance, 'getContainer').and.returnValue(container);
        spyOn(instance, 'getContainerTop');

        instance.updateScrolling(e);

        expect(instance.getContainerTop).toHaveBeenCalled();
    });

    it('should add extra pixels to the bottom of the container scroll zone when pixelsFromBottom prop is passed through', function() {

        let e = {
            type: 'foo',
            touches: [{clientY: 90}, {clientX: 90}],
            clientX: 45,
            clientY: 50
        };

        let component = shallow(<AutoScroll pixelsFromBottom={5}/>);
        let instance = component.instance();

        spyOn(instance, 'getContainer').and.returnValue(container);
        spyOn(instance, 'getContainerBottom');

        instance.updateScrolling(e);

        expect(instance.getContainerBottom).toHaveBeenCalled();
    });

});
