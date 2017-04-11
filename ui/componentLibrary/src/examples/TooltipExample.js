// This is a basic example for the React playground
// Please update to include other properties or states for your component

const basicTooltipExample = (
    <div>
        <dt>Default: </dt>
        <dd>
            <span>Hover over the star icon to see a tooltip.</span>
            <div style={{width: 20, height: 20}}>
                <Tooltip plainMessage="I'm a tooltip!" location="bottom">
                    <Icon icon="star-full"/>
                </Tooltip>
            </div>
        </dd>
    </div>
);

ReactDOM.render(basicTooltipExample, mountNode);
