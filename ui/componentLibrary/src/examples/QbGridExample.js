const CellRenderer = (props) => {return <div className="customCell">{props.text}</div>;};
const cellFormatter = (cellData) => {return React.createElement(CellRenderer, cellData);};

// Typically, use the ColumnTransformer helper in the qbGrid folder to create columns.
// Not used here because imports are not allowed in Component Library Playground
const columns = [
    {
        property: 'a',
        header: {
            label: <span>Column A</span>
        },
        cell: {formatters: [cellFormatter]}
    },
    {
        property: 'b',
        header: {
            label: <span>Column B</span>
        },
        cell: {formatters: [cellFormatter]}
    },
    {
        property: 'c',
        header: {
            label: <span>Column C</span>
        },
        cell: {formatters: [cellFormatter]}
    },
];

// Typically use the RowTransformer helper in the qbGrid folder to create rows.
// Not use here because imports are not allowed in the Component Library Playground
const rows = [
    {
        id: 1,
        text: 'Row 1',
        a: {text: 'Row-1 Cell-A'},
        b: {text: 'Row-1 Cell-B'},
        c: {text: 'Row-1 Cell-C'}
    },
    {
        id: 2,
        text: 'Row 2',
        a: {text: 'Row-2 Cell-A'},
        b: {text: 'Row-2 Cell-B'},
        c: {text: 'Row-2 Cell-C'}
    },
    {
        id: 3,
        text: 'Row 3',
        a: {text: 'Row-3 Cell-A'},
        b: {text: 'Row-3 Cell-B'},
        c: {text: 'Row-3 Cell-C'}
    },
    {
        id: 4,
        text: 'Row 4',
        a: {text: 'Row-4 Cell-A'},
        b: {text: 'Row-4 Cell-B'},
        c: {text: 'Row-4 Cell-C'}
    },
    {
        id: 5,
        text: 'Row 5',
        a: {text: 'Row-5 Cell-A'},
        b: {text: 'Row-5 Cell-B'},
        c: {text: 'Row-5 Cell-C'}
    }
];



const basicQbGridExample = (
    <div>
        <dt>Default: </dt>
        <dd>
            <QbGrid
                cellRenderer={CellRenderer}
                columns={columns}
                rows={rows}
                numberOfColumns={columns.length}
                showRowActionsColumn={false}
            />
        </dd>
    </div>
);

ReactDOM.render(basicQbGridExample, mountNode);
