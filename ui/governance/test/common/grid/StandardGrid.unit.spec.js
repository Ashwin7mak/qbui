import React from "react";
import {shallow} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import {StandardGrid, __RewireAPI__ as StandardGridRewireAPI} from "../../../src/common/grid/standardGrid";
import {QbCell} from '../../../../client-react/src/components/dataTable/qbGrid/qbCell';
import * as AccountUsersActions from "../../../src/account/users/AccountUsersActions";
import * as FieldConsts from "../../../../client-react/src/constants/schema";
import StandardGridToolBar from "../../../src/common/grid/toolbar/StandardGridToolbar";
import WindowPerformanceUtils from "../../../../reuse/client/src/utils/windowPerformanceUtils";
import QbLoader from "../../../../reuse/client/src/components/loader/QbLoader";

let columns = [{
    property: 'firstName',
    header: {
        label: 'First Name'
    },
    fieldDef: {
        id: 1,
        datatypeAttributes: {
            type: FieldConsts.TEXT
        }
    }
}];

let component, instance;

describe('StandardGrid', () => {

    beforeEach(() => {
        jasmineEnzyme();
    });

    it('should render the grid', () => {

        let items = [{
            hasAppAccess: false,
            id: 99999,
            uid: 11111
        }];

        component = shallow(
            <StandardGrid
                columns={columns}
                getFacetFields={()=>{}}
                doUpdate={AccountUsersActions.doUpdateUsers}
                items={items}
                id={"accountUsers"}
                rowKey={"uid"}
                cellRenderer={QbCell}
            />
        );

        let StandardGridToolbarComponent = component.find(StandardGridToolBar);
        expect(StandardGridToolbarComponent).toBeDefined();
        expect(StandardGridToolbarComponent.props().id).toEqual("accountUsers");
        expect(StandardGridToolbarComponent.props().doUpdate).toEqual(AccountUsersActions.doUpdateUsers);

        expect(component.find('.qbGrid')).toBePresent();
        expect(component.find('.noItemsExist')).not.toBePresent();
    });

    it('should not render the grid header when items are being fetched', () => {

        component = shallow(
            <StandardGrid
                columns={columns}
                getFacetFields={()=>{}}
                doUpdate={AccountUsersActions.doUpdate}
                items={null}
                id={"accountUsers"}
                rowKey={"uid"}
                cellRenderer={QbCell}
            />
        );

        expect(component.find('.qbHeaderCell')).not.toBePresent();

    });

    it('should render the loader when items are null', () => {

        component = shallow(
            <StandardGrid
                columns={columns}
                getFacetFields={()=>{}}
                doUpdate={AccountUsersActions.doUpdate}
                items={null}
                id={"accountUsers"}
                rowKey={"uid"}
                cellRenderer={QbCell}
            />
        );

        expect(component.find(QbLoader)).toBePresent();
    });

    it('should not render the loader when items are empty', () => {

        component = shallow(
            <StandardGrid
                columns={columns}
                getFacetFields={()=>{}}
                doUpdate={AccountUsersActions.doUpdate}
                items={[]}
                id={"accountUsers"}
                rowKey={"uid"}
                cellRenderer={QbCell}
            />
        );

        expect(component.find(QbLoader)).not.toBePresent();
    });

    it('should not render the loader when items are present', () => {

        let items = [{
            hasAppAccess: false,
            id: 99999,
            uid: 11111
        }];

        component = shallow(
            <StandardGrid
                columns={columns}
                getFacetFields={()=>{}}
                doUpdate={AccountUsersActions.doUpdate}
                items={items}
                id={"accountUsers"}
                rowKey={"uid"}
                cellRenderer={QbCell}
            />
        );

        expect(component.find(QbLoader)).not.toBePresent();
    });

    it('should not render the grid when no items exist', () => {

        let items = [];

        component = shallow(
            <StandardGrid
                columns={columns}
                getFacetFields={()=>{}}
                doUpdate={AccountUsersActions.doUpdateUsers}
                items={items}
                id={"accountUsers"}
                rowKey={"uid"}
                cellRenderer={QbCell}
            />
        );

        let StandardGridToolbarComponent = component.find(StandardGridToolBar);
        expect(StandardGridToolbarComponent).toBeDefined();

        expect(component.find('.noItemsExist')).toBePresent();
        expect(component.find('.qbGrid')).not.toBePresent();
    });

    describe('Performance Timing', () => {
        let items = [];

        it('should create a time mark in WindowPerformanceUtils for grid updating', () => {
            component = shallow(
                <StandardGrid
                    columns={columns}
                    getFacetFields={() => {
                    }}
                    doUpdate={AccountUsersActions.doUpdateUsers}
                    items={items}
                    id={"accountUsers"}
                    rowKey={"uid"}
                    cellRenderer={QbCell}
                />);

            spyOn(WindowPerformanceUtils, 'markTime');
            component.setProps({items: ['test']});

            expect(WindowPerformanceUtils.markTime).toHaveBeenCalledWith('accountUsersGridRefreshStart');
        });

        describe('calculateGridRefreshTime', () => {

            beforeEach(() => {
                component = shallow(
                    <StandardGrid
                        columns={columns}
                        getFacetFields={() => {
                        }}
                        doUpdate={AccountUsersActions.doUpdateUsers}
                        items={[]}
                        id={"accountUsers"}
                        rowKey={"uid"}
                        cellRenderer={QbCell}
                    />);
            });

            afterEach(() => {
                StandardGridRewireAPI.__ResetDependency__('WindowPerformanceUtils');
            });

            it('should return null if the window performance mark function does not exist', () => {
                StandardGridRewireAPI.__Rewire__('WindowPerformanceUtils', {
                    ...WindowPerformanceUtils,
                    markTime(name) {
                        return false;
                    },
                    measureTimeDiff(name, start, end) {
                    },
                    getEntriesByName(name) {
                        return [{duration: 20}];
                    }
                });

                instance = component.instance();

                expect(instance.calculateGridRefreshTime()).toBeNull();
            });

            it('should return null if the window performance mark function exists, but measure entries DO NOT exist', () => {
                StandardGridRewireAPI.__Rewire__('WindowPerformanceUtils', {
                    ...WindowPerformanceUtils,
                    markTime(name) {
                        return true;
                    },
                    measureTimeDiff(name, start, end) {
                    },
                    getEntriesByName(name) {
                        return [];
                    }
                });

                instance = component.instance();

                expect(instance.calculateGridRefreshTime()).toBeNull();
            });

            it('should return a time if the window performance mark function exists, and measure entries exist', () => {
                StandardGridRewireAPI.__Rewire__('WindowPerformanceUtils', {
                    ...WindowPerformanceUtils,
                    markTime(name) {
                        return true;
                    },
                    measureTimeDiff(name, start, end) {
                    },
                    getEntriesByName(name) {
                        return [{duration: 20}];
                    }
                });

                instance = component.instance();

                expect(instance.calculateGridRefreshTime()).toEqual(20);
            });
        });

        describe('pageLoadTime and gridRefreshTime calls', () => {
            let pageLoadTime,
                gridRefreshTime,
                itemsNew,
                createShallowStandardGrid;

            beforeEach(() => {
                let gridId = 'accountUsers';
                pageLoadTime = jasmine.createSpy('pageLoadTime');
                gridRefreshTime = jasmine.createSpy('gridRefreshTime');

                /**
                 * Returns a new StandardGrid shallow component using the given items for the items prop
                 * @param newItems - Array of 'items' (rows)
                 * @returns {*} a new StandardGrid component
                 */
                createShallowStandardGrid = (newItems) => {
                    return shallow(
                        <StandardGrid
                            columns={columns}
                            getFacetFields={() => {
                            }}
                            doUpdate={AccountUsersActions.doUpdateUsers}
                            items={newItems}
                            id={gridId}
                            rowKey={"uid"}
                            cellRenderer={QbCell}
                            pageLoadTime={pageLoadTime}
                            gridRefreshTime={gridRefreshTime}
                        />);
                };
            });

            it('should call pageLoadTime or gridRefreshTime if there are items', () => {
                itemsNew = [{
                    hasAppAccess: false,
                    id: 99999,
                    uid: 11111
                }];
                component = createShallowStandardGrid(itemsNew);
                instance = component.instance();
                spyOn(instance, 'calculateGridRefreshTime').and.returnValue(10);
                instance.componentDidUpdate();

                expect(pageLoadTime).toHaveBeenCalled();
                expect(gridRefreshTime).toHaveBeenCalled();
            });

            it('should call pageLoadTime or gridRefreshTime even if items is empty', () => {
                itemsNew = [];
                component = createShallowStandardGrid(itemsNew);
                instance = component.instance();
                spyOn(instance, 'calculateGridRefreshTime').and.returnValue(10);

                instance.componentDidUpdate();

                expect(pageLoadTime).toHaveBeenCalled();
                expect(gridRefreshTime).toHaveBeenCalled();
            });

            it('should not call pageLoadTime or gridRefreshTime if items is null', () => {
                itemsNew = null;
                component = createShallowStandardGrid(itemsNew);
                instance = component.instance();
                spyOn(instance, 'calculateGridRefreshTime').and.returnValue(10);

                instance.componentDidUpdate();

                expect(pageLoadTime).not.toHaveBeenCalled();
                expect(gridRefreshTime).not.toHaveBeenCalled();
            });
        });
    });
});
