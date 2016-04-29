import React from 'react';
import catchClickOutside from './catchClickOutside';

var thwartClicksWrapper = (Component) => {

    const OutsideClickWrapped = React.createClass({

        handleClickOutside(evt) {
            if (this.props.handleClickOutside) {
                this.props.handleClickOutside(evt);
            }
            //console.log('clicked outside' + evt.target);
        },
        render() {
            return <Component
                {...this.props}
                {...this.state}
            />;
        }
    });
    return (catchClickOutside(OutsideClickWrapped));
};

export default thwartClicksWrapper;

