
let editValue1 = '45.67';

let EmptyNumericEditor = React.createClass({
    getInitialState() {
        return {
            inputValue: editValue1
        };
    },
    onChange(value) {
        this.setState({inputValue: value});
    },
    onBlur(values) {
        this.setState({inputValue: values.display});
    },
    render() {
        return (
            <div>
                <dt>Empty Numeric Field Editor:</dt>
                <dd>
                    <NumericFieldValueEditor onChange={this.onChange} onBlur={this.onBlur}/>
                </dd>
            </div>
        );
    }
});

let PlaceholderNumericEditor = React.createClass({
    getInitialState() {
        return {
            inputValue: editValue1
        };
    },
    onChange(value) {
        this.setState({inputValue: value});
    },
    onBlur(values) {
        this.setState({inputValue: values.display});
    },
    render() {
        return (
            <div>
                <dt>Empty Numeric Field Editor with placeholder text:</dt>
                <dd>
                    <NumericFieldValueEditor placeholder="placeholder text" onChange={this.onChange} onBlur={this.onBlur}/>
                </dd>
            </div>
        );
    }
});

let ValuedNumericEditor = React.createClass({
    getInitialState() {
        return {
            inputValue: editValue1
        };
    },
    onChange(value) {
        this.setState({inputValue: value});
    },
    onBlur(values) {
        this.setState({inputValue: values.display});
    },
    render() {
        return (
            <div>
                <dt>Numeric Field Editor with a value (type in and tab out to see formatted values):</dt>
                <dd>
                    <NumericFieldValueEditor value={this.state.inputValue} onChange={this.onChange} onBlur={this.onBlur}/>
                </dd>
            </div>
        );
    }
});

var BasicNumericFieldValueEditor = React.createClass({
    getInitialState() {
        return {
            inputValue: editValue1
        };
    },
    onChange(value) {
        this.setState({inputValue: value});
    },
    onBlur(values) {
        this.setState({inputValue: values.display});
    },
    render() {
        return (
            <div>
                <EmptyNumericEditor />
                <PlaceholderNumericEditor />
                <ValuedNumericEditor />
            </div>
        );
    }
});

ReactDOM.render(<BasicNumericFieldValueEditor />, mountNode);
