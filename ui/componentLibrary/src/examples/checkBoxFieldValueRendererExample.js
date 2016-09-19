let shortLabelText = "Test Label";
let longLabelText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dignissim " +
               "congue urna, non interdum felis. Pellentesque aliquet sapien purus, non " +
               "consequat risus vulputate id. Sed vel libero non elit faucibus vehicula. " +
               "In in porttitor ante, ut vestibulum purus. Praesent metus erat, elementum " +
               "sed placerat eu, semper sed nisi. Praesent ultrices id sem quis accumsan. " +
               "Proin eu hendrerit ante.";
let questionLabel = "Are you sure?"

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
                <dt>Standard Checkbox (Checked):</dt>
                    <dd>
                      <CheckBoxFieldValueRenderer value={true}/>
                    </dd>

                <dt>Standard Checkbox (Unchecked):</dt>
                    <dd>
                      <CheckBoxFieldValueRenderer value={this.state.inputValue} />
                    </dd>


                <dt>Yes/No Checkbox (displayGraphic: false):</dt>
                    <dd>
                        <CheckBoxFieldValueRenderer value={true} displayGraphic={false} />

                        <CheckBoxFieldValueRenderer value={this.state.inputValue} displayGraphic={false} />
                    </dd>


                <dt>Checkbox With a Label:</dt>
                    <dd>
                        <CheckBoxFieldValueRenderer value={true} label={shortLabelText} />

                        <CheckBoxFieldValueRenderer value={false} label={shortLabelText} />
                    </dd>

            </div>
        );
    }
});

ReactDOM.render(<BasicCheckBoxFieldValueRenderer />, mountNode);
