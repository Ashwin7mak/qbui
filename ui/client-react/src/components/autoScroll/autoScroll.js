import React, {PropTypes, Component} from 'react';
import ReactDom from 'react-dom';


/**
 * AutoScroll is triggered when a user either touches and holds down on a touch device and moves her finger
 * to near the top or bottom of the scrolling container.
 *
 * It is also triggered when a user clicks down and holds down the mouse and moves the mouse near the top or bottom
 * of the scrolling container.
 *
 * AutoScroll listens for mousedown and mouseup for desktop.
 * AutoScroll listens for touchmove or touch devices.
 *
 * Autoscroll only works on desktops and tablets, it currently does not work for mobile.
 *
 * Note: Autoscroll will only work if the parent container has overflow set to auto
 * */


/**
 * Like many fancy web features, it's nice to use it when available and fallback to something that works when you can't.
 * Below is a polyfill from https://css-tricks.com/using-requestanimationframe/
 * */

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {callback(currTime + timeToCall);}, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());

class AutoScroll extends Component {

    constructor(props) {
        super(props);

        this.autoScroll = null;
        this.animationId = undefined;
        this.scrollDown = this.scrollDown.bind(this);
        this.scrollUp = this.scrollUp.bind(this);
        this.updateScrolling = this.updateScrolling.bind(this);
        this.stopScrolling = this.stopScrolling.bind(this);
        this.activateMouseMove = this.activateMouseMove.bind(this);
        this.getContainer = this.getContainer.bind(this);
    }

    componentDidMount() {
        this.autoScroll.addEventListener("touchmove", this.updateScrolling);
        this.autoScroll.addEventListener("mousedown", this.activateMouseMove);
    }

    componentWillUnmount() {
        this.autoScroll.removeEventListener("touchmove", this.updateScrolling);
        this.autoScroll.removeEventListener("mousedown", this.activateMouseMove);
    }

    scrollDown() {
        let pixelsPerFrame = this.props.pixelsPerFrame ? this.props.pixelsPerFrame : 10;
        let container = this.getContainer();
        let scrollTop = container.scrollTop;

        container.scrollTop = scrollTop + pixelsPerFrame;
        pixelsPerFrame = pixelsPerFrame + pixelsPerFrame;

        this.animationId = window.requestAnimationFrame(this.scrollDown);
    }

    scrollUp() {
        let pixelsPerFrame = this.props.pixelsPerFrame ? this.props.pixelsPerFrame : 10 ;
        let container = this.getContainer();
        let scrollTop = container.scrollTop;

        container.scrollTop = scrollTop + -pixelsPerFrame;
        pixelsPerFrame = pixelsPerFrame - pixelsPerFrame;

        this.animationId = window.requestAnimationFrame(this.scrollUp);
    }

    updateScrolling(e) {

        let pointerY;
        let pointerX;

        let windowInnerHeight = window.innerHeight;
        let windowInnerWidth = window.innerWidth;

        let container = this.getContainer();

        let containerWidth = container.offsetWidth;
        let containerOffsetLeft = container.offsetLeft;

        let containerOffSetHeight = container.offsetHeight;
        let containerOffSetTop = container.offsetTop;
        let containerTop = containerOffSetTop;

        let containerRightSide = containerOffsetLeft + containerWidth;
        /**
         * This is making the assumption the bottom of the container is not positioned at the bottom of the page
         * */
        let containerBottom =  windowInnerHeight - (containerOffSetTop + containerOffSetHeight);

        if (e.type === 'touchmove') {
            pointerY = e.touches[0].clientY;
            pointerX = e.touches[0].clientX;
        } else {
            pointerY = e.clientY;
            pointerX = e.clientX;
        }
        /**
         * If the Container is equal to or has the same height as the window, then we will just set the bottom to the window's bottom
         * We also subtract 40px to allow the scrolling to start 40 pixels before the mouse or touch gets to the bottom of the page
         * */
        if (windowInnerHeight <= containerOffSetHeight) {
            if (this.props.pixelsFromBottom) {
                containerBottom = windowInnerHeight - this.props.pixelsFromBottom;
            } else {
                containerBottom = windowInnerHeight - 40;
            }
        }

        /**
         * Allows a developer to add extra pixels from the top allowing autoscroll to activate sooner
         * */
        if (this.props.pixelsFromTop) {
            containerTop = containerTop + this.props.pixelsFromTop;
        }

        /**
         * Activating auto scroll is contained withing the element
         * */
        debugger;
        if (pointerY > containerBottom && pointerX < containerRightSide && pointerX > containerOffsetLeft) {
            this.animationId = window.requestAnimationFrame(this.scrollDown);
        } else if (pointerY < containerTop && pointerX < containerRightSide && pointerX > containerOffsetLeft) {
            this.animationId = window.requestAnimationFrame(this.scrollUp);
        } else {
            this.stopScrolling();
        }
    }

    stopScrolling() {
        window.cancelAnimationFrame(this.animationId);
    }

    activateMouseMove() {
        this.autoScroll.addEventListener("mousemove", this.updateScrolling);
    }

    getContainer() {
        let container;

        if (this.props.children) {
            container = document.querySelector(`.${this.props.children.props.className}`);
        }

        return container;
    }

    render() {
        return (
            <div className="autoScroll" style={{display: 'flex', flex: '1 auto'}} ref={autoScroll => this.autoScroll = autoScroll}>
                {this.props.children}
            </div>
        );
    }

}

AutoScroll.propTypes = {
    /**
     * pixelsPerFrame sets how fast the scroll bar should scroll
     * */
    pixelsPerFrame: PropTypes.number,
    /**
     * pixelsFromBottom indicates how many pixels from the bottom of the container should it start autoscrolling
     * */
    pixelsFromBottom: PropTypes.number,
    /**
     * pixelsFromTop indicates how many pixels from the bottom of the container should it start autoscrolling
     * */
    pixelsFromTop: PropTypes.number,

};

export default AutoScroll;
