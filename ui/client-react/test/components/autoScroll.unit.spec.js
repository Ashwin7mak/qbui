import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import AutoScroll from '../../../client-react/src/components/autoScroll/autoScroll';

const e = {
    type: 'foo',
    touches: [{clientY: 90}, {clientX: 90} ],
    clientX: 55,
    clientY: 0
};

fdescribe('AutoScroll', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    afterEach(() => {
    });

    fit('should do something', function() {
        let component = shallow(<AutoScroll/>);

        let container = {
            offsetWidth: 50,
            offsetLeft: 50,
            offsetHeight: 50,
            offsetTop: 10
        };

        let instance = component.instance();

        spyOn(window, 'requestAnimationFrame');


        spyOn(instance, 'getContainer').and.returnValue(container);
        spyOn(instance, 'stopScrolling');



        instance.updateScrolling(e);

        debugger;
        // expect(window.requestAnimationFrame).not.toHaveBeenCalled();
        expect(window.requestAnimationFrame).toHaveBeenCalledWith(instance.scrollUp);
        // expect(instance.stopScrolling).toHaveBeenCalled();
    });
});