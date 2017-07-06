import React, {Component} from 'react';
import BodyMovin from "../bodyMovin/bodyMovin";
import QBLoaderJSON from "../../assets/animations/QBLoader.json";

/**
 * A higher order component that composes BodyMovin component and passes the
 * animation as a prop down to the child
 */
class QBLoader extends Component {
    render() {
        return (
            <BodyMovin animationData={QBLoaderJSON} />
        );
    }
}

export default QBLoader;

