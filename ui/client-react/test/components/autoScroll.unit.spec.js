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

fdescribe('AutoScroll', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    fit('should call scrollUp when the mouse is in the top scroll zone', function () {

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
    })

    fit('should call scrollDown when the mouse is in the bottom scroll zone', function () {

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
    })

    fit('should call stopScrolling when the mouse not in a scroll zone', function () {

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
    })

});
