let decimals = 7;
let durVal =  401071004; // value in milliseconds from db

let exampleData = {
    SmartUnitScale: {scale:'Smart Units', decimalPlaces:decimals, inputValue: durVal, blankVal: null},
    weekScale: {scale:'Weeks', decimalPlaces:decimals, inputValue: durVal, blankVal: null},
    dayScale: {scale:'Days', decimalPlaces:decimals, inputValue: durVal, blankVal: null},
    minuteScale: {scale:'Minutes', decimalPlaces:decimals, inputValue: durVal, blankVal: null},
    secondScale: {scale:'Seconds', decimalPlaces:decimals, inputValue: durVal, blankVal: null},
    HHMMSSScale: {scale:':HH:MM:SS', decimalPlaces:decimals, inputValue: durVal, blankVal: null},
    HHMMScale: {scale:':HH:MM', decimalPlaces:decimals, inputValue: durVal, blankVal: null},
    MMSSScale: {scale:':MM:SS', decimalPlaces:decimals, inputValue: durVal, blankVal: null},
    MMScale: {scale:':MM', decimalPlaces:decimals, inputValue: durVal, blankVal: null}
};

var DurationFieldValueEditorExample = React.createClass({
    getInitialState() {
        return Object.assign({}, exampleData);
    },
    onChange(newValue, key) {
        console.log('onChange for ' + key + ': ' + JSON.stringify(this.state[key]) + 'newValue :' + newValue);
        let returnObj = {};
        returnObj[key] = this.state[key];
        returnObj[key].inputValue = newValue;
        this.setState(returnObj);
    },
    onBlur(values, key) {
        console.log('values on blur for ' + key + ': ' + JSON.stringify(values));
        let returnObj = {};
        returnObj[key] = this.state[key];
        returnObj[key].display = values.display;
        this.setState(returnObj);
    },
    onChangeEmpty(newValue, key) {
        let returnObj = {};
        returnObj[key] = this.state[key];
        returnObj[key].blankVal = newValue;
        this.setState(returnObj);
    },
    onBlurEmpty(values, key) {
        console.log('values on blur empty for ' + key + ': ' + JSON.stringify(values));
        let returnObj = {};
        returnObj[key] = this.state[key];
        returnObj[key].emptyDisplay = values.display;
        this.setState(returnObj);
    },
    renderScaleEntry(scaleState, key) {
        let comps = [];
        comps.push(<DurationFieldValueEditor value={scaleState.inputValue}
                                  display={scaleState.display}
                                  onChange={(newVal) =>this.onChange(newVal, key)}
                                  onBlur={(values) =>this.onBlur(values, key)}
                                  attributes={exampleData[key]}/>);
        comps.push(<span>{' '}Empty:</span>);
        comps.push(<DurationFieldValueEditor value={scaleState.blankVal}
                                      display={scaleState.emptyDisplay}
                                      onChange={(newVal) =>this.onChangeEmpty(newVal, key)}
                                      onBlur={(values) =>this.onBlurEmpty(values, key)}
                                      attributes={exampleData[key]}/>);
        comps.push(<br/>);
        comps.push(<div>with a custom placeholder:
            <DurationFieldValueEditor value={scaleState.blankVal}
                                      display={scaleState.emptyDisplay}
                                      onChange={(newVal) =>this.onChangeEmpty(newVal, key)}
                                      onBlur={(values) =>this.onBlurEmpty(values, key)}
                                      placeholder="Enter anything for key"
                                      attributes={exampleData[key]}/>
            </div>);
        return comps;
    },
    render() {
        return (
           <div>
                <div>All using initial value {durVal}(ms)</div>
                <div>with up to {decimals} decimals</div>
                <br/>

                <dt>Duration Smart Units:</dt>
                <dd>{this.renderScaleEntry(this.state.SmartUnitScale, 'SmartUnitScale')}
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
