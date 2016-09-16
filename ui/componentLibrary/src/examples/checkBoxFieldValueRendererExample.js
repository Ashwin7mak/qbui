let shortLabelText = "Test Label";
let longLabelText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dignissim " +
               "congue urna, non interdum felis. Pellentesque aliquet sapien purus, non " +
               "consequat risus vulputate id. Sed vel libero non elit faucibus vehicula. " +
               "In in porttitor ante, ut vestibulum purus. Praesent metus erat, elementum " +
               "sed placerat eu, semper sed nisi. Praesent ultrices id sem quis accumsan. " +
               "Proin eu hendrerit ante.";

var BasicCheckBoxFieldValueRenderer = React.createClass({
    getInitialState() {
        return {
            value: false
        };
    },
    onChange(value) {
        this.setState({value: value});
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


                <dt>Checkbox With a Label:</dt>
                    <dd>
                        <CheckBoxFieldValueEditor value={this.state.inputValue} label={shortLabelText} onChange={this.onChange} />
                    </dd>


                <dt>CheckBox With a Long Label:</dt>
                    <dd>
                        <CheckBoxFieldValueEditor value={this.state.inputValue} label={longLabelText} onChange={this.onChange} />
                    </dd>

            </div>
        );
    }
});

ReactDOM.render(<BasicCheckBoxFieldValueRenderer />, mountNode);
