import React from 'react';
import QBModal from '../qbModal/qbModal';

const DTSAppDeleted = React.createClass({
    getInitialState() {
        return {
            isOpen: false
        };
    },
    toggleOpen() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    },
    render() {
        const errorMessage = "DTS error has happened. \n Your app will be deleted from the new stack. \n You will be re-directed back to the current stack to \n use this app.\n\nYour app will be migrated back to Mercury in 24 hours.\nTransaction ID: xxxxxx";
        const primaryButtonName = "Ok, go back to current stack.";
        return (
            <QBModal
                show={true}
                primaryButtonName={primaryButtonName}
                primaryButtonOnClick={this.toggleOpen}
                bodyMessage={errorMessage}
                type="dtsAppDeleted" />
        );
    }
});

export default DTSAppDeleted;
