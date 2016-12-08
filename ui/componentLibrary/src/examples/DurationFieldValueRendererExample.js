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
    milliseconds : function secondsAsMilliseconds(numMilliseconds) {
        return numMilliseconds; //  milliseconds
    },
};

let testDur = {weeks:.5, days:1, hours:3, minutes:24, seconds:31, milliseconds:4};
let durVal =  getAsMilliseconds(testDur);

let weekScale = {scale:'Weeks'};
let dayScale = {scale:'Days'};
let minuteScale = {scale:'Minutes'};
let secondScale = {scale:'Seconds'};
let HHMMSSScale = {scale:':HH:MM:SS'};
let HHMMScale = {scale:':HH:MM'};
let MMSSScale = {scale:':MM:SS'};
let MMScale = {scale:':MM'};

const basicDurationFieldValueRendererExample = (
    <div>
        <div>Given {JSON.stringify(testDur)}</div>
        <div>All using value {durVal}(ms)</div>
        <br/>

        <dt>Duration Default (smart units): </dt>
        <dd>
            <DurationFieldValueRenderer value={durVal} />
        </dd>

        <dt>Duration Field with some added bootstrap classes:</dt>
        <dd>
            <DurationFieldValueRenderer value={durVal} classes="mark lead"/>
        </dd>

        <dt>Default (a display prop overrides any specified value): </dt>
        <dd>
            <DurationFieldValueRenderer value={durVal} display={"123 days for billing"}/>
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
