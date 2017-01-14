import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import ReportColumnHeaderMenuContainer from '../../../src/components/dataTable/reportGrid/reportColumnHeaderMenuContainer';
import serverTypeConsts from '../../../../common/src/constants';
import * as query from '../../../src/constants/query';

const mockFlux = {
    actions: {
        loadDynamicReport() {}
    }
};

const mockProps = {
    appId: 'app1',
    tblId: 'tbl1',
    rptId: 'rpt1',
    filter: 'someFilter'
};

const MockMenu = (_props) => {
    return <div className="mockMenu"></div>;
};

const mockFieldDef = {
    id: 1
};

let component;
let instance;

describe('ReportColumnHeaderMenuContainer', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('passes the sortReport and groupReport functions to the ReportColumnHeaderMenu', () => {
        // createElement is used here because we need to build the Higher Order Component
        component = shallow(React.createElement(ReportColumnHeaderMenuContainer(MockMenu), {flux: mockFlux, ...mockProps}));
        instance = component.instance();

        let reportMenuComponent = component.find(MockMenu);
        expect(reportMenuComponent).toHaveProp('sortReport', instance.sortReport);
        expect(reportMenuComponent).toHaveProp('groupReport', instance.groupReport);
    });

    describe('hasRequiredIds', () => {
        it('returns true if the appropriate props have been passed in to be able to call sort and group actions', () => {
            component = shallow(React.createElement(ReportColumnHeaderMenuContainer(MockMenu), {flux: mockFlux, ...mockProps}));
            instance = component.instance();

            expect(instance.hasRequiredIds()).toBeTruthy();
        });

        it('returns false if the required props to call sort and group actions are missing', () => {
            component = shallow(React.createElement(ReportColumnHeaderMenuContainer(MockMenu), {flux: mockFlux}));
            instance = component.instance();

            expect(instance.hasRequiredIds()).toBeFalsy();
        });
    });

    describe('groupReport', () => {
        it('calls the flux action to group a report', () => {
            spyOn(mockFlux.actions, 'loadDynamicReport');

            component = shallow(React.createElement(ReportColumnHeaderMenuContainer(MockMenu), {flux: mockFlux, ...mockProps}));
            instance = component.instance();

            instance.groupReport(mockFieldDef, true);

            let expectedQueryParams = {};
            expectedQueryParams[query.SORT_LIST_PARAM] = '1:EQUALS';
            expectedQueryParams[query.OFFSET_PARAM] = serverTypeConsts.PAGE.DEFAULT_OFFSET;
            expectedQueryParams[query.NUMROWS_PARAM] = serverTypeConsts.PAGE.DEFAULT_NUM_ROWS;

            expect(mockFlux.actions.loadDynamicReport).toHaveBeenCalledWith(mockProps.appId, mockProps.tblId, mockProps.rptId, true, mockProps.filter, expectedQueryParams);
        });
    });

    describe('sortReport', () => {
        it('calls the flux action to sort a report', () => {
            spyOn(mockFlux.actions, 'loadDynamicReport');

            component = shallow(React.createElement(ReportColumnHeaderMenuContainer(MockMenu), {flux: mockFlux, ...mockProps}));
            instance = component.instance();

            instance.sortReport(mockFieldDef, true, false);

            let expectedQueryParams = {};
            expectedQueryParams[query.SORT_LIST_PARAM] = '1';
            expectedQueryParams[query.OFFSET_PARAM] = serverTypeConsts.PAGE.DEFAULT_OFFSET;
            expectedQueryParams[query.NUMROWS_PARAM] = serverTypeConsts.PAGE.DEFAULT_NUM_ROWS;

            expect(mockFlux.actions.loadDynamicReport).toHaveBeenCalledWith(mockProps.appId, mockProps.tblId, mockProps.rptId, true, mockProps.filter, expectedQueryParams);
        });
    });
});
