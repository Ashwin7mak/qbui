const UrlFieldValueEditorExample = React.createClass({
    getInitialState() {
        return {
            value: 'https://www.quickbase.com',
            invalidValue: 'quickbase'
        };
    },
    onChange(newValue) {
        this.setState({value: newValue});
    },
    onChangeInvalidValue(newValue) {
        this.setState({value: newValue});
    },
    render() {
        return (
            <div>
                <dt>Default: </dt>
                <dd>
                    <UrlFieldValueEditor value={this.state.value} onChange={this.onChange} />
                </dd>

                <dt>Invalid: </dt>
                <dd>
                    <UrlFieldValueEditor isInvalid={true}
                                         invalidMessage="Invalid url"
                                         value={this.state.invalidValue}
                                         onChange={this.onChangeInvalidValue} />
                </dd>
            </div>
        );
    }
});

ReactDOM.render(<UrlFieldValueEditorExample />, mountNode);
