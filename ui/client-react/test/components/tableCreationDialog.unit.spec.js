import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import TestUtils, {Simulate} from 'react-addons-test-utils';

import {TableCreationDialog} from '../../src/components/table/tableCreationDialog';

let component;
let domComponent;

const mockParentFunctions = {
    hideDialog() {},
    setEditingProperty() {},
    setTableProperty() {},
    createTable: () => {return {then: (fn) => fn({data:'tableId'})};},
    tableCreated() {}
};

let app = {
    tables: [
        {name: 'table1'},
        {name: 'table2'}
    ]
};

function getTableProps(pageIndex) {
    return {
        dialogOpen: true,
        tableInfo: {
            name: {value: 'Customers'},
            tableNoun: {value: 'customer'},
            description: {value: ''},
            tableIcon: {value: 'projects'}
        }
    };
}

function buildMockParent() {
    return React.createClass({
        getInitialState() {
            return {
                pageIndex: 0
            };
        },
        render() {
            const tableCreationProps = getTableProps(this.state.pageIndex);
            return (
                <TableCreationDialog app={app}
                                     tableCreation={tableCreationProps}
                                     tableInfo={tableCreationProps.tableInfo}
                                     setEditingProperty={mockParentFunctions.setEditingProperty}
                                     setTableProperty={mockParentFunctions.setTableProperty}
                                     hideTableCreationDialog={mockParentFunctions.hideDialog}
                                     createTable={mockParentFunctions.createTable}
                                     onTableCreated={mockParentFunctions.tableCreated}
                />
            );
        }
    });
}

function buildMockParentComponent(options) {
    return TestUtils.renderIntoDocument(React.createElement(buildMockParent(options)));
}

describe('TableCreationDialog', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    afterEach(() => {
        // Remove modal from the dom after every test to reset
        let modalInDom = document.querySelector('.tableCreationDialog');
        if (modalInDom) {
            modalInDom.parentNode.removeChild(modalInDom);
        }
    });

    it('renders a TableCreationDialog', () => {
        component = buildMockParentComponent();

        domComponent = document.querySelector('.tableCreationDialog');

        expect(domComponent).not.toBeNull();
    });

    it('cancels the TableCreationDialog', () => {
        component = buildMockParentComponent();

        domComponent = document.querySelector('.tableCreationDialog');

        let cancelButton = domComponent.querySelector('.cancelButton');
        Simulate.click(cancelButton);
    });
});
