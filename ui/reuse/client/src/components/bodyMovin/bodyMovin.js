import React, {Component} from 'react';
import ReactDOM from "react-dom";
import bodymovin from "bodymovin";
import QBLoader from "../../assets/animations/QBLoader.json";

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
                animationData: QBLoader // the path to the animation json
            });
    }


    componentWillUnmount() {
        bodymovin.destroy();
    }

    bodyMovinRef = ref => this.bodyMovinDiv = ref;

    render() {
        return (
            <div className="customAnimation" ref={this.bodyMovinRef} />
        );
    }
}

export default BodyMovin;