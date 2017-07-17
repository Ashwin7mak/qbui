import React, {PropTypes, Component} from "react";

/**
 * Component that uses the After Effects plugin "bodymovin" for exporting animations to svg/canvas/html + js
 * Pass in the JSON object containing the animation from the parent
 * The JSON object is stored under reuse/client/src/assets/animations/
 * Place your new JSON from XD over there and create a wrapper to pass that object into that component
 * See reuse/client/src/components/loader/QBLoader.js for an example
 */
class BodyMovin extends Component {
    constructor(props) {
        super(props);
        this.bodyMovinRef = null;
    }

    /**
     * Setting the ref on the DOM
     * @param element
     * @private
     */
    _setRef = (element) => this.bodyMovinRef = element;

    /**
     *  This method loads the bodyMovin component if its passed as a prop,
     *  else it will render the one from require.
     *  The reason for using this is because the package throws weird errors in Jenkins,
     *  as the package calls in something internal
     */
    _loadBodyMovin = () => {
        if (this.props.bodyMovinPackage) {
            return this.props.bodyMovinPackage;
        } else {
            return require('bodymovin/build/player/bodymovin_light');
        }
    };

    componentDidMount() {
        const bodymovin = this._loadBodyMovin();
        bodymovin.loadAnimation({
            container: this.bodyMovinRef, // the dom element that will contain the animation
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: this.props.animationData // the animation json object
        });
    }

    componentWillUnmount() {
        const bodymovin = this._loadBodyMovin();
        bodymovin.destroy();
    }

    render() {
        return (
            <div className={`${this.props.className} bodyMovin`} ref={this._setRef} />
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
    className: PropTypes.string,
    /**
     * An alternative bodyMovin object to load. Useful during unit tests.
     */
    bodyMovinPackage: PropTypes.any
};

BodyMovin.defaultProps = {
    className: '',
    animationData: {}
};

export default BodyMovin;
