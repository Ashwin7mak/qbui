
let editValue1 = '(555) 555-5555';
let editValue2 = '(555) 555-5555 x5555';

var BasicPhoneFieldValueEditor = React.createClass({
    getInitialState() {
        return {
            inputValue1: editValue1,
            inputValue2: editValue2
        };
    },
    onChangeInputValue1(value) {
        this.setState({inputValue1: value});
    },
    onBlur1(values) {
        this.setState({inputValue1: values.display});
    },
    onBlur2(values) {
        this.setState({inputValue2: values.display});
    },
    onChangeInput2(value) {
        this.setState({inputValue2: value});
    },
    render() {
        return (
            <div>
                <dt>Empty Phone Field Editor with placeholder text:</dt>
                <dd>
                    <PhoneFieldValueEditor placeholder="(xxx) xxx-xxxx"
                                           fieldDef={{dataTypeAttributes:"PHONE_NUMBER"}}/>
                </dd>


                <dt>Phone Field Editor with a value:</dt>
                <dd>
                    <PhoneFieldValueEditor display={this.state.inputValue1}
                                           value={this.state.inputValue1}
                                           onBlur={this.onBlur1}
                                           onChange={this.onChangeInputValue1}
                                           fieldDef={{dataTypeAttributes:"PHONE_NUMBER"}}
                                           attributes={{includeExtension: false}}/>
                </dd>
                <dt>Phone Field Editor with extension and a value:</dt>
                <dd>
                    <div style={{width:'200px'}}>
                    <PhoneFieldValueEditor display={this.state.inputValue2}
                                           value={this.state.inputValue2}
                                           onBlur={this.onBlur2}
                                           onChange={this.onChangeInput2}
                                           fieldDef={{dataTypeAttributes:"PHONE_NUMBER"}}
                                           attributes={{includeExtension: true}}/>
                    </div>
                </dd>
            </div>
        );
    }
});

ReactDOM.render(<BasicPhoneFieldValueEditor />, mountNode);
