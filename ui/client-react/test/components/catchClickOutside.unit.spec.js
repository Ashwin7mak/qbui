import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import catchClickOutside from '../../src/components/hoc/catchClickOutside';

let TestComponent = React.createClass({
    render() {
        return <div className="wrapped">some data</div>;
    }
});

describe('onclickoutside hoc', function() {

    var Component = React.createClass({
        getInitialState: function() {
            return {
                clickOutsideHandled: false
            };
        },

        handleClickOutside: function() {
            this.setState({
                clickOutsideHandled: true
            });
        },

        render: function() {
            return React.createElement('div');
        }
    });

    var WrappedComponent = catchClickOutside(Component);

    // tests

    it('should call handleClickOutside when clicking the document', function() {
        var element = React.createElement(WrappedComponent);
        expect(element).toBeTruthy();
        var component = TestUtils.renderIntoDocument(element);
        expect(component).toBeTruthy();
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('mousedown', true, true, window, 1, 0, 0);
        document.dispatchEvent(event);
        var instance = component.getInstance();
        expect(instance.state.clickOutsideHandled).toBeTruthy();
    });


    it('should throw an error when a component without handleClickOutside(evt) is wrapped', function() {
        var BadComponent = React.createClass({
            render: function() {
                return React.createElement('div');
            }
        });

        try {
            var bad = catchClickOutside(BadComponent);
            var component = TestUtils.renderIntoDocument(React.createElement(bad));
            expect(component).toBeFalsy(); // "component was wrapped, despite not implementing handleClickOutside(evt)");
        } catch (e) {
            expect(e).toBeTruthy();// "component was not wrapped");
        }
    });
});

