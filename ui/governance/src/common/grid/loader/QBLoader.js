import React, {Component} from 'react';
import BodyMovin from "../../../../../reuse/client/src/components/bodyMovin/bodyMovin";
import QBLoaderJSON from "../../../../../reuse/client/src/assets/animations/QBLoader.json";

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
};

export default QBLoader;

