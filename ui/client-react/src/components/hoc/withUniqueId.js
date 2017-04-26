import React, {PropTypes} from 'react';
import _ from 'lodash';

/**
 * A higher-order component which wraps a component, generates a uniqueId and passes to the wrapped
 * component.
 *
 * @param {Component} Component
 * @param {String} context  the component's context, used as part of the key value for the redux
 *                          store entry
 * @param {String} uniqueId the component will use the passed in uniqueId if available (used
 *                          mostly for testing)
 */
const withUniqueIdWrapper = (Component, context, uniqueId) => {
    class WithUniqueId extends React.Component {
        constructor(props) {
            super(props);
            this.uniqueId = uniqueId || _.uniqueId(context);
        }

        render() {
            return <Component {...this.props} uniqueId={this.uniqueId} />;
        }
    }

    return WithUniqueId;
};

export default withUniqueIdWrapper;
