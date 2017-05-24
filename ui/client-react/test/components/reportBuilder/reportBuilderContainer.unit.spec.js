import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {ReportBuilderContainer, __RewireAPI__ as ReportBuilderRewireAPI} from '../../../src/components/builder/reportBuilderContainer';

const appId = "1";
const tblId = "2";
const rptId = '3';
const tableHomePageRptId = '0';

const mockActions = {
    exitBuilderMode() {},
    loadDynamicReport() {}
};

const previousLocation = '/somewhere/over/the/rainbow';
const reportName = 'name';

let reportData = {
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
};

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
    reportData: reportData,
    ...mockActions
};

let testPropsTableHomePage = {
    match: {
        params: {
            appId: appId,
            tblId: tblId,
            rptId: tableHomePageRptId
        }
    },
    redirectRoute: previousLocation,
    reportBuilder: {

    },
    reportData: reportData,
    ...mockActions
};

let component;

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
        spyOn(mockActions, 'loadDynamicReport');
    });

    afterEach(() => {
        ReportBuilderRewireAPI.__ResetDependency__('ReportFieldSelectMenu');
        ReportBuilderRewireAPI.__ResetDependency__('ReportNameEditor');
        ReportBuilderRewireAPI.__ResetDependency__('ReportToolsAndContent');
        ReportBuilderRewireAPI.__ResetDependency__('ReportSaveOrCancelFooter');

        mockActions.exitBuilderMode.calls.reset();
        mockActions.loadDynamicReport.calls.reset();
    });

    it('renders the ReportFieldSelectMenu', () => {
        component = shallow(<ReportBuilderContainer {...testProps} />);

        let reportFieldSelectMenu = component.find('.reportBuilderFieldSelectMenu');
        expect(reportFieldSelectMenu).toBePresent();
        expect(reportFieldSelectMenu).toHaveProp('appId', appId);
        expect(reportFieldSelectMenu).toHaveProp('tblId', tblId);
        expect(reportFieldSelectMenu).toHaveProp('reportData', testProps.reportData);
    });

    it('renders ReportNameEditor when name is a prop', () => {
        component = shallow(<ReportBuilderContainer {...testProps} />);

        let reportNameEditor = component.find('.reportBuilderNameEditor');

        expect(reportNameEditor).toBePresent();
        expect(reportNameEditor).toHaveProp('name', reportName);
    });

    it('does not render ReportNameEditor when rptId is 0', () => {
        component = shallow(<ReportBuilderContainer {...testPropsTableHomePage} />);

        let reportNameEditor = component.find('.reportBuilderNameEditor');

        expect(reportNameEditor).not.toBePresent();
    });

    it('renders ReportToolsAndContent', () => {
        component = shallow(<ReportBuilderContainer {...testProps} />);

        let reportNameEditor = component.find('.reportBuilderToolsAndContent');

        expect(reportNameEditor).toBePresent();
    });

    it('renders ReportSaveOrCancelFooter', () => {
        component = shallow(<ReportBuilderContainer {...testProps} />);

        let reportNameEditor = component.find('.reportBuilderSaveOrCancelFooter');

        expect(reportNameEditor).toBePresent();
    });
});
