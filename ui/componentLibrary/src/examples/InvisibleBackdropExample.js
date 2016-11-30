// This is a basic example for the React playground
// Please update to include other properties or states for your component

var BasicInvisibleBackdropExample = React.createClass({
    getInitialState() {
        return {
            show: false
        };
    },

    onClick() {
        this.setState({show: !this.state.show});
    },

    popAlert() {
        /*eslint no-alert:0 */
        alert('got click');
    },
    render() {
        var divStyle = {paddingTop: "12px"};
        return (
            <div>
                {/*Show InvisibleBackdrop*/}
                <div style={divStyle}>
                    Click the buttons below to see the input below is not accessible when backdrop is shown. Refresh page to see without backdrop
                    <button onClick={this.onClick}>toggle showing backdrop
                    </button>
                    <div style={divStyle}>
                        Currently state.show {this.state.show ? " true" : " false"}
                    </div>

                </div>
                <div style={divStyle}>Default:</div>
                <div style={{position:"relative", height:"300px", overflow:"hidden", marginTop:"12px"}}>
                    <div style={divStyle}>
                    <InvisibleBackdrop show={this.state.show}/>

                    <button onClick={this.popAlert}>Click to note not accepting input when backdrop is shown</button>
                    <label> Input : <input type="text" size={50} placeholder="no input with backdrop shown"/></label>
                        </div>
                </div>
            </div>
        );
    }
});

ReactDOM.render(<BasicInvisibleBackdropExample />, mountNode);
