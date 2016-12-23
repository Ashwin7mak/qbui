import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import clearableInput from '../../src/components/hoc/clearableInput';

let TestComponent = React.createClass({
    render() {
        return <input className="wrapped" />;
    }
});
let ClearableInput = clearableInput(TestComponent);

describe('ClearabeInput hoc', function() {
    it('should render', function() {
        const component = TestUtils.renderIntoDocument(<ClearableInput />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('should call onChange with an empty object when clear icon is clicked', function() {
        const spy = jasmine.createSpy('spy');
        const component = TestUtils.renderIntoDocument(<ClearableInput onChange={spy} />);

        const clearButton = TestUtils.findRenderedDOMComponentWithClass(component, 'clearIconButton');
        TestUtils.Simulate.click(clearButton);

        expect(spy).toHaveBeenCalled();
        expect(spy.calls.first().args[0].target.value).toEqual('');
    });
});
