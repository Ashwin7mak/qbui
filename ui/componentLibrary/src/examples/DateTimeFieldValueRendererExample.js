//  datetime field attributes to apply when formatting the display output
const attributes_dateTime = {
    dateFormat: 'MM-dd-uuuu',
    showMonthAsName: true,
    showTime: true,
    timeZone: 'US/Pacific',
    type: 'DATE_TIME'
};

const attributes_date = {
    dateFormat: 'MM-dd-uuuu',
    showMonthAsName: true,
    type: 'DATE'
};

//  classes can be optionally passed in for custom styling
const classes = 'myCustomClass';

const DateTimeRenderer = (
    <div>
        <dt>Render a date and time:</dt>
        <dd>
            <DateTimeFieldValueRenderer value="2016-08-12T13:30:00Z" attributes={attributes_dateTime} classes={classes} />
        </dd>
        <dt>Render a date only:</dt>
        <dd>
            <DateTimeFieldValueRenderer value="2016-05-11" attributes={attributes_date} classes={classes} />
        </dd>
    </div>
);

ReactDOM.render(DateTimeRenderer, mountNode);
