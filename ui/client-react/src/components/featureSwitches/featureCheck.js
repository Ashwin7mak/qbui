import React from 'react';
import {connect} from 'react-redux';

export const FeatureCheck = React.createClass({

    getPropTypes() {
        return {
            featureName: React.PropTypes.string.isRequired,
            show: React.PropTypes.bool
        };
    },

    getDefaultProps() {
        return {
            show: true
        };
    },

    checkFeature(name) {
        return this.props.states[name];
    },

    render() {

        const featureOn = this.checkFeature(this.props.featureName);

        if (this.props.show) {
            return featureOn ? this.props.children : null;
        } else {
            return featureOn ? null : this.props.children;
        }
    }
});

const mapStateToProps = (state) => {

    return {
        states: state.featureSwitches.states
    };
};

export default connect(
    mapStateToProps
)(FeatureCheck);
