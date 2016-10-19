import React from 'react';
import {Modal, Button} from 'react-bootstrap';

const QBModals = React.createClass({
    propTypes: {
        /**
         * this boolean sets whether or not the modal should be shown
         */
        bool: React.PropTypes.boolean,
        /**
         *This is the message for the modal body
         */
        modalBodyMessage: React.PropTypes.string,
        /**
         *This is an array of buttons for the left side of the footer
         */
        buttonArrayLeft: React.PropTypes.array,
        /**
         *This is an array of buttons for the right side of the footer
         */
        buttonArrayRight: React.PropTypes.array
    },
    render() {
        // console.log('this.props.buttonArrayLeft:', this.props.buttonArrayLeft);
        // console.log('this.props.buttonArrayRight: ', this.props.buttonArrayRight);
        return <div>
            <Modal show={this.props.bool} onHide={this.close}>
                    <Modal.Body>
                        {this.props.modalBodyMessage}
                    </Modal.Body>
                    <Modal.Footer>
                        {this.props.buttonArrayLeft}
                        {this.props.buttonArrayRight}
                    </Modal.Footer>
            </Modal>
        </div>;
    }
});

export default QBModals;
