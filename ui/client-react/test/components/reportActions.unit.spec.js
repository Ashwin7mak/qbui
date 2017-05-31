import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import {ReportActions, __RewireAPI__ as ReportActionsRewireAPI}  from '../../src/components/actions/reportActions';
import ActionIcon from '../../src/components/actions/actionIcon';
import {CONTEXT} from '../../src/actions/context';

const testRecordId = 2;
const mockReportData = {
    data: {
        keyField: {name: 'Record ID#'},
        records: [
            {'Record ID#': {value: testRecordId}}
        ]
    },
    selectedRows: [testRecordId]
};
const mockRecordsArray = [
    {
        'Record ID#': {
            display: '1',
            value: 1
        }
    },
    {
        'Record ID#': {
            display: '2',
            value: 2
        }
    },
    {
        'Record ID#': {
            display: '3',
            value: 3
        }
    }
];

describe('ReportActions functions', () => {
    'use strict';

    let component;
    let rptId = 1;
    let appId = 1;
    let tblId = 1;
    let props = {
        appId: appId,
        tblId: tblId,
        rptId: rptId,
        deleteRecords: () => {}
    };

    beforeEach(() => {
        spyOn(props, 'deleteRecords').and.callThrough();
    });

    afterEach(() => {
        props.deleteRecords.calls.reset();
    });

    it('test render of component', () => {
        let selection = [];
        component = TestUtils.renderIntoDocument(<ReportActions selection={selection} {...props}/>);
    });

    it('test render with 1 selected row', () => {
        let selection = [1];
        component = TestUtils.renderIntoDocument(<ReportActions selection={selection} {...props}/>);

        let actionIcons = TestUtils.scryRenderedComponentsWithType(component, ActionIcon);
        expect(actionIcons[0].props.icon).toEqual("edit");
    });

    it('test render of >1 selected row', () => {
        let selection = [1, 2, 3];
        component = TestUtils.renderIntoDocument(<ReportActions selection={selection} {...props}/>);
        let actionIcons = TestUtils.scryRenderedComponentsWithType(component, ActionIcon);

        // only allow edit of single selection
        expect(actionIcons[0].props.icon).not.toEqual("edit");
    });

    it('test onClick event for delete', () => {
        let selection = [1, 2, 3];
        component = TestUtils.renderIntoDocument(<ReportActions selection={selection} {...props}/>);
        let actionIcons = TestUtils.scryRenderedComponentsWithType(component, ActionIcon);
        let node = ReactDOM.findDOMNode(actionIcons[4]);
        TestUtils.Simulate.click(node);

        // confirm via the modal dialog
        const confirmButton = document.querySelector(".qbModal .primaryButton");
        expect(confirmButton).not.toBe(null);
        TestUtils.Simulate.click(confirmButton);
        expect(props.deleteRecords).toHaveBeenCalled();
    });

    describe('getEmailBody', () => {
        it('returns the body of the email for the report email link', () => {
            component = TestUtils.renderIntoDocument(<ReportActions selection={[]} {...props}/>);

            expect(component.getEmailBody()).toEqual('Email body goes here');
        });
    });

    describe('getEmailSubject', () => {
        it('returns the subject of the email for the report email link', () => {
            component = TestUtils.renderIntoDocument(<ReportActions selection={[]} {...props}/>);

            expect(component.getEmailSubject()).toEqual('Email subject goes here');
        });
    });

    describe('cancelBulkDelete', () => {
        it('closes the delete confirmation window', () => {
            component = TestUtils.renderIntoDocument(<ReportActions selection={[]} {...props}/>);
            component.setState({confirmDeletesDialogOpen: true});

            component.cancelBulkDelete();

            expect(component.state.confirmDeletesDialogOpen).toEqual(false);
        });
    });

    describe('navigateToRecord', () => {
        it('navigates to the currently selected record', () => {
            const mockParentActions = {
                openRecord() {}
            };
            spyOn(mockParentActions, 'openRecord');

            component = TestUtils.renderIntoDocument(<ReportActions selection={[]} {...props} openRecord={mockParentActions.openRecord} />);
            spyOn(component, 'getReport').and.returnValue(mockReportData);
            spyOn(component, 'getRecordsArray').and.returnValue(mockRecordsArray);

            component.navigateToRecord(testRecordId);

            expect(mockParentActions.openRecord).toHaveBeenCalledWith(testRecordId, 3, 1);
        });
    });

    describe('getRecordIdFromReport', () => {
        const MockFieldUtils = {
            getPrimaryKeyFieldName() {return 'Record ID#';}
        };

        beforeEach(() => {
            ReportActionsRewireAPI.__Rewire__('FieldUtils', MockFieldUtils);
        });

        afterEach(() => {
            ReportActionsRewireAPI.__ResetDependency__('FieldUtils');
        });

        it('gets the record id from the report data', () => {
            component = TestUtils.renderIntoDocument(<ReportActions selection={[]} {...props} />);
            spyOn(component, 'getReport').and.returnValue(mockReportData);

            let result = component.getRecordIdFromReport();

            expect(result).toEqual(testRecordId);
        });
    });

    describe('getReport', () => {
        it('finds the report that matches the nav context', () => {
            const mockReportsFromStore = [
                {id: 'different report'},
                {id: CONTEXT.REPORT.NAV}
            ];

            component = TestUtils.renderIntoDocument(<ReportActions selection={[]} {...props} report={mockReportsFromStore} />);

            expect(component.getReport()).toEqual(mockReportsFromStore[1]);
        });
    });
});
