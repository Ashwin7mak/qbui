// This is a basic example for the React playground
// Please update to include other properties or states for your component

const basicTopNavExample = (
    <div>
        <dt>Default: </dt>
        <dd>
            <TopNav globalActions={
                <DefaultTopNavGlobalActions
                    startTabIndex={4}
                    dropdownIcon="user"
                    dropdownMsg="globalActions.user"
                />
            }/>
        </dd>
    </div>
);

ReactDOM.render(basicTopNavExample, mountNode);
