let decimals = 7;
let durMs = 401071004;// value in milliseconds from db
//"111Hours 24Minutes 31.004Seconds"
let durVal = null;

let exampleData = {
    SmartUnitScale: {scale:'Smart Units', decimalPlaces:decimals, displayValue: "4.64202550925926 days", valueMs:durMs, blankVal: null},
    weekScale: {scale:'Weeks', decimalPlaces:decimals, displayValue: "0.6631465", valueMs:durMs, blankVal: null},
    dayScale: {scale:'Days', decimalPlaces:decimals, displayValue: "4.6420255", valueMs:durMs, blankVal: null},
    minuteScale: {scale:'Minutes', decimalPlaces:decimals, displayValue: "6,684.5167333", valueMs:durMs, blankVal: null},
    secondScale: {scale:'Seconds', decimalPlaces:decimals, displayValue: "401071.004", valueMs:durMs, blankVal: null},
    HHMMSSScale: {scale:':HH:MM:SS', decimalPlaces:decimals, displayValue: "6684:31:00.23988", valueMs:durMs, blankVal: null},
    HHMMScale: {scale:':HH:MM', decimalPlaces:decimals, displayValue: "111:24", valueMs:durMs, blankVal: null},
    MMSSScale: {scale:':MM:SS', decimalPlaces:decimals, displayValue: "111:24:31.004", valueMs:durMs, blankVal: null},
    MMScale: {scale:':MM', decimalPlaces:decimals, displayValue: "6684.5167333", valueMs:durMs, blankVal: null}
};

var DurationFieldValueEditorExample = React.createClass({
    getInitialState() {
        return Object.assign({}, exampleData);
    },
    onChange(newValue, key) {
        console.log('onChange for ' + key + ': ' + JSON.stringify(this.state[key]) + 'newValue :' + newValue);
        let returnObj = {};
        returnObj[key] = this.state[key];
        returnObj[key].displayValue = newValue;
        returnObj[key].valueMs = undefined;
        this.setState(returnObj);
    },
    onBlur(values, key) {
        console.log('values on blur for ' + key + ': ' + JSON.stringify(values));
        let returnObj = {};
        returnObj[key] = this.state[key];
        returnObj[key].displayValue = values.display;
        if (typeof (values.value) !== 'undefined') {
            returnObj[key].valueMs = values.value;
        }
        this.setState(returnObj);
    },
    onChangeEmpty(newValue, key) {
        let returnObj = {};
        returnObj[key] = this.state[key];
        returnObj[key].emptyDisplay = newValue;
        this.setState(returnObj);
    },
    onBlurEmpty(values, key) {
        console.log('values on blur empty for ' + key + ': ' + JSON.stringify(values));
        let returnObj = {};
        returnObj[key] = this.state[key];
        returnObj[key].emptyDisplay = values.display;
        if (typeof (values.value) !== 'undefined') {
            returnObj[key].blankVal = values.value;
        }
        this.setState(returnObj);
    },
    renderScaleEntry(scaleState, key) {
        let comps = [];
        comps.push(<DurationFieldValueEditor value={scaleState.valueMs}
                                             key={"dfve-" + key}
                                             display={scaleState.displayValue}
                                             onChange={(newVal) =>this.onChange(newVal, key)}
                                             onBlur={(values) =>this.onBlur(values, key)}
                                             attributes={exampleData[key]}/>);
        comps.push(<span className="milli">{' '}as milliseconds:{' '}{scaleState.valueMs}</span>);
        comps.push(<div>{' '}Empty{' '}{key}:</div>);
        comps.push(<DurationFieldValueEditor value={scaleState.blankVal}
                                             key={"dfve-blank-" + key}
                                             display={scaleState.emptyDisplay}
                                             onChange={(newVal) =>this.onChangeEmpty(newVal, key)}
                                             onBlur={(values) =>this.onBlurEmpty(values, key)}
                                             attributes={exampleData[key]}/>);
        comps.push(<span className="milli">{' '}as milliseconds: {' '}{scaleState.blankVal}</span>);
        return comps;
    },
    render() {
        return (
           <div>
                <div>All using initial value {durMs}(ms)</div>
                <div>with up to {decimals} decimals</div>
                <br/>

                <dt>Duration Smart Units:</dt>
                <dd>{this.renderScaleEntry(this.state.SmartUnitScale, 'SmartUnitScale')}
                    <div>with a custom placeholder:
                        <DurationFieldValueEditor value={this.state.SmartUnitScale.blankVal}
                                                  key={"dfve-placeholder-SmartUnitScale"}
                                                  display={this.state.SmartUnitScale.emptyDisplay}
                                                  onChange={(newVal) =>this.onChangeEmpty(newVal, 'SmartUnitScale')}
                                                  onBlur={(values) =>this.onBlurEmpty(values, 'SmartUnitScale')}
                                                  placeholder="Enter anything"
                                                  attributes={exampleData.SmartUnitScale}/>
                    </div>
                </dd>

                <dt>Weeks:</dt>
                <dd>{this.renderScaleEntry(this.state.weekScale, 'weekScale')}
                </dd>

                <dt>Days:</dt>
                <dd>{this.renderScaleEntry(this.state.dayScale, 'dayScale')}
                </dd>

                <dt>Minutes:</dt>
                <dd>{this.renderScaleEntry(this.state.minuteScale, 'minuteScale')}
                </dd>

                <dt>Seconds:</dt>
               <dd>{this.renderScaleEntry(this.state.secondScale, 'secondScale')}
                </dd>

                <hr/>
                <dt>HHMMSS:</dt>
                <dd>{this.renderScaleEntry(this.state.HHMMSSScale, 'HHMMSSScale')}
                </dd>

                <dt>HHMM:</dt>
               <dd>{this.renderScaleEntry(this.state.HHMMScale, 'HHMMScale')}
                </dd>

                <dt>MMSS:</dt>
               <dd>{this.renderScaleEntry(this.state.MMSSScale, 'MMSSScale')}
                </dd>

                <dt>MM:</dt>
               <dd>{this.renderScaleEntry(this.state.MMScale, 'MMScale')}
                </dd>

            </div>
        );
    }
});

ReactDOM.render(<DurationFieldValueEditorExample />, mountNode);
