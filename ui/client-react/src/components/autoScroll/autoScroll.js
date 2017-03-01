import React, {PropTypes, Component} from 'react';

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
        this.getContainerDimension = this.getContainerDimension.bind(this);
        this.updateScrolling = this.updateScrolling.bind(this);
        this.stopScrolling = this.stopScrolling.bind(this);
        this.activateMouseMove = this.activateMouseMove.bind(this);
        this.getContainer = this.getContainer.bind(this);
        this.getContainerBottom = this.getContainerBottom.bind(this);
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

    getContainerDimension() {
        let container = this.getContainer();

        return {
            containerOffsetLeft: container.offsetLeft,
            containerOffSetHeight: container.offsetHeight,
            containerOffSetTop: container.offsetTop,
            containerRightSide: container.offsetLeft + container.offsetWidth,
            //Autoscroll activates 40 pixels before it reaches the bottom or top of the container
            containerBottom: container.offsetHeight - 30,
            containerTop: container.offsetTop + 30
        };

    }

    getContainerTop(containerTop) {
        /**
         * Allows a developer to add extra pixels to the top, allowing auto scroll to activate sooner
         * */
        return containerTop + this.props.pixelsFromTop;
    }

    getContainerBottom(containerBottom) {
        /**
         * Allows a developer to add extra pixels to the bottom, allowing auto scroll to activate sooner
         * */
        if (this.props.pixelsFromBottom) {
            return containerBottom - this.props.pixelsFromBottom;
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

    updateScrolling(e) {

        let pointerY;
        let pointerX;

        let {containerOffsetLeft, containerOffSetHeight, containerOffSetTop, containerRightSide, containerBottom, containerTop} = this.getContainerDimension();

        if (e.type === 'touchmove') {
            pointerY = e.touches[0].clientY;
            pointerX = e.touches[0].clientX;
        } else {
            pointerY = e.clientY;
            pointerX = e.clientX;
        }

        if (this.props.pixelsFromBottom) {
            containerBottom = this.getContainerBottom(containerBottom);
        }

        if (this.props.pixelsFromTop) {
            containerTop = this.getContainerTop(containerTop);
        }

        /**
         * Activate auto scroll only if it is in the designated scroll zone within the container
         * */
        if (pointerY > containerBottom &&
            pointerX < containerRightSide &&
            pointerX > containerOffsetLeft) {

            this.animationId = window.requestAnimationFrame(this.scrollDown);

        } else if (pointerY < containerTop &&
                   pointerX < containerRightSide &&
                   pointerX > containerOffsetLeft) {

            this.animationId = window.requestAnimationFrame(this.scrollUp);

        } else {

            this.stopScrolling();

        }
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
