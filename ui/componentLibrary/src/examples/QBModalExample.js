// import QbIcon from '../../../client-react/src/components/qbIcon/qbIcon';
// This is a basic example for the React playground
// Please update to include other properties or states for your component



var BasicQBModalExample = React.createClass({
    getInitialState() {
        return {
            defaultQBModalOpen: false,
            criticalAlertQBModalOpen: false,
            singleButtonQBModal: false,
            qbIconTitleBodyMessage: false,
            titleBodyMessageTwoButtons: false
        };
    },

    toggleDefaultQBModal() {
        this.setState({defaultQBModalOpen: !this.state.defaultQBModalOpen});
    },

    toggleCriticalAlertQBModal() {
        this.setState({criticalAlertQBModalOpen: !this.state.criticalAlertQBModalOpen});
    },

    singleButtonQBModal() {
        this.setState({singleButtonQBModal: !this.state.singleButtonQBModal});
    },

    qbIconTitleBodyMessage() {
        this.setState({qbIconTitleBodyMessage: !this.state.qbIconTitleBodyMessage});
    },

    titleBodyMessageTwoButtons() {
        this.setState({titleBodyMessageTwoButtons: !this.state.titleBodyMessageTwoButtons});
    },
    closeAll() {
        this.setState({
            defaultQBModalOpen: false,
            criticalAlertQBModalOpen: false,
            singleButtonQBModal: false,
            qbIconTitleBodyMessage: false,
            titleBodyMessageTwoButtons: false
        });
    },

    render() {
        let longBodyMessage = "Long Body Message Long Body Message Long Body MessageLong Body MessageLong Body MessageLong Body MessageLong Body MessageLong Body MessageLong Body MessageLong Body MessageLong Body Message";

        return (
            <div>
                {/*Show Default Modal Button*/}
                <div>
                    <button onClick={this.toggleDefaultQBModal}>Show Default Modal</button>
                </div>
                {/*Show Critical Alert Button*/}
                <div style={{paddingTop:"12px"}}>
                    <button onClick={this.toggleCriticalAlertQBModal}>Show Critical Alert Modal</button>
                </div>
                {/*Show Single Button Modal*/}
                <div style={{paddingTop:"12px"}}>
                    <button onClick={this.singleButtonQBModal}>Show Single Button Modal</button>
                </div>
                {/*Show qbIcon Title bodyMessage*/}
                <div style={{paddingTop:"12px"}}>
                    <button onClick={this.qbIconTitleBodyMessage}>Show qbIcon Title bodyMessage</button>
                </div>
                {/*Show Title bodyMessage Two Buttons*/}
                <div style={{paddingTop:"12px"}}>
                    <button onClick={this.titleBodyMessageTwoButtons}>Show Title bodyMessage Two Buttons</button>
                </div>
                {/*Default Modal*/}
                <div>
                    <QBModal
                        show={this.state.defaultQBModalOpen}
                        primaryButtonName="Primary Button"
                        primaryButtonOnClick={this.closeAll}
                        middleButtonName="Middle Button"
                        middleButtonOnClick={this.closeAll}
                        leftButtonName="Left Button"
                        leftButtonOnClick={this.closeAll}
                        bodyMessage="Body Message"
                        title="Title" />
                </div>
                {/*Critical Alert Modal*/}
                <div>
                    <QBModal
                        show={this.state.criticalAlertQBModalOpen}
                        primaryButtonName="Primary Button"
                        primaryButtonOnClick={this.closeAll}
                        middleButtonName="Middle Button"
                        middleButtonOnClick={this.closeAll}
                        leftButtonName="Left Button"
                        leftButtonOnClick={this.closeAll}
                        bodyMessage="Body Message"
                        qbIconName="alert" />
                </div>
                {/*Single Button Modal*/}
                <div>
                    <QBModal
                        show={this.state.singleButtonQBModal}
                        primaryButtonName="Primary Button"
                        primaryButtonOnClick={this.closeAll}
                        bodyMessage="Body Message"
                        title="Title"/>
                </div>
                {/*qbIcon Title bodyMessage*/}
                <div>
                    <QBModal
                        show={this.state.qbIconTitleBodyMessage}
                        primaryButtonName="Primary Button"
                        primaryButtonOnClick={this.closeAll}
                        leftButtonName="Left Button"
                        leftButtonOnClick={this.closeAll}
                        bodyMessage={longBodyMessage}
                        qbIconName="check"
                        title="Title" />
                </div>
                {/*Title bodyMessage Two Buttons*/}
                <div>
                    <QBModal
                        show={this.state.titleBodyMessageTwoButtons}
                        primaryButtonName="Primary Button"
                        primaryButtonOnClick={this.closeAll}
                        leftButtonName="Left Button"
                        leftButtonOnClick={this.closeAll}
                        bodyMessage={longBodyMessage}
                        title="Title" />
                </div>
            </div>

        );
    }
});

ReactDOM.render(<BasicQBModalExample />, mountNode);
