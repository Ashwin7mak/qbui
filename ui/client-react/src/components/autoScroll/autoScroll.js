import React, {PropTypes, Component} from 'react';


class AutoScroll extends Component {

    constructor(props) {
        super(props);

        this.animationId;
        this.scrollDown = this.scrollDown.bind(this);
        this.scrollUp = this.scrollUp.bind(this);
        this.startScrolling = this.startScrolling.bind(this);
        this.startScrolling = this.startScrolling.bind(this);
        this.updateScrolling = this.updateScrolling.bind(this);
        this.stopScrolling = this.stopScrolling.bind(this);
        this.removeMouseMove = this.removeMouseMove.bind(this);
        this.activateMouseMove = this.activateMouseMove.bind(this);
        this.getContainer = this.getContainer.bind(this);
    }

    componentDidMount() {
        document.addEventListener("touchmove", this.updateScrolling);
        document.addEventListener("touchend", this.stopScrolling);

        document.addEventListener("mousedown", this.activateMouseMove);
        document.addEventListener("mouseup", this.removeMouseMove);
    }

    scrollDown() {
        let downBy = 1;
        let container = this.getContainer();
        let scrollTop = container.scrollTop;


        container.scrollTop = scrollTop + downBy;
        downBy = downBy + 10;

        this.animationId = requestAnimationFrame(this.scrollDown);
    }

    scrollUp() {
        let upBy = -1;
        let container = this.getContainer();
        let scrollTop = container.scrollTop;

        container.scrollTop = scrollTop + upBy;
        upBy = upBy - 10;

        this.animationId = requestAnimationFrame(this.scrollUp);
    }

    startScrolling (scrollDirection) {
        //https://css-tricks.com/using-requestanimationframe/
        if (scrollDirection === 'scrollDown') {
            this.animationId = requestAnimationFrame(this.scrollDown);

        } else if (scrollDirection === 'scrollUp') {
            this.animationId = requestAnimationFrame(this.scrollUp);
        }
    }

    updateScrolling(evt) {

        let pointerY;
        let windowInnerHeight = window.innerHeight;
        let container = this.getContainer();
        let containerOffSetHeight = container.offsetHeight;
        let containerOffSetTop = container.offsetTop;

        /**
         * This is making the assumption the bottom of the container is not positioned at the bottom of the page
         * */
        let containerBottom =  windowInnerHeight - (containerOffSetTop + containerOffSetHeight);

        if (evt.type === 'touchmove') {
            pointerY = evt.touches[0].clientY;
        } else {
            pointerY = evt.clientY;
        }
        /**
         * If the Container is equal to or has the same height as the window, then we will just set the bottom to the window's bottom
         * We also subtract 40px to allow the scrolling to start 40 pixels before the mouse or touch gets to the bottom of the page
         * */
        if (windowInnerHeight <= containerOffSetHeight) {
            containerBottom = windowInnerHeight - 40;
        }

        if (pointerY > containerBottom) {
            this.startScrolling('scrollDown');
        } else if (pointerY < containerOffSetTop) {
            this.startScrolling('scrollUp');
        } else {
            this.stopScrolling();
        }
    }

    stopScrolling() {
        console.log('Did I even get called?');
        cancelAnimationFrame(this.animationId);
    }

    removeMouseMove() {
        console.log('I stopped scrolling');
        this.stopScrolling();
        document.removeEventListener("mousemove", this.updateScrolling);
        this.stopScrolling();
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
};

export default AutoScroll;