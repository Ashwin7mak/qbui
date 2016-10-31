const SHOW_APP_MODAL_EVENT = 'showAppModal';
const HIDE_APP_MODAL_EVENT = 'hideAppModal';
const appModalId = 'appModal';

/**
 * Shows a modal. Can be used in non-react classes.
 * @param modalDetails The properties of the modal (e.g., title, type, etc.)
 * @constructor
 */
function ShowAppModal(modalDetails) {
    modalDetails = Object.assign(modalDetails, {showModal: true});
    let showModalEvent = new CustomEvent(SHOW_APP_MODAL_EVENT, {detail: modalDetails});
    document.querySelector(`#${appModalId}`).dispatchEvent(showModalEvent);
}

/**
 * Hides a modal. Can be used in non-react classes.
 * @constructor
 */
function HideAppModal() {
    let hideModalEvent = new CustomEvent(HIDE_APP_MODAL_EVENT);
    document.querySelector(`#${appModalId}`).dispatchEvent(hideModalEvent);
}

export {ShowAppModal, HideAppModal};
