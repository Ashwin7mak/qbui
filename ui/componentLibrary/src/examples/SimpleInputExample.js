class SimpleInputExample extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            maxLengthValue: '',
            maskValue: ''
        };
    }

    onChange = value => this.setState({value});
    onChangeMask = value => this.setState({maskValue: value});
    onChangeMaxLength = value => this.setState({maxLengthValue: value});

    render() {
        return (
            <div>
                <dt>Default: </dt>
                <dd>
                    <SimpleInput value={this.state.value} onChange={this.onChange} />
                </dd>

                <dt>Required input: </dt>
                <dd>
                    <SimpleInput value={this.state.value} onChange={this.onChange} isRequired={true} />
                </dd>

                <dt>With a label: </dt>
                <dd>
                    <SimpleInput value={this.state.value} onChange={this.onChange} label="First name" />
                </dd>

                <dt>With validation error: </dt>
                <dd>
                    <SimpleInput value={this.state.value} onChange={this.onChange} validationErrorMessage="Invalid input" />
                </dd>

                <dt>With an input mask (only lowercase letters): </dt>
                <dd>
                    <SimpleInput value={this.state.maskValue} onChange={this.onChangeMask} mask={/^[a-z]*$/} />
                </dd>


                <dt>With a maximum length (3 characters): </dt>
                <dd>
                    <SimpleInput value={this.state.maxLengthValue} onChange={this.onChangeMaxLength} maxLength={3} />
                </dd>
            </div>
        );
    }
}

ReactDOM.render(<SimpleInputExample />, mountNode);
