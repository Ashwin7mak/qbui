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
        let body = document.body;
        let container = this.getContainer();
        let scrollTop = container.scrollTop;
        let scrollHeight = container.scrollHeight;
        var clientHeight = container.clientHeight;

        if (scrollDirection === 'scrollDown') {
            console.log('============================================START SCROLLING DOWN');
            this.animationId = requestAnimationFrame(this.scrollDown);

        } else if (scrollDirection === 'scrollUp') {
            console.log('============================================START SCROLLING UP');
            this.animationId = requestAnimationFrame(this.scrollUp);
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

        if (containerHeight - pointerY < 20) {
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