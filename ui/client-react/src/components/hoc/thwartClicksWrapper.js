import React from 'react';
import catchClickOutside from './catchClickOutside';

var thwartClicksWrapper = (Component) => {

    const OutsideClickWrapped = React.createClass({

        propTypes :  {
            // optionally specify the callback to call when user clicks outside
            // the component to process the outside click events
            handleClickOutside: React.PropTypes.func,
        },

        handleClickOutside(evt) {
            if (this.props.handleClickOutside) {
                this.props.handleClickOutside(evt);
            }
            //Cancel, kill, murder the javascript event
            //stop the event from continuing
            evt.cancelBubble = true;
            evt.cancel = true;
            evt.returnValue = false;
            if (evt.stopPropagation) {
                evt.stopPropagation();
            }
            if (evt.preventDefault) {
                evt.preventDefault();
            }
            if (evt.stopImmediatePropagation) {
                evt.stopImmediatePropagation();
            }
            return false;
        },
        render() {
            return <Component
                preventDefault={true}
                stopPropagation={true}
                {...this.props}
                {...this.state}
            />;
        }
    });
    return (catchClickOutside(OutsideClickWrapped));
};

export default thwartClicksWrapper;

