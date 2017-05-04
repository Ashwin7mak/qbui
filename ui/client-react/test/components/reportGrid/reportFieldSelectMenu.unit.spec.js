import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import {CONTEXT} from '../../../src/actions/context';
import {ReportFieldSelectMenu, __RewireAPI__ as RewireAPI} from '../../../src/components/report/reportFieldSelectMenu';
import SideMenuBase from '../../../../reuse/client/src/components/sideMenuBase/sideMenuBase';
import FieldTokenInMenu from '../../../src/components/formBuilder/fieldToken/fieldTokenInMenu';
import ListOfElements from '../../../../reuse/client/src/components/sideNavs/listOfElements';
import QBicon from '../../../src/components/qbIcon/qbIcon';
import Locale from '../../../../reuse/client/src/locales/locale';

let component;
let appId = 0;
let tblId = 1;
let reportData = {
    data: {
        columns: [
            {
                fieldDef: {
                    id: 7
                },
                headerName: "Test Column 2",
                type: "TEXT",
                isPlaceholder: false,
                isHidden: false,
                id: 7,
                order: 2
            }
        ]
    }
};

let testProps = {
    menu: {
        isCollapsed: true,
        addBeforeColumn: true,
        availableColumns: [
            {
                fieldDef: {
                    id: 6
                },
                headerName: "Test Column 1",
                type: "TEXT",
                isPlaceholder: false,
                isHidden: true,
                id: 6,
                order: 1
            },
            {
                fieldDef: {
                    id: 7
                },
                headerName: "Test Column 2",
                type: "TEXT",
                isPlaceholder: false,
                isHidden: false,
                id: 7,
                order: 2
            },
        ]
    },
    closeFieldSelectMenu: (context) => {},
    refreshFieldSelectMenu: (context, applicationId, tableId) => {},
    addColumnFromExistingField: (context, requestedColumn, addBefore) => {}
};

let hiddenColumns = [
    {
        fieldDef: {
            id: 6
        },
        headerName: "Test Column 1",
        type: "TEXT",
        isPlaceholder: false,
        isHidden: true,
        id: 6,
        order: 1
    }
];

const MockLocale = {
    getMessage(messageKey) {return messageKey;}
};

const MockReportUtils = {
    getDifferenceOfColumns(allColumns, currentColumns) {return hiddenColumns;}
};

describe('ReportFieldSelectMenu', () => {
    beforeEach(() => {
        jasmineEnzyme();
        RewireAPI.__Rewire__('Locale', MockLocale);
        RewireAPI.__Rewire__('ReportUtils', MockReportUtils);
        spyOn(testProps, 'closeFieldSelectMenu').and.callThrough();
        spyOn(testProps, 'refreshFieldSelectMenu').and.callThrough();
        spyOn(testProps, 'addColumnFromExistingField').and.callThrough();
    });

    afterEach(() => {
        RewireAPI.__ResetDependency__('Locale');
        RewireAPI.__ResetDependency__('ReportUtils');
        testProps.closeFieldSelectMenu.calls.reset();
        testProps.refreshFieldSelectMenu.calls.reset();
        testProps.addColumnFromExistingField.calls.reset();
    });

    it('renders a SideMenuBase with options for ReportFieldSelectMenu styling', () => {
        component = shallow(<ReportFieldSelectMenu {...testProps} appId={appId} tblId={tblId} reportData={reportData}/>);

        let sideMenu = component.find(SideMenuBase);
        expect(sideMenu).toBePresent();
        expect(sideMenu).toHaveProp('baseClass', 'reportFieldSelectMenu');
    });

    it('calls refresh in constructor', () => {
        component = mount(<ReportFieldSelectMenu {...testProps} appId={appId} tblId={tblId} reportData={reportData}/>);

        expect(testProps.refreshFieldSelectMenu).toHaveBeenCalledWith(CONTEXT.REPORT.NAV, appId, tblId);
    });

    it('calls close in constructor', () => {
        component = mount(<ReportFieldSelectMenu {...testProps} appId={appId} tblId={tblId} reportData={reportData}/>);

        expect(testProps.closeFieldSelectMenu).toHaveBeenCalledWith(CONTEXT.REPORT.NAV);
    });
});
