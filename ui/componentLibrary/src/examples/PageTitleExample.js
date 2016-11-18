const basicPageTitleExample = (
    <div>
        <p>
            <b>Note: </b> This component does not render anything to the page.
        </p>

        <dt>Update the Page Title: </dt>
        <dd>
            {'<PageTitle title="Title for the Page" />'}
        </dd>

        <dt>Provide context to have the page title automatically updated: </dt>
        <dd>
            {'<PageTitle app={currentlySelectedApp} table={currentlySelectedTable} />'}
        </dd>
    </div>
);

ReactDOM.render(basicPageTitleExample, mountNode);
