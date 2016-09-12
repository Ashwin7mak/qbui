
let editValue1 = 'QuickBase';
let editValue2 = 'Lorem ipsum dolor sit amet';
let editValue2Invalid = true;

var BasicTextFieldValueEditor = React.createClass({
    getInitialState() {
        return {
            inputValue: editValue1
        };
    },
    onChange(value) {
        this.setState({inputValue: value});
    },
    render() {
        return (
            <div>
                <dt>Empty Text Field Editor:</dt>
                    <dd>
                      <TextFieldValueEditor />
                    </dd>


                <dt>Empty Text Field Editor with placeholder text:</dt>
                    <dd>
                        <TextFieldValueEditor placeholder="test@example.com" />
                    </dd>


                <dt>Text Field Editor with a value:</dt>
                    <dd>
                        <TextFieldValueEditor value={this.state.inputValue} onChange={this.onChange}/>
                    </dd>


                <dt>Text Field Editor with a value and an error:</dt>
                    <dd>
                        <TextFieldValueEditor isInvalid={editValue2Invalid} invalidMessage="Use up to 15 characters" value={editValue2} />
                    </dd>


            </div>
        );
    }
});

ReactDOM.render(<BasicTextFieldValueEditor />, mountNode);

