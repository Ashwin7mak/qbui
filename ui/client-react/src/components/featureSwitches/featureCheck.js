import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

export const FeatureCheck = React.createClass({

    propTypes: {
        /**
         * The name of the feature
         */
        featureName: PropTypes.string.isRequired,
        /**
         * show the wrapped children if the feature state is on (set false to hide) */
        show: PropTypes.bool,
        /**
         * class name to add to wrapper element
         */
        className: PropTypes.string,
        /**
         * component to wrap children around (defaults to a DIV)
         */
        component: PropTypes.any
    },

    getDefaultProps() {
        return {
            show: true,
            component: 'div',
            className: ''
        };
    },

    getFeatureState(name) {
        const lowercaseName = name.toLowerCase();

        const found = _.find(this.props.states, (feature) => feature.name.toLowerCase() === lowercaseName);
        return found && found.status;
    },

    render() {

        const featureState = this.getFeatureState(this.props.featureName);

        if (featureState && this.props.show) {

            // wrap the children around a div with optional class name
            return React.createElement(this.props.component, {className: this.props.className}, this.props.children);
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
