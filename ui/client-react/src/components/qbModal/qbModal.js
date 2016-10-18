import React from 'react';
import QbIcon from '../qbIcon/qbIcon';
import './qbModal.scss';
import {I18nMessage} from '../../utils/i18nMessage';
import Breakpoints from "../../utils/breakpoints";
import {Modal, Button} from 'react-bootstrap';

const QBModals = React.createClass({
    propTypes: {
        /**
         * this boolean sets whether or not the modal should be shown
         */
        bool: React.PropTypes.boolean,
        /**
         * optional string to display when input is empty aka ghost text */
        placeholder: React.PropTypes.string,
        /**
         *listen for changes by setting a callback to the onChange prop */
        onChange: React.PropTypes.func,
        /**
         * listen for losing focus by setting a callback to the onBlur prop */
    },
    getInitialState() {
        let tempBool = false;
        if (this.props.bool) {
            tempBool = this.props.bool;
        }
        return {showModal: tempBool};
    },

    close() {
        this.setState({showModal: false});
        console.log('close: ', this.setState);
    },

    open() {
        this.setState({showModal: true});
    },
    render() {
        console.log('this.props.bool: ', this.props.bool);
        console.log('this.state.showModal: ', this.state.showModal);
        return <div>
            <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Body>
                        <QbIcon className="alert" icon="alert"/><span id="modalText">Save changes before leaving?</span>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button id="buttonStay" onClick={this.close}>Stay and keep working</Button>
                        <Button class="buttonDoNotSave" onClick={this.close}>Don't Save</Button>
                        <Button class="buttonSave" bsStyle="primary" onClick={this.close}>Save</Button>
                    </Modal.Footer>
            </Modal>
        </div>;
    }
});

export default QBModals;
