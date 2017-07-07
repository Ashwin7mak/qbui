import React, {PropTypes, Component} from "react";
import bodymovin from "bodymovin";

/**
 * Component that uses the After Effects plugin "bodymovin" for exporting animations to svg/canvas/html + js
 * Pass in the JSON object containing the animation from the parent
 * The JSON object is stored under reuse/client/src/assets/animations/
 * Place your new JSON from XD over there and create a wrapper to pass that object into that component
 * See reuse/client/src/components/loader/QBLoader.js for an example
 */
class BodyMovin extends Component {

    componentDidMount() {
        bodymovin.loadAnimation({
            container: this.refs.bodyMovinRef, // the dom element that will contain the animation
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: this.props.animationData // the animation json object
        });
    }

    componentWillUnmount() {
        bodymovin.destroy();
    }

    render() {
        return (
            <div className = {`${this.props.className} bodyMovin`} ref="bodyMovinRef" />
        );
    }
}

BodyMovin.PropTypes = {
    /**
     * The data to be rendered as a SVG
     */
    animationData: PropTypes.object,
    /**
     * The new className to be passed from parent for custom styling
     */
    className: PropTypes.string
};

BodyMovin.defaultProps = {
    className: ''
};

export default BodyMovin;
