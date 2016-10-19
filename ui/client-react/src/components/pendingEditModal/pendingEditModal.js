import React from 'react';
import QbIcon from '../qbIcon/qbIcon';
import './pendingEditModal.scss';
import QBModal from '../qbModal/qbModal';
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
        const modalBodyMessage = [
            <div><QbIcon className="alert" icon="alert"/><span id="modalText">Save changes before leaving?</span></div>
        ];
        const buttonArrayLeft = [
            <div  id="buttonStay"><button onClick={this.close}>Stay and keep working</button></div>
        ];
        const buttonArrayRight = [
            <button id="doNotSaveButton">Don't Save</button>,
            <button id="saveButton">Save</button>
        ];
        return <QBModal
                bool={this.props.bool}
                buttonArrayLeft={buttonArrayLeft}
                buttonArrayRight={buttonArrayRight}
                modalBodyMessage={modalBodyMessage} />;
    }
});

export default PendingEditModal;

//a function prop for close
//a function prop to save and redirect
//a function prop to redirect and not save
//a function prop to stay and not save
