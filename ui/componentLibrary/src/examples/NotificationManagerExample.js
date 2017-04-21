// This is a basic example for the React playground
// Please update to include other properties or states for your component

const showSuccessNotification = () => {
    NotificationManager.success('This is a success message.', 'Message Title');
};
const showInformationNotification = () => {
    NotificationManager.info('This is an information message.', 'Message Title');
};
const showWarningNotification = () => {
    NotificationManager.warning('This is a warning message.', 'Message Title');
};
const showErrorNotification = () => {
    NotificationManager.error('This is an error message.', 'Message Title');
};

const basicNotificationManagerExample = (
    <div>
        <p>Click a button to display a type of message.</p>
        <button onClick={showSuccessNotification}>Success</button>&nbsp;
        <button onClick={showInformationNotification}>Information</button>&nbsp;
        <button onClick={showWarningNotification}>Warning</button>&nbsp;
        <button onClick={showErrorNotification}>Error</button>

        <NotificationContainer/>
    </div>

);

ReactDOM.render(basicNotificationManagerExample, mountNode);
