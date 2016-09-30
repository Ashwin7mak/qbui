//  time field attributes to apply when formatting the display output
const attributes = {
    scale: 'HH:MM',
    use24HourClock: false,
    type: 'TIME_OF_DAY'
};

//  classes can be optionally passed in for custom styling
const classes = 'myCustomClass';
const fieldType = 5;  // TIME
let timeValue = '19:33';

let TimeEditor = React.createClass({

    getInitialState() {
        return {
            inputValue: timeValue
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
                <dt>Time Field Editor:</dt>
                <dd>
                    <TimeFieldValueEditor value={this.state.inputValue} type={fieldType} classes={classes} attributes={attributes} onChange={this.onChange} onBlur={this.onBlur}/>
                </dd>
            </div>
        );
    }
});

ReactDOM.render(<TimeEditor/>, mountNode);
