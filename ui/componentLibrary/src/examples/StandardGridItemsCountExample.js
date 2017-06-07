// This is a basic example for the React playground
// Please update to include other properties or states for your component

const basicStandardGridItemsCountExample = (
    <div>
        <dt>Default: </dt>
        <dd>
            <StandardGridItemsCount totalFilteredItems={15}
                                    totalItems={30}
                                    itemTypeSingular="item"
                                    itemTypePlural="items"
            />
        </dd>
    </div>
);

ReactDOM.render(basicStandardGridItemsCountExample, mountNode);
