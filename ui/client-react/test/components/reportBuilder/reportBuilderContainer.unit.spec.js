import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {NEW_FORM_RECORD_ID} from '../../../src/constants/schema';
import {ReportBuilderContainer, __RewireAPI__ as ReportBuilderRewireAPI} from '../../../src/components/builder/reportBuilderContainer';
import NavigationUtils from '../../../src/utils/navigationUtils';
import {ENTER_KEY, SPACE_KEY} from '../.././../../reuse/client/src/components/keyboardShortcuts/keyCodeConstants';

import Loader from 'react-loader';

const appId = "1";
const tblId = "2";
const rptId = '3';

const mockActions = {
    exitBuilderMode() {},
    closeFieldSelectMenu() {},
    loadDynamicReport() {}
};

const previousLocation = '/somewhere/over/the/rainbow';
const reportName = 'name';

let testProps = {
    match: {
        params: {
            appId: appId,
            tblId: tblId,
            rptId: rptId
        }
    },
    redirectRoute: previousLocation,
    reportBuilder: {

    },
    reportData: {
        data: {
            sortFids: [],
            name: reportName,
            columns: {

            },
            records: {

            },
            searchStringForFiltering: '',
            selectedRows: []
        }
    },
    ...mockActions
};

let component;
let instance;

class mockReportToolsAndContent extends React.Component {
    render() {
        return <div />;
    }
}

class mockReportFieldSelectMenu extends React.Component {
    render() {
        return <div />;
    }
}

class mockReportNameEditor extends React.Component {
    render() {
        return <div />;
    }
}

class mockReportSaveOrCancelFooter extends React.Component {
    render() {
        return <div />;
    }
}

describe('ReportBuilderContainer', () => {
    beforeEach(() => {
        jasmineEnzyme();
        ReportBuilderRewireAPI.__Rewire__('ReportFieldSelectMenu', mockReportFieldSelectMenu);
        ReportBuilderRewireAPI.__Rewire__('ReportNameEditor', mockReportNameEditor);
        ReportBuilderRewireAPI.__Rewire__('ReportToolsAndContent', mockReportToolsAndContent);
        ReportBuilderRewireAPI.__Rewire__('ReportSaveOrCancelFooter', mockReportSaveOrCancelFooter);

        spyOn(mockActions, 'exitBuilderMode');
        spyOn(mockActions, 'closeFieldSelectMenu');
        spyOn(mockActions, 'loadDynamicReport');
    });

    afterEach(() => {
        ReportBuilderRewireAPI.__ResetDependency__('ReportFieldSelectMenu');
        ReportBuilderRewireAPI.__ResetDependency__('ReportNameEditor');
        ReportBuilderRewireAPI.__ResetDependency__('ReportToolsAndContent');
        ReportBuilderRewireAPI.__ResetDependency__('ReportSaveOrCancelFooter');

        mockActions.exitBuilderMode.calls.reset();
        mockActions.closeFieldSelectMenu.calls.reset();
        mockActions.loadDynamicReport.calls.reset();
    });
});
