let shortLabelText = "Test Label";
let longLabelText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dignissim " +
               "congue urna, non interdum felis. Pellentesque aliquet sapien purus, non " +
               "consequat risus vulputate id. Sed vel libero non elit faucibus vehicula. " +
               "In in porttitor ante, ut vestibulum purus. Praesent metus erat, elementum " +
               "sed placerat eu, semper sed nisi. Praesent ultrices id sem quis accumsan. " +
               "Proin eu hendrerit ante.";

var BasicCheckBoxFieldValueEditor = React.createClass({
    getInitialState() {
        return {
            inputValue: false
        };
    },
    onChange(value) {
        this.setState({inputValue: value});
    },
    render() {
        return (
            <div>
            <dt>Unchecked (Default) Checkbox:</dt>
                <dd>
                  <CheckBoxFieldValueEditor value={this.state.inputValue} onChange={this.onChange} />
                </dd>


            <dt>Checked Checkbox:</dt>
                <dd>
                    <CheckBoxFieldValueEditor value={true} />
                </dd>


            <dt>Checkbox with a Label:</dt>
                <dd>
                    <CheckBoxFieldValueEditor value={this.state.inputValue} label={shortLabelText} onChange={this.onChange} />
                </dd>


            <dt>CheckBox with a Long Label:</dt>
                <dd>
                    <CheckBoxFieldValueEditor value={this.state.inputValue} label={longLabelText} onChange={this.onChange} />
                </dd>

            <dt>Invalid Checkbox:</dt>
                <dd>
                    <CheckBoxFieldValueEditor value={this.state.inputValue}
                                              label={shortLabelText}
                                              onChange={this.onChange}
                                              invalid={true} />
                </dd>

            <dt>Disabled Checkbox:</dt>
                <dd>
                    <CheckBoxFieldValueEditor value={this.state.inputValue}
                                              label="I cannot be changed"
                                              onChange={this.onChange}
                                              disabled={true} />
                </dd>

            <dt>Required Checkbox:</dt>
                <dd>
                    <CheckBoxFieldValueEditor value={this.state.inputValue}
                                              label="Required"
                                              onChange={this.onChange}
                                              required={true} />

                    <CheckBoxFieldValueEditor value={this.state.inputValue}
                                              label="Required and invalid"
                                              onChange={this.onChange}
                                              required={true}
                                              invalid={true} />
                </dd>

            <dt>Ready Only Checkbox Returns a Renderer:</dt>
                <dd>
                    <CheckBoxFieldValueEditor value={true}
                                              label={shortLabelText}
                                              onChange={this.onChange}
                                              readOnly={true} />
                </dd>

            </div>
        );
    }
});

ReactDOM.render(<BasicCheckBoxFieldValueEditor />, mountNode);
