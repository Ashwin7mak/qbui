import React, {PropTypes, Component} from 'react';
import BodyMovin from "../bodyMovin/bodyMovin";
import QbLoaderAnimationData from "../../assets/animations/QbLoaderAnimationData.json";

/**
 * The component that composes BodyMovin to enhance its functionality of
 * rendering the new QBLoader from a JSON object
 */
class QbLoader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            waiting: ""
        };
    }

    componentDidMount() {
        let self = this;
        setTimeout(() => {
            self.setState({waiting: "visible"});
        }, self.props.waitTime);
    }

    render() {
        return (<BodyMovin animationData={QbLoaderAnimationData}
                           className={`${this.props.className} ${this.state.waiting}`} />
        );
    }
}

QbLoader.propTypes = {
    /**
     * The new className to be passed from parent for custom styling
     */
    className: PropTypes.string,
    /**
     * The time to be delayed after which the loader fires
     */
    waitTime: PropTypes.number
};

QbLoader.defaultProps = {
    className: "",
    waitTime: 0
};

export default QbLoader;
