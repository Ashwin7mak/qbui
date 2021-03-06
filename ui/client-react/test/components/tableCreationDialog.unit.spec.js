import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import {shallow} from 'enzyme';
import TestUtils, {Simulate} from 'react-addons-test-utils';

import {TableCreationDialog, __RewireAPI__ as TableCreationDialogRewireAPI} from '../../src/components/table/tableCreationDialog';

let component;
let instance;
let domComponent;
let mockRoute = 'mockRoute';
let mockTHPlink = 'mockTHP';
let mockTableId = 'mockTableId';
let tableInfo = {name: {value: {}}, description: {value: {}}, tableIcon: {value: {}}, tableNoun: {value: {}}};

const mockNotificationManager = {
    error() {}
};

const AppHistoryMock = {
    history: {push(_location) {}},
};

const mockUrlUtils = {
    getAfterTableCreatedLink() {},
    getTableHomepageLink() {return mockTHPlink;}
};

const mockParentFunctions = {
    hideDialog() {},
    setEditingProperty() {},
    setTableProperty() {},
    createTable: () => {return {then: (fn) => fn({data: mockTableId})};},
    createTableFailed: () => {return {then: (fn, fnFailed) => fnFailed()};},
    tableCreated() {},
    hideTableCreationDialog() {},
    updateFormRedirectRoute() {},
    onTableCreated() {}
};

let app = {
    id: 'mockAppId',
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
                                     updateFormRedirectRoute={mockParentFunctions.updateFormRedirectRoute}
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
        TableCreationDialogRewireAPI.__Rewire__('NotificationManager', mockNotificationManager);
        TableCreationDialogRewireAPI.__Rewire__('AppHistory', AppHistoryMock);
        TableCreationDialogRewireAPI.__Rewire__('UrlUtils', mockUrlUtils);

        spyOn(mockParentFunctions, 'createTable').and.callThrough();
        spyOn(mockParentFunctions, 'createTableFailed').and.callThrough();
        spyOn(mockParentFunctions, 'updateFormRedirectRoute').and.callThrough();
        spyOn(mockUrlUtils, 'getAfterTableCreatedLink').and.returnValue(mockRoute);
        spyOn(mockUrlUtils, 'getTableHomepageLink').and.returnValue(mockTHPlink);
        spyOn(AppHistoryMock.history, 'push');
        spyOn(mockNotificationManager, 'error');
    });

    afterEach(() => {
        // Remove modal from the dom after every test to reset
        let modalInDom = document.querySelector('.tableCreationDialog.creationDialog');
        if (modalInDom) {
            modalInDom.parentNode.removeChild(modalInDom);
        }

        TableCreationDialogRewireAPI.__ResetDependency__('NotificationManager');
        TableCreationDialogRewireAPI.__ResetDependency__('AppHistory');
        TableCreationDialogRewireAPI.__ResetDependency__('UrlUtils');
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

    it('will create a table when onFinished is invoked', () => {
        component = shallow(<TableCreationDialog createTable={mockParentFunctions.createTable}
                                                 tableCreation={{iconChooserOpen: {}}}
                                                 tableInfo={tableInfo}
                                                 app={app}
                                                 onTableCreated={mockParentFunctions.onTableCreated}
                                                 updateFormRedirectRoute={mockParentFunctions.updateFormRedirectRoute}
                                                 hideTableCreationDialog={mockParentFunctions.hideTableCreationDialog} />);
        const tableInfoResult = {
            name: tableInfo.name.value,
            description: tableInfo.description.value,
            tableIcon: tableInfo.tableIcon.value,
            tableNoun: tableInfo.tableNoun.value
        };

        instance = component.instance();
        instance.onFinished();

        expect(mockParentFunctions.createTable).toHaveBeenCalledWith(app.id, tableInfoResult);
        expect(mockParentFunctions.updateFormRedirectRoute).toHaveBeenCalledWith(mockTHPlink);

        expect(mockUrlUtils.getAfterTableCreatedLink).toHaveBeenCalledWith(app.id, mockTableId);
        expect(AppHistoryMock.history.push).toHaveBeenCalledWith(mockRoute);
    });

    it('will display an error message if table creation fails', () => {
        component = shallow(<TableCreationDialog createTable={mockParentFunctions.createTableFailed}
                                                 tableCreation={{iconChooserOpen: {}}}
                                                 tableInfo={tableInfo}
                                                 app={app}
                                                 onTableCreated={mockParentFunctions.onTableCreated}
                                                 updateFormRedirectRoute={mockParentFunctions.updateFormRedirectRoute}
                                                 hideTableCreationDialog={mockParentFunctions.hideTableCreationDialog} />);

        instance = component.instance();
        instance.onFinished();

        expect(mockParentFunctions.createTable).not.toHaveBeenCalled();
        expect(AppHistoryMock.history.push).not.toHaveBeenCalled();
        expect(mockNotificationManager.error).toHaveBeenCalled();
    });
});
