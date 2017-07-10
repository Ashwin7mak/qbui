import React, {PropTypes, Component} from 'react';
import BodyMovin from "../bodyMovin/bodyMovin";
import QbLoaderAnimationData from "../../assets/animations/QbLoaderAnimationData.json";

/**
 * The component that composes BodyMovin to enhance its functionality of
 * rendering the new QBLoader from a JSON object
 */
class QbLoader extends Component {

    render() {
        return (<BodyMovin animationData={QbLoaderAnimationData}
                           className={this.props.className}
                />
        );
    }
}

QbLoader.propTypes = {
    /**
     * The new className to be passed from parent for custom styling
     */
    className: PropTypes.string
};

QbLoader.defaultProps = {
    className: "",
};

export default QbLoader;
