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
        const modalTitle = [
            <div>Modal Title</div>
        ];
        const modalBodyMessage = [
            <div>Modal Body Message</div>
        ];
        // const modalQBIcon = [
        //     <QbIcon icon="alert"/>
        // ];
        const buttonArrayLeft = [
            <button onClick={this.closeAll}>Tertiary</button>
        ];
        const buttonArrayRight = [
            <button onClick={this.closeAll}>Secondary</button>,
            <button onClick={this.closeAll} bsStyle="primary">Primary</button>
        ];
        const singleButton = [
            <button onClick={this.closeAll} bsStyle="primary">Primary</button>
        ];
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
                        buttonArrayLeft={buttonArrayLeft}
                        primaryButtonName="Primary Button"
                        primaryButtonOnClick={this.closeAll}
                        middleButtonName="Middle Button"
                        middleButtonOnClick={this.closeAll}
                        modalBodyMessage={modalBodyMessage}
                        modalTitle={modalTitle} />
                </div>
                {/*Critical Alert Modal*/}
                <div>
                    <QBModal
                        show={this.state.criticalAlertQBModalOpen}
                        buttonArrayLeft={buttonArrayLeft}
                        primaryButtonName="Primary Button"
                        primaryButtonOnClick={this.closeAll}
                        middleButtonName="Middle Button"
                        middleButtonOnClick={this.closeAll}
                        modalBodyMessage={modalBodyMessage}
                        QBIconName="alert" />
                </div>
                {/*Single Button Modal*/}
                <div>
                    <QBModal
                        show={this.state.singleButtonQBModal}
                        primaryButtonName="Primary Button"
                        primaryButtonOnClick={this.closeAll}
                        buttonArrayRight={singleButton}
                        modalBodyMessage={modalBodyMessage}/>
                </div>
            </div>

        );
    }
});

ReactDOM.render(<BasicQBModalExample />, mountNode);
