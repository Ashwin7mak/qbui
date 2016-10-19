import React from 'react';
import {Modal} from 'react-bootstrap';

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
         *This is the QBIcon for the modal body
         */
        modalBodyQBIcon: React.PropTypes.array,
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
        return <div>
            <Modal show={this.props.bool} onHide={this.close}>
                    <Modal.Title>
                        {this.props.modalBodyQBIcon}
                    </Modal.Title>
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
