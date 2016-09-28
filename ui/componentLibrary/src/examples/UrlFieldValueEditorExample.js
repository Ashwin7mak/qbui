// This is a basic example for the React playground
// Please update to include other properties or states for your component

const basicUrlFieldValueEditorExample = (
    <div>
        <dt>Default: </dt>
        <dd>
            <UrlFieldValueEditor />
        </dd>

        <dt>Invalid: </dt>
        <dd>
            <UrlFieldValueEditor isInvalid={true} />
        </dd>
    </div>
);

ReactDOM.render(basicUrlFieldValueEditorExample, mountNode);
