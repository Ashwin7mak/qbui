let exampleLink = 'https://www.quickbase.com';
let exampleLinkWithoutProtocol = 'www.quickbase.com';

const basicUrlFieldValueRendererExample = (
    <div>
        <dt>Default:</dt>
        <dd>
            <UrlFieldValueRenderer value={exampleLink} display={exampleLink} />
        </dd>

        <dt>Disabled Link:</dt>
        <dd>
            <UrlFieldValueRenderer value={exampleLink} display={exampleLink} disabled={true} />
        </dd>

        <dt>Link Button:</dt>
        <dd>
            <UrlFieldValueRenderer value={exampleLink} display={exampleLink} showAsButton={true} />
        </dd>

        <dt>Disabled Link Button:</dt>
        <dd>
            <UrlFieldValueRenderer value={exampleLink} display={exampleLink} showAsButton={true} disabled={true} />
        </dd>

        <dt>Can open in a new window:</dt>
        <dd>
            <UrlFieldValueRenderer value={exampleLink} display={exampleLink} openInNewWindow={true} />
        </dd>

        <dt>Displays alternate text:</dt>
        <dd>
            <UrlFieldValueRenderer value={exampleLink} display="Click Me!" />
        </dd>

        <dt>Adds the default protocol (http) if one is not provided:</dt>
        <dd>
            <UrlFieldValueRenderer value={exampleLinkWithoutProtocol} display={exampleLinkWithoutProtocol} openInNewWindow={true} />
        </dd>

        <dt>Displays an icon for special protocols (on hover for desktop):</dt>
        <dd>
            <UrlFieldValueRenderer value="mailto:test@quickbase.com" display="test@quickbase.com" />
            <UrlFieldValueRenderer value="tel:5555555555" display="(555) 555-5555 (tel)" />
            <UrlFieldValueRenderer value="sms:5555555555" display="(555) 555-5555 (sms)" />
        </dd>


    </div>
);

ReactDOM.render(basicUrlFieldValueRendererExample, mountNode);
