import React from 'react';
import {Modal} from 'react-bootstrap';
import './invisibleBackdrop.scss';

/**
 * Renders an invisible backdrop over the whole window (usually used when an action is in progress)
 * to disallow additional input
 */
const InvisibleBackdrop = React.createClass({
    propTypes: {
        /**
         * Show the backdrop and disables all user input until show is false
         * */
        show: React.PropTypes.bool,
    },

    getDefaultProps() {
        return {
            show: false
        };
    },

    discardInput(evt) {
        //Cancel the event
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
        return (
                <Modal
                    aria-labelledby="modal-label"
                    bsClass="invisibleBackdropModal"
                    shouldCloseOnOverlayClick={false}
                    show={this.props.show}
                    onHide={this.close}
                    backdrop="static"
                    backdropStyle={{}}
                    keyboard={false}
                    animation={false}
                >
                  {/* all clicks on screen get trapped and discarded */}
                  <a className="invisibleLink" onClick={this.discardInput}>
                  </a>
                </Modal>
        );
    },

});
export default InvisibleBackdrop;
