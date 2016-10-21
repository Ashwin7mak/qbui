// import QbIcon from '../../../client-react/src/components/qbIcon/qbIcon';
// This is a basic example for the React playground
// Please update to include other properties or states for your component



var BasicQBModalExample = React.createClass({
    getInitialState() {
        return {
            defaultQBModalOpen: false,
            criticalAlertQBModalOpen: false,
            singleButtonQBModal: false
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

    closeAll() {
        this.setState({
            defaultQBModalOpen: false,
            criticalAlertQBModalOpen: false,
            singleButtonQBModal: false
        });
    },

    render() {
        const bodyMessage = "Body Message";

        return (
            <div>
                {/*Toggle Default Modal Button*/}
                <div>
                    <button onClick={this.toggleDefaultQBModal}>Toggle Default Modal</button>
                </div>
                {/*Toggle Critical Alert Button*/}
                <div style={{paddingTop:"12px"}}>
                    <button onClick={this.toggleCriticalAlertQBModal}>Toggle Critical Alert Modal</button>
                </div>
                {/*Toggle Single Button Modal*/}
                <div style={{paddingTop:"12px"}}>
                    <button onClick={this.singleButtonQBModal}>Toggle Single Button Modal</button>
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
                        bodyMessage={bodyMessage}
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
                        bodyMessage={bodyMessage}
                        QBIconName="alert" />
                </div>
                {/*Single Button Modal*/}
                <div>
                    <QBModal
                        show={this.state.singleButtonQBModal}
                        primaryButtonName="Primary Button"
                        primaryButtonOnClick={this.closeAll}
                        bodyMessage={bodyMessage}
                        title="Title"/>
                </div>
            </div>

        );
    }
});

ReactDOM.render(<BasicQBModalExample />, mountNode);
