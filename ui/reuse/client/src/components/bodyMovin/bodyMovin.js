import React, {PropTypes, Component} from "react";
import bodymovin from "bodymovin";
import "./bodyMovin.scss";

/**
 * Component that uses the After Effects plugin "bodymovin" for exporting animations to svg/canvas/html + js
 */
class BodyMovin extends Component {

    componentDidMount() {
        bodymovin.loadAnimation({
            container: this.refs.bodyMovinRef, // the dom element that will contain the animation
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: this.props.animationData // the path to the animation json
        });
    }

    componentWillUnmount() {
        bodymovin.destroy();
    }

    render() {
        return (
            <div className="bodymovin" ref="bodyMovinRef" />
        );
    }
}

BodyMovin.PropTypes = {
    /**
     * The data to be rendered as a SVG.
     * Typically passed in as a prop from the parent
     */
    animationData: PropTypes.object
};

export default BodyMovin;