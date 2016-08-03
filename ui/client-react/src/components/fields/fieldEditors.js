import React from 'react';
import {Input, InputGroup, FormControl, MenuItem, FormGroup, DropdownButton} from 'react-bootstrap';
import DateTimeField from 'react-bootstrap-datetimepicker';
import moment from 'moment';

/**
 * simple non-validating cell editor for text
 */
export const DefaultFieldEditor = React.createClass({

    propTypes: {
        value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number, React.PropTypes.object, React.PropTypes.bool]),
        type: React.PropTypes.string,
        onChange: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            value: "",
            type: "text"
        };
    },

    onChange(ev) {
        this.props.onChange(ev.target.value);
    },

    render() {
        return <input ref="cellInput"
                      onChange={this.onChange}
                      tabIndex="0"
                      className="cellEdit"
                      type={this.props.type}
                      value={this.props.value}/>;
    }
});

/**
 * a multi-line text editor that dynamically changes its height
 */
export const MultiLineTextFieldEditor = React.createClass({

    propTypes: {
        value: React.PropTypes.string,
        type: React.PropTypes.string,
        onChange: React.PropTypes.func
    },

    statics: {
        MAX_TEXTAREA_HEIGHT: 100
    },
    getDefaultProps() {
        return {
            value: "",
            type: "text"
        };
    },

    getInitialState() {
        return {
            style: {
                height: "auto"
            }
        };
    },

    /**
     * delegate text changes via callback
     * @param ev
     */
    onChange(ev) {
        this.props.onChange(ev.target.value);
    },

    componentDidMount() {
        this.resize();
    },

    /**
     * reset height to the natural value, unless it exceeds MAX_TEXTAREA_HEIGHT,
     * in which case start using vertical scrolling
     */
    resize() {
        this.setState({style: {height: "auto"}}, () => {
            // now we can query the actual (auto) height
            let newHeight = this.refs.textarea.scrollHeight;

            if (newHeight < MultiLineTextFieldEditor.MAX_TEXTAREA_HEIGHT) {
                this.setState({style: {height: newHeight}});
            } else {
                this.setState({style: {height: MultiLineTextFieldEditor.MAX_TEXTAREA_HEIGHT, overflowY: "auto"}});
            }
        });
    },

    /**
     * force resizing during typing
     * @param ev
     */
    onKeyUp(ev) {
        this.resize();
    },

    render() {

        return <textarea ref="textarea" style={this.state.style} onChange={this.onChange}
                         tabIndex="0"
                         onKeyUp={this.onKeyUp}
                         className="cellEdit"
                         rows="1"
                         value={this.props.value}/>;
    }
});

/**
 * placeholder for user picker
 */
export const UserFieldEditor = React.createClass({

    render() {
        return <input ref="cellInput"
                      tabIndex="0"
                      className="cellEdit"/>;
    }
});
/**
 * combo box cell editor
 */
export const ComboBoxFieldEditor = React.createClass({

    propTypes: {
        choices: React.PropTypes.array, // array of choices with display value props
        onChange: React.PropTypes.func
    },

    // handle text input
    onChange(ev) {
        const newValue = ev.target.value;

        this.props.onChange(newValue);
    },
    // handle dropdown selection
    onSelect(choice) {
        this.props.onChange(choice);
    },

    render() {
        return (
            <InputGroup className="cellEdit">
                <FormControl type="text"
                             value={this.props.value}
                             onChange={this.onChange}
                             />
                <DropdownButton pullRight={true}
                                componentClass={InputGroup.Button}
                                id="input-dropdown-addon"
                                title="">

                    {this.props.choices.map((choice, i) => (<MenuItem key={i}
                                                                      onSelect={() => {this.onSelect(choice.displayValue);}}>
                                                                {choice.displayValue}
                                                            </MenuItem>))
                    }

                </DropdownButton>
            </InputGroup>
        );
    }
});

/**
 * date-only cell editor
 */
export const DateFieldEditor = React.createClass({

    propTypes: {
        value: React.PropTypes.string, // YYYY-MM-DD
        onChange: React.PropTypes.func
    },

    onChange(newValue) {
        this.props.onChange(newValue);
    },

    render() {
        const format = "YYYY-MM-DD";
        const fixedDate = this.props.value ? this.props.value.replace(/(\[.*?\])/, '') : moment().format(format);
        return <div className="cellEdit dateTimeField">
            <DateTimeField dateTime={fixedDate}
                           format={format}
                           inputFormat="MM-DD-YYYY"
                           onChange={this.onChange}
                           mode="date"/>
        </div>;
    }
});

/**
 * convert an ISO datetime string to the same string with fixed number of milliseconds digits
 *
 * 2063-05-25T02:59:32.76Z returns 2063-05-25T02:59:32.760Z for example
 */
function dateTimeStringWithFixedMillisSuffix(dateTimeStr, places) {

    const millisSuffix = dateTimeStr.match(/\.[0-9]*/);
    if (millisSuffix) {
        let fixedMillis = parseFloat(millisSuffix).toFixed(places).substring(1);
        return dateTimeStr.replace(/\.[0-9]*/, fixedMillis);
    }
    return dateTimeStr;
}
/**
 * date + time cell editor
 */
export const DateTimeFieldEditor = React.createClass({

    propTypes: {
        value: React.PropTypes.string, // YYYY-MM-DDThh:mm:ss
        onChange: React.PropTypes.func
    },

    onChange(newValue) {
        this.props.onChange(newValue);
    },

    render() {

        const format = "YYYY-MM-DDTHH:mm:ss.SSSZ";
        let dateTime = this.props.value ? this.props.value.replace(/(\[.*?\])/, '') : moment().format(format);
        dateTime = dateTimeStringWithFixedMillisSuffix(dateTime, 3);

        return <div className="cellEdit dateTimeField">
            <DateTimeField dateTime={dateTime}
                           format={format}
                           inputFormat="MM-DD-YYYY hh:mm:ss A"
                           onChange={this.onChange}
                           mode="datetime"/>
        </div>;
    }
});

/**
 * time of day cell editor
 */
export const TimeFieldEditor = React.createClass({

    propTypes: {
        value: React.PropTypes.string, // YYYY-MM-DDThh:mm:ss.SSS (Epoch date)
        onChange: React.PropTypes.func
    },
    onChange(newValue) {
        this.props.onChange(newValue);
    },
    render() {
        const format = "YYYY-MM-DDTHH:mm:ss.SSS";
        let localTime = this.props.value ? this.props.value.replace(/Z(\[.*?\])/, '') : moment().format(format);
        localTime = dateTimeStringWithFixedMillisSuffix(localTime, 3);

        return <div className="cellEdit dateTimeField">
            <DateTimeField dateTime={localTime}
                           format={format}
                           inputFormat="h:mm:ss A"
                           onChange={this.onChange}
                           mode="time"/>
        </div>;
    }
});

/**
 * checkbox cell editor
 */
export const CheckBoxFieldEditor = React.createClass({

    propTypes: {
        value: React.PropTypes.bool,
        onChange: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            value: false
        };
    },

    onChange(ev) {
        const newValue = ev.target.checked;
        this.props.onChange(newValue);
    },

    render() {

        return <input ref="cellInput"
                      onChange={this.onChange}
                      tabIndex="0"
                      className="cellEdit"
                      defaultChecked={this.props.value} // react requirement
                      type="checkbox"
        />;
    }
});
