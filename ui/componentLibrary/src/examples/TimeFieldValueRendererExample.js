//  time field attributes to apply when formatting the display output
const attributes = {
    scale: 'HH:MM',
    use24HourClock: false,
    type: 'TIME_OF_DAY'
};

//  classes can be optionally passed in for custom styling
const classes = 'myCustomClass';

const TimeRenderer = (
    <div>
        <dt>Render a time:</dt>
        <dd>
            <TimeFieldValueRenderer value="13:30" attributes={attributes} classes={classes} />
        </dd>
    </div>
);

ReactDOM.render(TimeRenderer, mountNode);
