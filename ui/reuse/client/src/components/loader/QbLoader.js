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
            waiting: "",
        };
    }

    componentDidMount() {
        this.timeout = setTimeout(() => {
            this.setState({waiting: "visible"});
        }, this.props.waitTime);
    }

    componentWillUnmount() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    render() {
        if (this.props.isLoading) {
            return (
                <div className="loaderWrapper" style={{width: this.props.width, height: this.props.height}} >
                    <BodyMovin animationData={QbLoaderAnimationData}
                               className={`${this.props.className} ${this.state.waiting}`}/>
                </div>
            );
        } else {
            return (
                <div className="childContainer">
                    {this.props.children}
                </div>
            );
        }
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
    waitTime: PropTypes.number,
    /**
     *  Boolean to show the loader or not
     */
    isLoading: PropTypes.bool,
    /**
     * String to be passed as pixels or percentage to enable styles onLoad
     */
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired
};

QbLoader.defaultProps = {
    className: "",
    width: "0",
    height: "0",
    waitTime: 0
};

export default QbLoader;
