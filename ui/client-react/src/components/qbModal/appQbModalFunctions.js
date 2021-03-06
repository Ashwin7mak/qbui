const SHOW_APP_MODAL_EVENT = 'showAppModal';
const HIDE_APP_MODAL_EVENT = 'hideAppModal';
const appModalId = 'appModal';

/**
 * The functions work in conjunction with appQbModal to allow non-react
 * classes to control a modal on the page.
 *
 * These functions are in a separate file for easier unit testing.
 * When the files were combined as exports with appQbModal, it caused
 * an error related to module loading during unit tests.
 */

/**
 * Shows a modal. Can be used in non-react classes.
 * @param modalDetails The properties of the modal (e.g., title, type, etc.)
 * @constructor
 */
function ShowAppModal(modalDetails) {
    modalDetails = Object.assign(modalDetails, {showModal: true});
    const showModalEvent = new CustomEvent(SHOW_APP_MODAL_EVENT, {detail: modalDetails});
    let modal = document.querySelector(`#${appModalId}`);
    if (modal) {
        modal.dispatchEvent(showModalEvent);
    }
}

/**
 * Hides a modal. Can be used in non-react classes.
 * @constructor
 */
function HideAppModal() {
    const hideModalEvent = new CustomEvent(HIDE_APP_MODAL_EVENT);
    let modal = document.querySelector(`#${appModalId}`);
    if (modal) {
        modal.dispatchEvent(hideModalEvent);
    }
}

export {ShowAppModal, HideAppModal, SHOW_APP_MODAL_EVENT, HIDE_APP_MODAL_EVENT, appModalId};
