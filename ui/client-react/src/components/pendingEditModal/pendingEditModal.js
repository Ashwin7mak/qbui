import React from 'react';
import QbIcon from '../qbIcon/qbIcon';
import QBModal from '../qbModal/qbModal';
import {Button} from 'react-bootstrap';
import {I18nMessage} from '../../utils/i18nMessage';

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
    render() {
        const modalI18BodyMessage = <I18nMessage message="pendingEditModal.modalBodyMessage"/>;
        const modalI18StayButton = <I18nMessage message="pendingEditModal.modalStayButton"/>;
        const modalI18DoNotSaveButton = <I18nMessage message="pendingEditModal.modalDoNotSaveButton"/>;
        const modalI18SaveButton = <I18nMessage message="pendingEditModal.modalSaveButton"/>;
        let modalTitle = [<div>I am a title!</div>];
        const modalBodyMessage = [
            <div>{modalI18BodyMessage}</div>
        ];
        const modalQBIcon = [
            <QbIcon icon="alert"/>
        ];
        const buttonArrayLeft = [
            <Button>{modalI18StayButton}</Button>
        ];
        const buttonArrayRight = [
            <Button>{modalI18DoNotSaveButton}</Button>,
            <Button bsStyle="primary">{modalI18SaveButton}</Button>
        ];

        return <QBModal
                bool={this.props.bool}
                buttonArrayLeft={buttonArrayLeft}
                buttonArrayRight={buttonArrayRight}
                modalBodyMessage={modalBodyMessage}
                modalQBIcon={modalQBIcon}
                modalTitle={modalTitle} />;
    }
});

export default PendingEditModal;

