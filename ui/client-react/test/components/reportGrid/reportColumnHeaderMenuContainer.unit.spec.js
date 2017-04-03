import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import ReportColumnHeaderMenuContainer, {
    __RewireAPI__ as RewireAPI
} from '../../../src/components/dataTable/reportGrid/reportColumnHeaderMenuContainer';
import serverTypeConsts from '../../../../common/src/constants';
import * as query from '../../../src/constants/query';
import {CONTEXT} from '../../../src/actions/context';

const mockProps = {
    appId: 'app1',
    tblId: 'tbl1',
    rptId: 'rpt1',
    filter: 'someFilter',
    // Since ReportColumnHeaderMenuContainer itself is not connected to a redux store, pass in fake
    // dispatch function as a prop.
    dispatch() {}
};

const MockMenu = (_props) => {
    return <div className="mockMenu"></div>;
};

const mockFieldDef = {
    id: 1
};

let component;
let instance;
let loadDynamicReport;

describe('ReportColumnHeaderMenuContainer', () => {
    beforeEach(() => {
        jasmineEnzyme();
        loadDynamicReport = jasmine.createSpy('loadDynamicReport');
        RewireAPI.__Rewire__('loadDynamicReport', loadDynamicReport);
    });

    afterEach(() => {
        RewireAPI.__ResetDependency__('loadDynamicReport');
    });

    it('passes the sortReport and groupReport functions to the ReportColumnHeaderMenu', () => {
        // createElement is used here because we need to build the Higher Order Component
        component = shallow(React.createElement(ReportColumnHeaderMenuContainer(MockMenu), {...mockProps}));
        instance = component.instance();

        let reportMenuComponent = component.find(MockMenu);
        expect(reportMenuComponent).toHaveProp('sortReport', instance.sortReport);
        expect(reportMenuComponent).toHaveProp('groupReport', instance.groupReport);
    });

    describe('hasRequiredIds', () => {
        it('returns true if the appropriate props have been passed in to be able to call sort and group actions', () => {
            component = shallow(React.createElement(ReportColumnHeaderMenuContainer(MockMenu), {...mockProps}));
            instance = component.instance();

            expect(instance.hasRequiredIds()).toBeTruthy();
        });

        it('returns false if the required props to call sort and group actions are missing', () => {
            component = shallow(React.createElement(ReportColumnHeaderMenuContainer(MockMenu)));
            instance = component.instance();

            expect(instance.hasRequiredIds()).toBeFalsy();
        });
    });

    describe('groupReport', () => {
        it('calls loadDynamicReport to group a report', () => {
            component = shallow(React.createElement(ReportColumnHeaderMenuContainer(MockMenu), {...mockProps}));
            instance = component.instance();

            instance.groupReport(mockFieldDef, true);

            let expectedQueryParams = {};
            expectedQueryParams[query.SORT_LIST_PARAM] = '1:EQUALS';
            expectedQueryParams[query.OFFSET_PARAM] = serverTypeConsts.PAGE.DEFAULT_OFFSET;
            expectedQueryParams[query.NUMROWS_PARAM] = serverTypeConsts.PAGE.DEFAULT_NUM_ROWS;

            expect(loadDynamicReport).toHaveBeenCalledWith(CONTEXT.REPORT.NAV, mockProps.appId, mockProps.tblId, mockProps.rptId, true, mockProps.filter, expectedQueryParams);
        });

        it('does not call the group action if the required props are not passed in', () => {
            component = shallow(React.createElement(ReportColumnHeaderMenuContainer(MockMenu)));
            instance = component.instance();

            instance.groupReport(mockFieldDef, true);

            expect(loadDynamicReport).not.toHaveBeenCalled();
        });
    });

    describe('sortReport', () => {
        it('calls loadDynamicReport to sort a report', () => {
            component = shallow(React.createElement(ReportColumnHeaderMenuContainer(MockMenu), {...mockProps}));
            instance = component.instance();

            instance.sortReport(mockFieldDef, true, false);

            let expectedQueryParams = {};
            expectedQueryParams[query.SORT_LIST_PARAM] = '1';
            expectedQueryParams[query.OFFSET_PARAM] = serverTypeConsts.PAGE.DEFAULT_OFFSET;
            expectedQueryParams[query.NUMROWS_PARAM] = serverTypeConsts.PAGE.DEFAULT_NUM_ROWS;

            expect(loadDynamicReport).toHaveBeenCalledWith(CONTEXT.REPORT.NAV, mockProps.appId, mockProps.tblId, mockProps.rptId, true, mockProps.filter, expectedQueryParams);
        });

        it('does not call the action to sort a report if the required props are not passed in', () => {
            component = shallow(React.createElement(ReportColumnHeaderMenuContainer(MockMenu)));
            instance = component.instance();

            instance.sortReport(mockFieldDef, true, false);

            expect(loadDynamicReport).not.toHaveBeenCalled();
        });

        it('does not call the action to sort a report if it is already sorted', () => {
            component = shallow(React.createElement(ReportColumnHeaderMenuContainer(MockMenu), {...mockProps}));
            instance = component.instance();

            instance.sortReport(mockFieldDef, true, true);

            expect(loadDynamicReport).not.toHaveBeenCalled();
        });
    });
});
