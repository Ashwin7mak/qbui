// This is a basic example for the React playground
// Please update to include other properties or states for your component
const EmailFieldValueEditorExample = React.createClass({
    getInitialState() {
        return {
            value: ''
        }
    },
    onChange(newValue) {
        this.setState({value: newValue});
    },
    render() {
        return(
            <div>
                <dt>Default: </dt>
                <dd>
                    <EmailFieldValueEditor value={this.state.value} onChange={this.onChange} />
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
