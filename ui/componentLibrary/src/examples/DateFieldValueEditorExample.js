const attributes = {
    dateFormat: 'MM-dd-uuuu',
    showMonthAsName: true,
    type: 'DATE'
};

//  classes can be optionally passed in for custom styling
const classes = 'myCustomClass';
let dateValue = '2016-05-11';

let DateEditor = React.createClass({
    getInitialState() {
        return {
            inputValue: dateValue
        };
    },
    onChange(value) {
        // onchange event processing..if any
        this.setState({inputValue: value});
    },
    onBlur(values) {
        // onBlur event processing..if any
        this.setState({inputValue: values.value});
    },
    render() {
        return (
            <div>
                <dt>Date Field Editor:</dt>
                <dd>
                    <DateFieldValueEditor value={this.state.inputValue} classes={classes} attributes={attributes} onChange={this.onChange} onBlur={this.onBlur}/>
                </dd>
            </div>
        );
    }
});

ReactDOM.render(<DateEditor/>, mountNode);
