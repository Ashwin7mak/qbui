import React from 'react';
import QBModal from '../qbModal/qbModal';


const DTSErrorModal = React.createClass({
    ///There will be no state
    //There will be no function to close modal
    //Everything will exist in it's parents
    //This is only for building/testing purposes right now
    getInitialState() {
        return {
            isOpen: false
        };
    },
    componentWillReceiveProps(props) {
        //I can get ride of this, and on click, fire off a function, that will fire off a listener
        //that willl change
        // this.dtsErrorReceived(this.props.show);
        this.setState({
            isOpen: props.show
        });
    },
    close() {
        //this will close and reroute to classic
        this.setState({
            isOpen: false
        });
    },
    render() {
        const title = "Sorry to interrupt your work";
        const errorMessage = <p>
            Mercury can’t continue running your app today, but will resume tomorrow.
            Your app is still available in QuickBase Classic.
            <br/> <br/>
            Transaction ID: {this.props.tid}</p>;
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
