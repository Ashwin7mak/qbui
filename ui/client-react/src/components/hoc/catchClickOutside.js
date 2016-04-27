import React from 'react';
import ReactDOM from 'react-dom';

/*
 This higher-order component (HoC) captures clicks outside component and calls the handler
 passed in when such an event occurs. Optionally specify a isException callback function
 that if true is returned it allow the event to continue and does not call the callback handler for intercepting it.

 A higher-order component is just a function that takes an existing component and returns
 another component that wraps it.

*/

var catchClicksOutsideWrapper = (Component, handler, isException) => {

    const CatchClicksOutside = React.createClass({

        displayName: 'clicksOutside_' + Component.displayName,
        wrapped  : Component,
        localNode: null,

        catchClick(evt) {
            var source = evt.target;
            var found = false;
            // if source=local then this event came from "somewhere" inside
            // and should be ignored.
            if (this.localNode === null) {
                this.localNode =  ReactDOM.findDOMNode(this);
            }
            while (source) {
                found = (source === this.localNode);
                if (found) {
                    return;
                }
                source = source.parentNode;
            }
            // check exceptions to the click outside
            // check if the outside click is on an element that should be allowed
            if (isException && isException(evt)) {
                return;
            }
            // not found: genuine outside event. Handle it.
            handler(evt, this);
        },

        componentWillUnmount() {
            if (window && window.removeEventListener) {
                window.removeEventListener("click", (e) => this.catchClick(e));
            }
            this.localNode = null;
        },

        componentDidMount() {
            if (!handler) {
                return;
            }
            if (window && window.addEventListener) {
                this.localNode =  ReactDOM.findDOMNode(this);

                window.addEventListener("click", (e) => this.catchClick(e), true);
                // true param on addEventListener binds the listener to the capture phase
                // and executes this function before anything else gets executed
            }
        },

        render() {
            return (
                     <Component
                         {...this.props}
                         {...this.state}
                    />);
        }
    });

    return CatchClicksOutside;
};
export default catchClicksOutsideWrapper;

