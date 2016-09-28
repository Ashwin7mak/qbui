//  datetime field attributes to apply when formatting the display output
const attributes = {
    dateFormat: 'MM-dd-uuuu',
    showMonthAsName: true,
    showTime: true,
    timeZone: 'US/Pacific',
    type: 'DATE_TIME'
};

//  classes can be optionally passed in for custom styling
const classes = 'myCustomClass';
let dateValue = '2016-08-12T13:30:00Z';

let DateTimeEditor = React.createClass({

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
                <dt>Date Time Field Editor:</dt>
                <dd>
                    <DateTimeFieldValueEditor value={this.state.inputValue} classes={classes} attributes={attributes} onChange={this.onChange} onBlur={this.onBlur}/>
                </dd>
            </div>
        );
    }
});

ReactDOM.render(<DateTimeEditor/>, mountNode);
