// This is a basic example for the React playground
// Please update to include other properties or states for your component
const EmailFieldValueEditorExample = React.createClass({
    getInitialState() {
        return {
            value: '',
            isInvalid: false,
            invalidMessage: ''
        };
    },
    onChange(newValue) {
        this.setState({value: newValue});
    },
    onValidated(result) {
        this.setState({isInvalid: result.isInvalid, invalidMessage: result.invalidMessage});
    },
    render() {
        return (
            <div>
                <dt>Default: </dt>
                <dd>
                    <EmailFieldValueEditor value={this.state.value}
                                           onChange={this.onChange}
                                           onValidated={this.onValidated}
                                           isInvalid={this.state.isInvalid}
                                           invalidMessage={this.state.invalidMessage} />
                </dd>

                <dt>Invalid: </dt>
                <dd>
                    <EmailFieldValueEditor value={this.state.value} onChange={this.onChange} isInvalid={true} />
                </dd>
            </div>
        );
    }
});

ReactDOM.render(<EmailFieldValueEditorExample />, mountNode);
