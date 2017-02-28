import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import _ from 'lodash';
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

        if (_.has(evt, 'nativeEvent.cancelBubble')) {
            evt.nativeEvent.cancelBubble = true;
        }
        if (_.has(evt, 'nativeEvent.cancel')) {
            evt.nativeEvent.cancel = true;
        }
        if (_.has(evt, 'nativeEvent.returnValue')) {
            evt.nativeEvent.returnValue = false;
        }
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
                  <div className="invisibleLink" onClick={this.discardInput}> </div>
                </Modal>
        );
    },

});
export default InvisibleBackdrop;
