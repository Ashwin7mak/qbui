import React from 'react';
import QbModal from './qbModal';
import Locale from '../../locales/locales';
import {SHOW_APP_MODAL_EVENT, HIDE_APP_MODAL_EVENT, appModalId} from './appQbModalFunctions';

const blankModal = {
    showModal: false,
    messageI18nKey: null,
    titleI18nKey: null,
    type: 'standard',
    primaryButtonI18nKey: null,
    primaryButtonOnClick: null,
    middleButtonI18nKey: null,
    middleButtonOnClick: null,
    leftButtonI18nKey: null,
    leftButtonOnClick: null
};


/**
 * In most cases, use QbModal. Do not use this component directly.
 *
 * The AppQbModal wraps QbModal in a way that non-react classes and events can
 * access and display a modal. For example, the AppHistory object lives outside of React
 * but needs to display a modal based on specific events. The AppHistory can import the
 * ShowAppModal and HideAppModal functions to show/hide a modal without using React directly.
 */
const AppQbModal = React.createClass({
    getInitialState() {
        return blankModal;
    },
    componentDidMount() {
        let appModalDomComponent = document.querySelector(`#${appModalId}`);

        if (appModalDomComponent) {
            document.querySelector(`#${appModalId}`).addEventListener(SHOW_APP_MODAL_EVENT, this.showModal);
            document.querySelector(`#${appModalId}`).addEventListener(HIDE_APP_MODAL_EVENT, this.hideModal);
        }
    },
    componentWillUnmount() {
        let appModalDomComponent = document.querySelector(`#${appModalId}`);

        if (appModalDomComponent) {
            document.querySelector(`#${appModalId}`).removeEventListener(SHOW_APP_MODAL_EVENT);
            document.querySelector(`#${appModalId}`).removeEventListener(HIDE_APP_MODAL_EVENT);
        }
    },
    showModal(evt) {
        this.setState(evt.detail);
    },
    hideModal() {
        this.setState(blankModal);
    },
    _resetModal() {
        this.setState(blankModal);
    },
    render() {
        return (
            <div id={appModalId}>
                <QbModal
                    show={this.state.showModal}
                    bodyMessage={this.state.messageI18nKey ? Locale.getMessage(this.state.messageI18nKey) : null}
                    title={this.state.titleI18nKey ? Locale.getMessage(this.state.titleI18nKey) : null}
                    type={this.state.type}
                    primaryButtonName={this.state.primaryButtonI18nKey ? Locale.getMessage(this.state.primaryButtonI18nKey) : null}
                    primaryButtonOnClick={this.state.primaryButtonOnClick}
                    middleButtonName={this.state.middleButtonI18nKey ? Locale.getMessage(this.state.middleButtonI18nKey) : null}
                    middleButtonOnClick={this.state.middleButtonOnClick}
                    leftButtonName={this.state.leftButtonI18nKey ? Locale.getMessage(this.state.leftButtonI18nKey) : null}
                    leftButtonOnClick={this.state.leftButtonOnClick}
                />
            </div>
        );
    }
});

export default AppQbModal;
