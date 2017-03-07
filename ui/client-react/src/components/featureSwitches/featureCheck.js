import React from 'react';
import {connect} from 'react-redux';

export const FeatureCheck = React.createClass({

    propTypes: {
        /**
         * The name of the feature */
        featureName: React.PropTypes.string.isRequired,
        /**
         * show the wrapped children if the feature state is on (set false to hide) */
        show: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            show: true
        };
    },

    getFeatureState(name) {
        return this.props.states[name];
    },

    render() {

        const featureState = this.getFeatureState(this.props.featureName);

        if (typeof featureState === "boolean" && this.props.show) {
            return featureState ? this.props.children : null;
        }

        return null; // feature not found or show=false
    }
});

/**
 * map the feature switch states from redux store to states prop
 * @param state
 * @returns {{states: (*|Array)}}
 */
const mapStateToProps = (state) => {

    return {
        states: state.featureSwitches.states
    };
};

export default connect(
    mapStateToProps
)(FeatureCheck);
