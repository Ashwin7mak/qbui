// This is a basic example for the React playground
// Please update to include other properties or states for your component

let exampleLink = 'https://www.quickbase.com';

const basicUrlFieldValueRendererExample = (
    <div>
        <dt>Default: </dt>
        <dd>
            <UrlFieldValueRenderer value={exampleLink} display={exampleLink} />
        </dd>

        <dt>Non-Clickable Link</dt>
        <dd>
            <UrlFieldValueRenderer value={exampleLink} display={exampleLink} clickable={false} />
        </dd>

        <dt>Show as a Button</dt>
        <dd>
            <UrlFieldValueRenderer value={exampleLink} display={exampleLink} showAsButton={true} />
        </dd>

        <dt>This link opens in a new window</dt>
        <dd>
            <UrlFieldValueRenderer value={exampleLink} display={exampleLink} openInNewWindow={true} />
        </dd>

        <dt>Displays a different display value than the underlying link</dt>
        <dd>
            <UrlFieldValueRenderer value={exampleLink} display='Click Me!' />
        </dd>
    </div>
);

ReactDOM.render(basicUrlFieldValueRendererExample, mountNode);
