import React from 'react';
import catchClickOutside from './catchClickOutside';

var thwartClicksWrapper = (Component) => {

    const OutsideClickWrapped = React.createClass({

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

