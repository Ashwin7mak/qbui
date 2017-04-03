import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {mount, shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import Promise from 'bluebird';

import ReportHeader, {
    ReportHeader as UnconnectedReportHeader,
    __RewireAPI__ as ReportHeaderRewireAPI
}  from '../../src/components/report/reportHeader';

import FacetSelections  from '../../src/components/facet/facetSelections';
import {CONTEXT} from '../../src/actions/context';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {Provider} from "react-redux";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

import * as types from '../../src/actions/types';

describe('ReportHeader', () => {
    'use strict';

    let component;
    let selections = new FacetSelections();
    selections.addSelection(1, 'Development');
    const reportData = {
        id: CONTEXT.REPORT.NAV,
        data: {
            facets: [{
                id: 1, name: 'test', type: "TEXT",
                values: [{value: "a"}, {value: "b"}, {value: "c"}]
            }],
            selections: selections
        }
    };

    const props = {
        appId: '1',
        tblId: '2',
        rptId: '3',
        nameForRecords: "Records",
    };

    const HeaderMock = React.createClass({
        render() {
            return <div className="header-mock" />;
        }
    });

    beforeAll(() => {
        jasmineEnzyme();
        ReportHeaderRewireAPI.__Rewire__('Header', HeaderMock);
    });

    afterAll(() => {
        ReportHeaderRewireAPI.__ResetDependency__('Header');
    });

    it('renders component', () => {
        const store = mockStore({});

        component = mount(
            <Provider store={store}>
                <ReportHeader report={[reportData]} {...props} />
            </Provider>);
        expect(component).toBePresent();
    });

    describe('Search Input', () => {
        let searchInput = null;
        let clearSearchInput = null;
        let obj = {};
        let loadDynamicReportSpy = null;
        beforeEach(() => {
            searchInput = jasmine.createSpy('searchInput');
            clearSearchInput = jasmine.createSpy('clearSearchInput');
            obj = {
                loadDynamicReport: null
            };
            component = shallow(
                <UnconnectedReportHeader
                    className="report-header"
                    searchInput={searchInput}
                    clearSearchInput={clearSearchInput}
                    report={[reportData]}
                    {...props} />
            );
        });

        it('loads a new report with a debounce when user runs a text search', (done) => {
            new Promise(resolve => {
                // loadDynamicReport is called with a debounce, resolve when it's called
                spyOn(obj, 'loadDynamicReport').and.callFake(() => {
                    resolve();
                });
                // pass in the spy loadDynamicReport as a prop
                component.setProps({loadDynamicReport: obj.loadDynamicReport});

                component.instance().handleSearchChange({target: {value: 'I love intermittent failures!'}});
                expect(searchInput).toHaveBeenCalledWith('I love intermittent failures!');
                expect(obj.loadDynamicReport).not.toHaveBeenCalled();
            }).then(() => {
                expect(obj.loadDynamicReport).toHaveBeenCalledWith(
                    CONTEXT.REPORT.NAV,
                    '1',
                    '2',
                    '3',
                    true,
                    jasmine.any(Object),
                    jasmine.any(Object)
                );
                done();
            });
        });

        it('loads a new report with an empty search string when user clears search input', (done) => {
            new Promise(resolve => {
                // loadDynamicReport is called with a debounce, resolve when it's called
                spyOn(obj, 'loadDynamicReport').and.callFake(() => {
                    resolve();
                });
                // pass in the spy loadDynamicReport as a prop
                component.setProps({loadDynamicReport: obj.loadDynamicReport});

                component.instance().clearSearchString();
                expect(clearSearchInput).toHaveBeenCalled();
                expect(obj.loadDynamicReport).not.toHaveBeenCalled();
            }).then(() => {
                expect(obj.loadDynamicReport).toHaveBeenCalledWith(
                    CONTEXT.REPORT.NAV,
                    '1',
                    '2',
                    '3',
                    true,
                    jasmine.any(Object),
                    jasmine.any(Object)
                );
                done();
            });
        });
    });
});
