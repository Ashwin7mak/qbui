// This is a basic example for the React playground
// Please update to include other properties or states for your component

const basicStageExample = (
    <div>
        <dt>Default: </dt>
        <dd>
            <Stage stageHeadline={
                <StageHeader
                    title="Stage Title"
                    icon="settings"
                    iconClassName="yourClassName"
                    description={
                        <p>
                            This is the stage description. Meaningful explanatory text goes here.
                        </p>
                    }
                />
            }>

                <StageHeaderCount
                    className="governanceStageHeaderItems"
                    stageHeaderHasIcon={true}
                    items={[
                        {count: '25', title: 'Oranges'},
                        {count: '10', title: 'Apples'},
                        {count: '3', title: 'Bananas'}
                    ]}
                />
            </Stage>
        </dd>
    </div>
);

ReactDOM.render(basicStageExample, mountNode);
