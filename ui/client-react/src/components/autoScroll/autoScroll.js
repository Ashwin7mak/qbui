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
        downBy = downBy + 1;

        this.animationId = requestAnimationFrame(this.scrollDown);
    }

    scrollUp() {
        let upBy = -1;
        let container = this.getContainer();
        let scrollTop = container.scrollTop;

        container.scrollTop = scrollTop + upBy;
        upBy = upBy - 1;

        this.animationId = requestAnimationFrame(this.scrollUp);
    }

    startScrolling (scrollDirection) {
        //https://css-tricks.com/using-requestanimationframe/
        let body = document.body;
        let container = this.getContainer();
        let scrollTop = container.scrollTop;
        let scrollHeight = container.scrollHeight;
        var clientHeight = container.clientHeight;

        if (scrollDirection === 'scrollDown') {
            console.log('============================================START SCROLLING DOWN');
            console.log('container.scrollTop: ', container.scrollTop);
            /////////Works On desktop//////
            this.animationId = requestAnimationFrame(this.scrollDown);

            // body.scrollTop = 0;
            // container.animate({ scrollTop: 0 }, "fast"); //animate is not stable and it does not work
            // window.scrollTo(0, 1);
            // window.pageYOffset = 100;
            // document.body.scrollTop = 0;
            // document.getElementsByClassName("this.props.className)[0].scrollLeft = 100;
            // window.scrollBy(0, 100);
        } else if (scrollDirection === 'scrollUp') {
            console.log('============================================START SCROLLING UP');
            /////////Works On desktop//////
            this.animationId = requestAnimationFrame(this.scrollUp);

            // container.animate({ scrollTop: 0 }, "fast"); //animate is not stable and it does not work
            // body.scrollTop = 0;
            // window.pageYOffset = 100;
            // window.scrollTo(0, 1);
            // document.body.scrollTop = 0;
            // document.getElementsByClassName("this.props.className)[0].scrollLeft = 100;
            // window.scrollBy(0, -100);
        }
    }

    updateScrolling(evt) {
        let pointerX;
        let pointerY;
        let containerHeight = this.getContainer().clientHeight;

        if (evt.type === 'touchmove') {
            pointerX = evt.touches[0].clientX;
            pointerY = evt.touches[0].clientY;
            console.log('touch x: ', pointerX, '\ntouchY: ', pointerY,'\ncontainerHeight: ', containerHeight);
        } else {
            pointerX = evt.clientX;
            pointerY = evt.clientY;
        }

        if (containerHeight - pointerY < 10) {
            this.startScrolling('scrollDown');
        } else if (pointerY < 20) {
            this.startScrolling('scrollUp');
        } else {
            this.stopScrolling();
        }
    }

    stopScrolling() {
        cancelAnimationFrame(this.animationId);
    }

    removeMouseMove() {
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