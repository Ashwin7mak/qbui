import React, {PropTypes, Component} from "react";
import ReactDOM from "react-dom";
import bodymovin from "bodymovin";
import "./bodyMovin.scss";

class BodyMovin extends Component {

    constructor(props) {
        super(props);

        this.bodyMovinDiv = null;
    }

    componentDidMount() {
            bodymovin.loadAnimation({
                container: ReactDOM.findDOMNode(this.bodyMovinDiv), // the dom element that will contain the animation
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: this.props.animationData // the path to the animation json
            });
    }

    componentWillUnmount() {
        bodymovin.destroy();
    }

    bodyMovinRef = ref => this.bodyMovinDiv = ref;

    render() {
        return (
            <div className="bodymovin" ref={this.bodyMovinRef} />
        );
    }
}

BodyMovin.PropTypes = {
    animationData: PropTypes.object
};

export default BodyMovin;