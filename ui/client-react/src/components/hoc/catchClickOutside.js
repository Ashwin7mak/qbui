/**
 *
 * catchClickOutside
 * A higher-order-component for handling onClickOutside for React components.
 * This higher-order component (HoC) captures clicks outside component and calls the handler (handleClickOutside
 * passed in as a required prop) when such an event occurs. Optionally specify a outsideClickIgnoreClass property
 * that if the element outside being clicked has that class it does not call the callback handler for
 * intercepting it.
 * Also preventDefault and stopPropagation properties can also be defined on the component
 * being wrapped if you want it to stop bubbling up the event or prevent default browser handling
 * of the click.
 *
 * A higher-order component is just a function that takes an existing component and returns
 * another component that wraps it.
 **/
import React from 'react';
import ReactDOM from 'react-dom';

// administrative
var registeredComponents = [];
var handlers = [];
var IGNORE_CLASS = 'ignore-react-onclickoutside';

/**
 * Check whether some DOM node is our Component's node.
 */
var isNodeFound = function(current, componentNode, ignoreClass) {
    if (current === componentNode) {
        return true;
    }
    // SVG <use/> elements do not technically reside in the rendered DOM, so
    // they do not have classList directly, but they offer a link to their
    // corresponding element, which can have classList. This extra check is for
    // that case.
    // See: http://www.w3.org/TR/SVG11/struct.html#InterfaceSVGUseElement
    // Discussion: https://github.com/Pomax/react-onclickoutside/pull/17
    if (current.correspondingElement) {
        return current.correspondingElement.classList.contains(ignoreClass);
    }
    return current.classList.contains(ignoreClass);
};

/**
 * Generate the event handler that checks whether a clicked DOM node
 * is inside of, or lives outside of, our Component's node tree.
 */
var generateOutsideCheck = function(componentNode, eventHandler, ignoreClass, preventDefault, stopPropagation) {
    return function(evt) {
        if (preventDefault) {
            evt.preventDefault();
        }
        if (stopPropagation) {
            evt.stopPropagation();
            if (evt.stopImmediatePropagation) {
                evt.stopImmediatePropagation();
            }
        }
        var current = evt.target;
        var found = false;
        // If source=local then this event came from "somewhere"
        // inside and should be ignored. We could handle this with
        // a layered approach, too, but that requires going back to
        // thinking in terms of Dom node nesting, running counter
        // to React's "you shouldn't care about the DOM" philosophy.
        while (current.parentNode) {
            found = isNodeFound(current, componentNode, ignoreClass);
            if (found) {
                return;
            }
            current = current.parentNode;
        }
        // If element is in a detached DOM, consider it "not clicked
        // outside", as it cannot be known whether it was outside.
        if (current !== document) {
            return;
        }

        eventHandler(evt);
    };
};



// The actual Component-wrapping HOC:
let wrapper = function(Component) {
    var wrapComponentWithOnClickOutsideHandling = React.createClass({
        statics: {
            /**
             * Access the wrapped Component's class.
             */
            getClass: function() {
                if (Component.getClass) {
                    return Component.getClass();
                }
                return Component;
            }
        },

        /**
         * Access the wrapped Component's instance.
         */
        getInstance: function() {
            return this.refs.instance;
        },

        // this is given meaning in componentDidMount
        __outsideClickHandler: function(evt) {},

        /**
         * Add click listeners to the current document,
         * linked to this component's state.
         */
        componentDidMount: function() {
            var instance = this.getInstance();

            if (typeof instance.handleClickOutside !== "function") {
                throw new Error("Component lacks a handleClickOutside(event) function for processing outside click events.");
            }

            var fn = this.__outsideClickHandler = generateOutsideCheck(
                ReactDOM.findDOMNode(instance),
                instance.handleClickOutside,
                this.props.outsideClickIgnoreClass || IGNORE_CLASS,
                this.props.preventDefault || false,
                this.props.stopPropagation || false
            );

            var pos = registeredComponents.length;
            registeredComponents.push(this);
            handlers[pos] = fn;

            // If there is a truthy disableOnClickOutside property for this
            // component, don't immediately start listening for outside events.
            if (!this.props.disableOnClickOutside) {
                this.enableOnClickOutside();
            }
        },

        /**
         * Remove the document's event listeners
         */
        componentWillUnmount: function() {
            this.disableOnClickOutside();
            this.__outsideClickHandler = false;
            var pos = registeredComponents.indexOf(this);
            if (pos > -1) {
                // clean up so we don't leak memory
                if (handlers[pos]) {handlers.splice(pos, 1);}
                registeredComponents.splice(pos, 1);
            }

        },

        /**
         * Can be called to explicitly enable event listening
         * for clicks and touches outside of this element.
         */
        enableOnClickOutside: function() {
            var fn = this.__outsideClickHandler;
            if (typeof document !== "undefined") {
                document.addEventListener("mousedown", fn, true);
                document.addEventListener("touchstart", fn, true);
            }
        },

        /**
         * Can be called to explicitly disable event listening
         * for clicks and touches outside of this element.
         */
        disableOnClickOutside: function() {
            var fn = this.__outsideClickHandler;
            if (typeof document !== "undefined") {
                document.removeEventListener("mousedown", fn, true);
                document.removeEventListener("touchstart", fn, true);
            }
        },

        /**
         * Pass-through render
         */
        render: function() {
            var passedProps = this.props;
            var props = {ref: 'instance'};
            Object.keys(this.props).forEach(function(key) {
                props[key] = passedProps[key];
            });
            return React.createElement(Component,  props);
        }
    });

    return wrapComponentWithOnClickOutsideHandling;
};

// Make it all happen
module.exports = wrapper;



