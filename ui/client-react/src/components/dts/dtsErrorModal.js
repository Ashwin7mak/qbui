import React from 'react';
import QBModal from '../qbModal/qbModal';


const DTSErrorModal = React.createClass({
    getInitialState() {
        return {
            isOpen: false
        };
    },
    componentWillReceiveProps() {
        // this.dtsErrorReceived(this.props.show);
        this.setState({
            isOpen: true
        });
    },
    // dtsErrorReceived(show) {
    //     //this will open the modal if an dts sync error is received
    //
    //     }
    // },
    close() {
        //this will close and reroute to classic
        this.setState({
            isOpen: false
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
        console.log('this.props.showDTSErrorModal', this.props.show);
        return (
            <QBModal
                show={this.state.isOpen}
                size="large"
                primaryButtonName={primaryButtonName}
                primaryButtonOnClick={this.close}
                title={title}
                bodyMessage={errorMessage}
                type="dtsAppDeleted" />
        );
    }
});

export default DTSErrorModal;
