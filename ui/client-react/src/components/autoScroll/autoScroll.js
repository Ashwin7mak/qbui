import React, {PropTypes, Component} from 'react';
import isSmall from '../../utils/breakpoints';

/**
 * AutoScroll is triggered when a user either touches and holds down on a touch device and moves her finger
 * near the top or bottom of the scrolling container.
 *
 * It is also triggered when a user clicks down and holds down the mouse and moves the mouse near the top or bottom
 * of the scrolling container.
 *
 * AutoScroll listens for mousedown, mousemove and mouseup for desktop.
 * AutoScroll listens for touchmove or touchend for touch devices.
 *
 * Note: Autoscroll will only work if the parent container has overflow set to auto, also
 * this container element needs to be passed in using a ref
 * For example:
 * let parentContainerElement = null;
 *
 * <ParentContainer style={{overflow: 'auto'}} ref={element => parentContainerElement = element}>
 *      <AutoScroll parentContainer={parentContainerElement}>
 *          <ChildComponent />
 *      </AutoScroll>
 * <ParentContainer />
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

        this.scrollingAnimationId = undefined;
        this.mouseDownSetIntervalId = undefined;

        this.pointerY = undefined;

        this.updateScrolling = this.updateScrolling.bind(this);
        this.stopScrolling = this.stopScrolling.bind(this);
        this.scrollDown = this.scrollDown.bind(this);
        this.scrollUp = this.scrollUp.bind(this);

        this.getContainerDimension = this.getContainerDimension.bind(this);
        this.getContainerBottom = this.getContainerBottom.bind(this);

        this.updateMouseLocation = this.updateMouseLocation.bind(this);
        this.mouseDownUpdateScrolling = this.mouseDownUpdateScrolling.bind(this);
        this.mouseUpStopScrolling = this.mouseUpStopScrolling.bind(this);
    }

    componentDidMount() {
        this.autoScroll.addEventListener("touchmove", this.updateScrolling);
        /**
         * This event listener is added to the document body to account for the edge case of when a user stops touching outside of the container
         * */
        document.addEventListener("touchend", this.stopScrolling);

        this.autoScroll.addEventListener("mousemove", this.updateMouseLocation);
        this.autoScroll.addEventListener("mousedown", this.mouseDownUpdateScrolling);
        /**
         * The mouseup event listener is added to the document body to account for the edge case of when a user mouseup outside of the container
         * */
        document.addEventListener("mouseup", this.mouseUpStopScrolling);
    }

    componentWillUnmount() {
        this.autoScroll.removeEventListener("touchmove", this.updateScrolling);
        document.removeEventListener("touchend", this.stopScrolling);

        this.autoScroll.removeEventListener("mousedown", this.mouseDownUpdateScrolling);
        this.autoScroll.removeEventListener("mousemove", this.updateMouseLocation);
        document.removeEventListener("mouseup", this.stopScrolling);
    }

    getContainerDimension() {
        //getBoundingClientRect is used because it only gets the dimension of the container inside of the viewport
        let container = this.props.parentContainer;
        if (container) {
            container = container.getBoundingClientRect();
            return {
                containerBottom: container.bottom,
                containerTop: container.top
            };
        }
    }

    getContainerTop(containerTop) {
        if (isSmall.isSmallBreakpoint()) {
            return containerTop + this.props.pixelsFromTopForMobile;
        } else {
            return containerTop + this.props.pixelsFromTopForLargeDevices;
        }
    }

    getContainerBottom(containerBottom) {
        if (isSmall.isSmallBreakpoint()) {
            return containerBottom - this.props.pixelsFromBottomForMobile;
        } else if (this.props.pixelsFromBottomForMobile) {
            return containerBottom - this.props.pixelsFromBottomForLargeDevices;
        }
    }
    updateScrolling(e) {
        this.stopScrolling();

        let pointerY = this.pointerY;

        let {containerBottom, containerTop} = this.getContainerDimension();

        containerBottom = this.getContainerBottom(containerBottom);
        containerTop = this.getContainerTop(containerTop);

        if (e && e.type === 'touchmove') {
            pointerY = e.touches[0].clientY;
        }

        /**
         * Activate auto scroll only if it is in the designated scroll zone within the container
         * */
        if (pointerY > containerBottom) {
            this.scrollingAnimationId = window.requestAnimationFrame(this.scrollDown);
        } else if (pointerY < containerTop) {
            this.scrollingAnimationId = window.requestAnimationFrame(this.scrollUp);

        } else {
            this.stopScrolling();
        }
    }

    scrollDown() {
        let pixelsPerFrame = this.props.pixelsPerFrame ? this.props.pixelsPerFrame : 10;
        let container = this.props.parentContainer;
        let scrollTop;
        if (container) {
            scrollTop = container.scrollTop;
            container.scrollTop = scrollTop + pixelsPerFrame;
            pixelsPerFrame = pixelsPerFrame + pixelsPerFrame;
            this.scrollingAnimationId = window.requestAnimationFrame(this.scrollDown);
        }
    }

    scrollUp() {
        let defaultPixelsPerFrame = isSmall.isSmallBreakpoint() ? 2 : 10;
        let pixelsPerFrame = this.props.pixelsPerFrame ? this.props.pixelsPerFrame : defaultPixelsPerFrame ;
        let container = this.props.parentContainer;
        let scrollTop;
        if (container) {
            scrollTop = container.scrollTop;
            container.scrollTop = scrollTop + -pixelsPerFrame;
            pixelsPerFrame = pixelsPerFrame - pixelsPerFrame;
            this.scrollingAnimationId = window.requestAnimationFrame(this.scrollUp);
        }
    }

    stopScrolling() {
        window.cancelAnimationFrame(this.scrollingAnimationId);
    }

    mouseDownUpdateScrolling() {
        this.mouseDownSetIntervalId = setInterval(this.updateScrolling, 500);
    }

    updateMouseLocation(e) {
        this.pointerY = e.clientY;
    }

    mouseUpStopScrolling() {
        this.stopScrolling();
        clearInterval(this.mouseDownSetIntervalId);
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
     * the parent container passed in needs to have overflow set to auto
     * */
    parentContainer: PropTypes.func.required,
    /**
     * pixelsPerFrame sets how fast the scroll bar should scroll
     * */
    pixelsPerFrame: PropTypes.number,
    /**
     * pixelsFromBottom indicates how many pixels from the bottom of the container should it start autoscrolling
     * */
    pixelsFromBottomForLargeDevices: PropTypes.number,
    /**
     * pixelsFromTop indicates how many pixels from the bottom of the container should it start autoscrolling
     * */
    pixelsFromTopForLargeDevices: PropTypes.number,
    /**
     * pixelsFromTop indicates how many pixels from the bottom of the container should it start autoscrolling for mobile devices
     * */
    pixelsFromTopForMobile: PropTypes.number,
    /**
     * pixelsFromTop indicates how many pixels from the bottom of the container should it start autoscrolling for mobile devices
     * */
    pixelsFromBottomForMobile: PropTypes.number,
};

AutoScroll.defaultProps = {
    pixelsPerFrame: 10,
    pixelsFromBottomForLargeDevices: 30,
    pixelsFromTopForLargeDevices: 30,
    pixelsFromTopForMobile: 30,
    pixelsFromBottomForMobile: 30
};

export default AutoScroll;
