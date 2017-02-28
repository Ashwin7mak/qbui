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

class AutoScroll extends Component {

    constructor(props) {
        super(props);

        this.animationId;
        this.scrollDown = this.scrollDown.bind(this);
        this.scrollUp = this.scrollUp.bind(this);
        this.updateScrolling = this.updateScrolling.bind(this);
        this.stopScrolling = this.stopScrolling.bind(this);
        this.activateMouseMove = this.activateMouseMove.bind(this);
        this.getContainer = this.getContainer.bind(this);
    }

    componentDidMount() {
        document.querySelector(`.${this.props.children.props.className}`).addEventListener("touchmove", this.updateScrolling);
        document.querySelector(`.${this.props.children.props.className}`).addEventListener("mousedown", this.activateMouseMove);
    }

    componentWillUnmount() {
        document.querySelector(`.${this.props.children.props.className}`).removeEventListener("touchmove", this.updateScrolling);
        document.querySelector(`.${this.props.children.props.className}`).removeEventListener("mousedown", this.activateMouseMove);
    }

    scrollDown() {
        let {pixelsPerFrame} = this.props;
        let container = this.getContainer();
        let scrollTop = container.scrollTop;

        container.scrollTop = scrollTop + pixelsPerFrame;
        pixelsPerFrame = pixelsPerFrame + pixelsPerFrame;

        this.animationId = requestAnimationFrame(this.scrollDown);
    }

    scrollUp() {
        let {pixelsPerFrame} = this.props;
        let container = this.getContainer();
        let scrollTop = container.scrollTop;

        container.scrollTop = scrollTop + -pixelsPerFrame;
        pixelsPerFrame = pixelsPerFrame - pixelsPerFrame;

        this.animationId = requestAnimationFrame(this.scrollUp);
    }

    updateScrolling(e) {

        let pointerY;
        let windowInnerHeight = window.innerHeight;
        let container = this.getContainer();
        let containerOffSetHeight = container.offsetHeight;
        let containerOffSetTop = container.offsetTop;
        let containerTop = containerOffSetTop;
        /**
         * This is making the assumption the bottom of the container is not positioned at the bottom of the page
         * */
        let containerBottom =  windowInnerHeight - (containerOffSetTop + containerOffSetHeight);

        if (e.type === 'touchmove') {
            pointerY = e.touches[0].clientY;
        } else {
            pointerY = e.clientY;
        }
        /**
         * If the Container is equal to or has the same height as the window, then we will just set the bottom to the window's bottom
         * We also subtract 40px to allow the scrolling to start 40 pixels before the mouse or touch gets to the bottom of the page
         * */
        if (windowInnerHeight <= containerOffSetHeight) {
            containerBottom = windowInnerHeight - this.props.pixelsFromBottom;
        }

        if (this.props.pixelsFromTop) {
            containerTop = containerTop + this.props.pixelsFromTop
        }

        if (pointerY > containerBottom) {
            this.animationId = requestAnimationFrame(this.scrollDown);
        } else if (pointerY < containerTop) {
            this.animationId = requestAnimationFrame(this.scrollUp);
        } else {
            this.stopScrolling();
        }
    }

    stopScrolling() {
        cancelAnimationFrame(this.animationId);
    }

    activateMouseMove() {
        document.addEventListener("mousemove", this.updateScrolling);
    }

    getContainer() {
        let container = document.querySelector(`.${this.props.children.props.className}`);
        return container;
    }

    render() {
        return (this.props.children);
    }

}

AutoScroll.propTypes = {
    pixelsPerFrame: PropTypes.number,
    pixelsFromBottom: PropTypes.number,
    pixelsFromTop: PropTypes.number,

};

export default AutoScroll;