import React, {PropTypes} from 'react';
import _ from 'lodash';

/**
 * A higher-order component which wraps a component, generates a uniqueId and passes to the wrapped
 * component.
 */
const withUniqueIdWrapper = (Component, context) => {
    class WithUniqueId extends React.Component {
        constructor(...args) {
            super(...args);
            this.uniqueId = _.uniqueId(context);
        }

        render() {
            return <Component uniqueId={this.uniqueId} {...this.props} />;
        }
    }

    WithUniqueId.propTypes = {
        /* the component's context, used as part of the key value for the redux store entry */
        context: PropTypes.string
    };

    return WithUniqueId;
};

export default withUniqueIdWrapper;
