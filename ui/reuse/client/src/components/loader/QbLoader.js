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
            waiting: true,
        };
        let that = this;
        setTimeout(() => {
            that.show();
        }, that.props.waitTime);
    };

    show = () => {
        this.setState({waiting: false});
    };

    render() {
        return (<BodyMovin animationData={QbLoaderAnimationData}
                           className={`${this.state.waiting} ${this.props.className}`}
                />
        );
    }
}

QbLoader.propTypes = {
    /**
     * The new className to be passed from parent for custom styling
     */
    className: PropTypes.string,
    /**
     * The time to be delayed before firing off the component
     */
    waitTime: PropTypes.number
};

QbLoader.defaultProps = {
    className: "",
    waitTime: 0
};

export default QbLoader;
