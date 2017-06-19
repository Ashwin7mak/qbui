import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import TestUtils, {Simulate} from 'react-addons-test-utils';

import {AppCreationDialog} from '../../src/components/app/appCreationDialog';

let component;
let domComponent;

const mockParentFunctions = {
};

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
        let modalInDom = document.querySelector('.tableCreationDialog.creationDialog');
        if (modalInDom) {
            modalInDom.parentNode.removeChild(modalInDom);
        }
    });

    it('renders a TableCreationDialog', () => {
        component = buildMockParentComponent();

        domComponent = document.querySelector('.tableCreationDialog.creationDialog');

        expect(domComponent).not.toBeNull();
    });

    it('cancels the TableCreationDialog', () => {
        component = buildMockParentComponent();

        domComponent = document.querySelector('.tableCreationDialog.creationDialog');

        let cancelButton = domComponent.querySelector('.cancelButton');
        Simulate.click(cancelButton);
    });
});
