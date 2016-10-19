import React from 'react';
import QbIcon from '../qbIcon/qbIcon';
import './pendingEditModal.scss';
import QBModal from '../qbModal/qbModal';
import {Button} from 'react-bootstrap';
import {I18nMessage} from '../../utils/i18nMessage';
import Breakpoints from "../../utils/breakpoints";

const PendingEditModal = React.createClass({
    propTypes: {
        /**
         * this boolean sets whether or not the modal should be shown
         */
        bool: React.PropTypes.boolean,
        /**
         *listen for changes by setting a callback to the onChange prop */
        onChange: React.PropTypes.func,
        /**
         * listen for losing focus by setting a callback to the onBlur prop */
    },

    close() {
        this.setState({showModal: false});
        console.log('close: ', this.setState);
    },

    saveAndRedirect() {},
    stayOnCurrentPage() {},
    doNotSaveAndRedirect() {},
    render() {
        const modalI18BodyMessage = <I18nMessage message="pendingEditModal.modalBodyMessage"/>;
        const modalI18StayButton = <I18nMessage message="pendingEditModal.modalStayButton"/>;
        const modalI18DoNotSaveButton = <I18nMessage message="pendingEditModal.modalDoNotSaveButton"/>;
        const modalI18SaveButton = <I18nMessage message="pendingEditModal.modalSaveButton"/>;
        const modalBodyMessage = [
            <span id="modalText"><h4>{modalI18BodyMessage}</h4></span>
        ];
        const modalBodyQBIcon = [
            <QbIcon className="alert" icon="alert"/>
        ];
        const buttonArrayLeft = [
            <div id="buttonStay"><Button onClick={this.close}>{modalI18StayButton}</Button></div>
        ];
        const buttonArrayRight = [
            <Button id="doNotSaveButton">{modalI18DoNotSaveButton}</Button>,
            <Button id="saveButton" bsStyle="primary">{modalI18SaveButton}</Button>
        ];
        return <QBModal
                bool={this.props.bool}
                buttonArrayLeft={buttonArrayLeft}
                buttonArrayRight={buttonArrayRight}
                modalBodyMessage={modalBodyMessage}
                modalBodyQBIcon={modalBodyQBIcon}/>;
    }
});

export default PendingEditModal;

//a function prop for close
//a function prop to save and redirect
//a function prop to redirect and not save
//a function prop to stay and not save
