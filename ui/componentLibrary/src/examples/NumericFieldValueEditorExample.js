
let editValue1 = '45.67';

var BasicNumericFieldValueEditor = React.createClass({
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
                <dt>Empty Numeric Field Editor:</dt>
                <dd>
                    <NumericFieldValueEditor/>
                </dd>


                <dt>Empty Numeric Field Editor with placeholder text:</dt>
                <dd>
                    <NumericFieldValueEditor placeholder="placeholder text"/>
                </dd>


                <dt>Numeric Field Editor with a value:</dt>
                <dd>
                    <NumericFieldValueEditor value={this.state.inputValue} onChange={this.onChange}/>
                </dd>

            </div>
        );
    }
});

ReactDOM.render(<BasicNumericFieldValueEditor />, mountNode);
