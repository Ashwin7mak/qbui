import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import catchClickOutside from '../../src/components/hoc/catchClickOutside';

let TestComponent = React.createClass({
    render() {
        return <div className="wrapped">some data</div>;
    }
});


describe('catchClickOutside functions', () => {
    'use strict';

    let component;

    it('test render with catchClickOutside', () => {
        const WrappedComponent =  catchClickOutside(TestComponent);
        component = TestUtils.renderIntoDocument(<WrappedComponent />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render catchClickOutside catchClick', () => {
        let handled = false;

        var callbacks = {
            handleClick: function(e) {
                handled = true;
            }
        };

        let mountPoint;
        mountPoint = document.createElement('div');
        document.body.appendChild(mountPoint);
        mountPoint.className = "outer";

        spyOn(callbacks, 'handleClick').and.callThrough();

        const WrappedComponent =  catchClickOutside(TestComponent,
                                    callbacks.handleClick);


        component = ReactDOM.render(
               <WrappedComponent/>, mountPoint);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        //let outer = document.getElementsByClassName("outer");
        // create a mouse click
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, true, window, 1, 0, 0);

        // send click to outer
        mountPoint.dispatchEvent(event);

        expect(callbacks.handleClick).toHaveBeenCalled();
        expect(handled).toBe(true);
        ReactDOM.unmountComponentAtNode(mountPoint);
        document.body.removeChild(mountPoint);

    });
});

