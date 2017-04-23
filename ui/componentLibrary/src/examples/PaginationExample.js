// This is a basic example for the React playground
// Please update to include other properties or states for your component

const basicPaginationExample = (
    <div>
        <dt>Default: </dt>
        <dd>
            <Pagination startRecord={1}
                        endRecord={3}
                        isPreviousDisabled={true}
                        isNextDisabled={false}
                        isHidden={false} />
        </dd>
    </div>
);

ReactDOM.render(basicPaginationExample, mountNode);
