// This is a basic example for the React playground
// Please update to include other properties or states for your component

let exampleEmail = 'test@quickbase.com';
let exampleEmailWithProtocol = `mailto:${exampleEmail}`;

const EmailFieldValueRendererExample = (
    <div>
        <dt>Default: </dt>
        <dd>
            <EmailFieldValueRenderer display={exampleEmail} />
        </dd>

        <dt>Will not override mailto: </dt>
        <dd>
            <EmailFieldValueRenderer display={exampleEmailWithProtocol} />
        </dd>

        <dt>Supports all of the URL properties: </dt>
        <dd>
            <EmailFieldValueRenderer display={exampleEmail} value={exampleEmail} showAsButton={true} />
        </dd>
    </div>
);

ReactDOM.render(EmailFieldValueRendererExample, mountNode);
