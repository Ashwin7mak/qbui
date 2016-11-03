import React from 'react';
import QBModal from '../qbModal/qbModal';


const DTSAppDeleted = React.createClass({
    getInitialState() {
        return {
            isOpen: true
        };
    },
    dtsErrorReceived(error) {
        //this will open the modal if an dts sync error is recieved
        if (this.props.error) {
            this.setState({
                isOpen: true
            });
        }
    },
    toggleOpen() {
        //this will close and reroute to classic
        this.setState({
            isOpen: !this.state.isOpen
        });
    },
    render() {
        const title = "Sorry to interrupt your work.";
        const errorMessage = <p>
            We can’t save your changes in Mercury right now, but your
            app is still available in QuickBase Classic. Our team is
            working hard to resolve this and will make your app
            available again in Mercury in 24 hours.
            <br/> <br/>
            Transaction ID: xxxxxx</p>;
        const primaryButtonName = "Open my app in Classic";
        return (
            <QBModal
                show={this.state.isOpen}
                size="large"
                primaryButtonName={primaryButtonName}
                primaryButtonOnClick={this.toggleOpen}
                title={title}
                bodyMessage={errorMessage}
                type="dtsAppDeleted" />
        );
    }
});

export default DTSAppDeleted;
