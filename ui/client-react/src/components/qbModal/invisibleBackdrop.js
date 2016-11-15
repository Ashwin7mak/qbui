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

    render() {
        return (
                <Modal
                    aria-labelledby="modal-label"
                    bsClass="invisibleBackdropModal"
                    show={this.props.show}
                    onHide={this.close}
                    backdrop="static"
                    backdropStyle={{}}
                    keyboard={false}
                    animation={false}
                >
                  <div></div>
                </Modal>
        );
    },

});
export default InvisibleBackdrop;
