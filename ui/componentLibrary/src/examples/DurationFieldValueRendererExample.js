let consts = {
    millisecondsPerSecond : 1000,
    secondsPerMinute : 60,
    minutesPerHour : 60,
    hoursPerDay : 24,
    daysPerWeek : 7,
};

let toMilli =  {
    weeks: function weeksAsMilliseconds(numWeeks) {
        return  numWeeks *
            consts.daysPerWeek *
            consts.hoursPerDay *
            consts.minutesPerHour *
            consts.secondsPerMinute *
            consts.millisecondsPerSecond; //  weeks
    },
    days : function daysAsMilliseconds(numDays) {
        return  numDays *
            consts.hoursPerDay *
            consts.minutesPerHour *
            consts.secondsPerMinute *
            consts.millisecondsPerSecond; //  days
    },
    hours: function hoursAsMilliseconds(numHours) {
        return  numHours *
            consts.minutesPerHour *
            consts.secondsPerMinute *
            consts.millisecondsPerSecond; //  hours
    },
    minutes : function minutesAsMilliseconds(numMinutes) {
        return  numMinutes *
            consts.secondsPerMinute *
            consts.millisecondsPerSecond; //  minutes
    },
    seconds : function secondsAsMilliseconds(numSeconds) {
        return  numSeconds *
            consts.millisecondsPerSecond; //  seconds
    },
    milliseconds : function millisecondsAsMilliseconds(numMilliseconds) {
        return numMilliseconds; //  milliseconds
    },
};

let testDur = {weeks:.5, days:1, hours:3, minutes:24, seconds:31, milliseconds:4};
let decimals = 7;
let durVal =  getAsMilliseconds(testDur);
let SmartUnitScale = {scale:'Smart Units', decimalPlaces:decimals};
let weekScale = {scale:'Weeks', decimalPlaces:decimals};
let dayScale = {scale:'Days', decimalPlaces:decimals};
let minuteScale = {scale:'Minutes', decimalPlaces:decimals};
let secondScale = {scale:'Seconds', decimalPlaces:decimals};
let HHMMSSScale = {scale:':HH:MM:SS', decimalPlaces:decimals};
let HHMMScale = {scale:':HH:MM', decimalPlaces:decimals};
let MMSSScale = {scale:':MM:SS', decimalPlaces:decimals};
let MMScale = {scale:':MM', decimalPlaces:decimals};

const basicDurationFieldValueRendererExample = (
    <div>
        <div>Given {JSON.stringify(testDur)}</div>
        <div>All using value {durVal}(ms)</div>
        <div>with up to {decimals} decimals</div>
        <br/>

        <dt>Duration Default (scale default is smart units,  decimals default is 14): </dt>
        <dd>
            <DurationFieldValueRenderer value={durVal} />
        </dd>

        <dt>Duration Smart Units: </dt>
        <dd>
            <DurationFieldValueRenderer value={durVal} attributes={SmartUnitScale}/>
        </dd>

        <dt>Duration Smart Units with some added bootstrap classes:</dt>
        <dd>
            <DurationFieldValueRenderer value={durVal}  attributes={SmartUnitScale} classes="mark lead"/>
        </dd>


        <dt>A display prop provided is used instead of formatting the value: </dt>
        <dd>
            <DurationFieldValueRenderer value={durVal} display={"123 days till Christmas"} attributes={weekScale}/>
        </dd>

        <dt>Weeks: </dt>
        <dd>
            <DurationFieldValueRenderer value={durVal} attributes={weekScale}/>
        </dd>

        <dt>Weeks with units: </dt>
        <dd>
            <DurationFieldValueRenderer value={durVal} attributes={weekScale} includeUnits={true}/>
        </dd>

        <dt>Days: </dt>
        <dd>
            <DurationFieldValueRenderer value={durVal} attributes={dayScale}/>
        </dd>

        <dt>Days with units: </dt>
        <dd>
            <DurationFieldValueRenderer value={durVal} attributes={dayScale} includeUnits={true}/>
        </dd>

        <dt>Minutes: </dt>
        <dd>
            <DurationFieldValueRenderer value={durVal} attributes={minuteScale}/>
        </dd>

        <dt>Minutes with units: </dt>
        <dd>
            <DurationFieldValueRenderer value={durVal} attributes={minuteScale} includeUnits={true}/>
        </dd>

        <dt>Seconds: </dt>
        <dd>
            <DurationFieldValueRenderer value={durVal} attributes={secondScale}/>
        </dd>

        <dt>Seconds with units: </dt>
        <dd>
            <DurationFieldValueRenderer value={durVal} attributes={secondScale} includeUnits={true}/>
        </dd>
        <hr/>
        <dt>HHMMSS </dt>
        <dd>
            <DurationFieldValueRenderer value={durVal} attributes={HHMMSSScale}/>
        </dd>

        <dt>HHMM </dt>
        <dd>
            <DurationFieldValueRenderer value={durVal} attributes={HHMMScale}/>
        </dd>

        <dt>MMSS </dt>
        <dd>
            <DurationFieldValueRenderer value={durVal} attributes={MMSSScale}/>
        </dd>

        <dt>MM </dt>
        <dd>
            <DurationFieldValueRenderer value={durVal} attributes={MMScale}/>
        </dd>

        <dt>Note IncludeUnits has no effect on time formatted durations</dt>
        <dd>
            <DurationFieldValueRenderer value={durVal} attributes={HHMMSSScale} includeUnits={true}/>
        </dd>

    </div>
);

ReactDOM.render(basicDurationFieldValueRendererExample, mountNode);

function getAsMilliseconds(data) {
    var answer = 0;
    if (data) {
        Object.keys(data).forEach(function(key) {
            if (toMilli.hasOwnProperty(key)) {
                answer += toMilli[key](data[key]);
            }
        });
    }
    return answer;
}
