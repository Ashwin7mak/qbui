// This is a basic example for the React playground
// Please update to include other properties or states for your component

const basicQbLoaderExample = (
    <div>
        <dt>Default: </dt>
        <dd>
            <QbLoader isLoading={true} width={"100px"} height={"100px"}/>
        </dd>
    </div>
);

ReactDOM.render(basicQbLoaderExample, mountNode);
