import React from 'react';
import QbIcon from '../qbIcon/qbIcon';
import './pendingEditModal.scss';
import './pendingEditModalSmallBreakpoint.scss';
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
        let modal;
        let isSmall = Breakpoints.isSmallBreakpoint();
        console.log('isSmall: ', isSmall);
        const modalI18BodyMessage = <I18nMessage message="pendingEditModal.modalBodyMessage"/>;
        const modalI18StayButton = <I18nMessage message="pendingEditModal.modalStayButton"/>;
        const modalI18DoNotSaveButton = <I18nMessage message="pendingEditModal.modalDoNotSaveButton"/>;
        const modalI18SaveButton = <I18nMessage message="pendingEditModal.modalSaveButton"/>;
        /**
        * The below consts are set for large breakpoint modal*/
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
        /**
         * The below consts are for small breakpoint modal*/
        const smallModalBodyMessage = [
            <span id="smallModalText"><h4>{modalI18BodyMessage}</h4></span>
        ];
        const smallModalBodyQBIcon = [
            <QbIcon className="smallAlert" icon="alert"/>
        ];
        const smallButtonArrayLeft = [
            <Button id="smallSaveButton" bsStyle="primary">{modalI18SaveButton}</Button>
        ];
        const smallButtonArrayRight = [
            <Button id="smallDoNotSaveButton">{modalI18DoNotSaveButton}</Button>,
            <Button id="smallButtonStay" onClick={this.close}>{modalI18StayButton}</Button>
        ];
        if (!isSmall) {
            modal = [
                <QBModal
                bool={this.props.bool}
                buttonArrayLeft={buttonArrayLeft}
                buttonArrayRight={buttonArrayRight}
                modalBodyMessage={modalBodyMessage}
                modalBodyQBIcon={modalBodyQBIcon}/>
            ];
        } else {
            modal = [
                <QBModal
                    bool={this.props.bool}
                    buttonArrayLeft={smallButtonArrayLeft}
                    buttonArrayRight={smallButtonArrayRight}
                    modalBodyMessage={smallModalBodyMessage}
                    modalBodyQBIcon={smallModalBodyQBIcon}/>
            ];
        }
        return <div>
            {modal}
            </div>;
    }
});

export default PendingEditModal;

//a function prop for close
//a function prop to save and redirect
//a function prop to redirect and not save
//a function prop to stay and not save
