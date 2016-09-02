
let editValue1 = '45.67';

var BasicNumericFieldValueEditor = React.createClass({
    getInitialState() {
        return {
            inputValue: this.props.value
        };
    },
    onBlur(ev) {
        if (this.props.onBlur) {
            this.setState({inputValue: ev.target.value});
        }
    },
    render() {
        return (
            <div>
                <dt>Empty Numeric Field Editor:</dt>
                <dd>
                    <NumericFieldValueEditor onBlur={this.onBlur}/>
                </dd>


                <dt>Empty Numeric Field Editor with placeholder text:</dt>
                <dd>
                    <NumericFieldValueEditor placeholder="placeholder text" onBlur={this.onBlur}/>
                </dd>


                <dt>Numeric Field Editor with a value:</dt>
                <dd>
                    <NumericFieldValueEditor value={this.state.value} onBlur={this.onBlur}/>
                </dd>

            </div>
        );
    }
});

const basicNumericFieldValueEditor = (
    <div>
        <dt>Empty Numeric Field Editor:</dt>
            <dd>
              <NumericFieldValueEditor />
            </dd>


        <dt>Empty Numeric Field Editor with placeholder text:</dt>
            <dd>
                <NumericFieldValueEditor placeholder="$" />
            </dd>


        <dt>Numeric Field Editor with a value:</dt>
            <dd>
                <NumericFieldValueEditor value={editValue1} />
            </dd>

    </div>
);
ReactDOM.render(<BasicNumericFieldValueEditor />, mountNode);
