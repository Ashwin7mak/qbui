class ColorPickerExample extends React.Component {
    constructor(props) {
        super(props);

        this.state = {value: '#000000'};
    }

    onChange = color => {
        this.setState({value: color});
    };

    render() {
        return (
            <div>
                <dt>Default: </dt>
                <dd>
                    <ColorPicker value={this.state.value} onChange={this.onChange} />
                </dd>

                <dt>With the preview: </dt>
                <dd>
                    <ColorPicker isPreviewVisible={true} icon="star-full" value={this.state.value} onChange={this.onChange} />
                </dd>

                <dt>With custom color picker: </dt>
                <dd>
                    <ColorPicker hasCustomColor={true} icon="star-full" value={this.state.value} onChange={this.onChange} />
                </dd>
            </div>
        );
    }
}

ReactDOM.render(<ColorPickerExample />, mountNode);
