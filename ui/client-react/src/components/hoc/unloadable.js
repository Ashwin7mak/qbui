import React, {PropTypes} from 'react';

/**
 * A higher-order component which wraps the passed in component.
 * Intended to be used for components which add entries in a redux store. This HOC calls a passed
 * loadEntry function when stating up and also calls unloadEntry when unmounting the component.
 * Calling unloadEntry should remove the component instance's data from the redux store.
 */
const unloadableWrapper = (Component) => {
    class Unloadable extends React.Component {
        componentDidMount() {
            if (!this.props.hasEntry) {
                this.loadEntry();
            }
        }

        /**
         * If no entry exists in the store, this is most likely because the data for this instance
         * was removed from the store. Fire a new request to load new data.
         */
        componentWillReceiveProps(nextProps) {
            if (this.props.hasEntry && !nextProps.hasEntry) {
                this.loadEntry();
            }
        }

        loadEntry() {
            if (this.props.loadEntry) {
                this.props.loadEntry(this.props.uniqueId);
            }
        }

        componentWillUnmount() {
            if (this.props.unloadEntry) {
                this.props.unloadEntry(this.props.uniqueId);
            }
        }

        render() {
            let classNames = ['unloadable' + (this.props.uniqueId || '')];
            if (this.props.className) {
                classNames = classNames.concatthis.props.className();
            }
            if (this.props.hasEntry) {
                return <Component {...this.props} className={classNames.join(' ')} />;
            } else {
                return null;
            }
        }
    }

    Unloadable.propTypes = {
        // a unique ID given to this instance, which is the key used in the redux store to map to
        // a data entry
        uniqueId: PropTypes.string.isRequired,
        // function to call to populate the redux store with data corresponding to this instance
        loadEntry: PropTypes.func,
        // function to call when this component is being unmounted
        unloadEntry: PropTypes.func,
        // whether data for this specific instance exists in the redux store
        hasEntry: PropTypes.bool.isRequired
    };

    return Unloadable;
};

export default unloadableWrapper;

/**
 * An invisible div wrapped in the unloadable HOC. Use when there's no need to wrap a component with the HOC. Simply
 * render the UnloadableNode. When the parent component mounts/unmounts, loadEntry and unloadEntry will be called
 * respectively.
 */
class InvisibleNode extends React.Component {
    render() {
        return (
            <div className={this.props.className} style={{display: 'none'}} >
                {this.props.children}
            </div>);
    }
}
export const UnloadableNode = unloadableWrapper(InvisibleNode);
