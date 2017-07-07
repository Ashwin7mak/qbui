import React from "react";
import {shallow} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import {StandardGrid} from "../../../src/common/grid/standardGrid";
import {QbCell} from '../../../../client-react/src/components/dataTable/qbGrid/qbCell';
import * as AccountUsersActions from "../../../src/account/users/AccountUsersActions";
import * as FieldConsts from "../../../../client-react/src/constants/schema";
import StandardGridToolBar from "../../../src/common/grid/toolbar/StandardGridToolbar";

describe('StandardGrid', () => {

    beforeEach(() => {
        jasmineEnzyme();
    });

    it('should render the grid', () => {
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

        let items = [{
            hasAppAccess: false,
            id: 99999,
            uid: 11111
        }];

        let StandardGridShallow = shallow(
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
        expect(StandardGridShallow).toBeDefined();
        expect(StandardGridShallow.length).toBeTruthy();

        let StandardGridToolbarComponent = StandardGridShallow.find(StandardGridToolBar);
        expect(StandardGridToolbarComponent).toBeDefined();
        expect(StandardGridToolbarComponent.props().id).toEqual("accountUsers");
        expect(StandardGridToolbarComponent.props().doUpdate).toEqual(AccountUsersActions.doUpdateUsers);

        expect(StandardGridShallow.find('.qbGrid')).toBePresent();
        expect(StandardGridShallow.find('.noItemsExist')).not.toBePresent();
    });

    it('should not render the grid header when items are being fetched', () => {
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

        let StandardGridShallow = shallow(
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
        expect(StandardGridShallow).toBeDefined();
        expect(StandardGridShallow.length).toBeTruthy();

        let StandardGridToolbarComponent = StandardGridShallow.find(StandardGridToolBar);
        expect(StandardGridToolbarComponent).toBeDefined();
        expect(StandardGridToolbarComponent.props().id).toEqual("accountUsers");
        expect(StandardGridToolbarComponent.props().doUpdate).toEqual(AccountUsersActions.doUpdate);

    });

    it('should render the grid header when items are done fetching', () => {
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

        let StandardGridShallow = shallow(
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
        expect(StandardGridShallow).toBeDefined();
        expect(StandardGridShallow.length).toBeTruthy();
        expect(StandardGridShallow.find('.noItemsExist')).toBePresent();

        let StandardGridToolbarComponent = StandardGridShallow.find(StandardGridToolBar);
        expect(StandardGridToolbarComponent).toBeDefined();
        expect(StandardGridToolbarComponent.props().id).toEqual("accountUsers");
        expect(StandardGridToolbarComponent.props().doUpdate).toEqual(AccountUsersActions.doUpdate);

    });

    it('should not render the grid when no items exist', () => {
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

        let items = [];

        let StandardGridShallow = shallow(
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
        expect(StandardGridShallow).toBeDefined();
        expect(StandardGridShallow.length).toBeTruthy();

        let StandardGridToolbarComponent = StandardGridShallow.find(StandardGridToolBar);
        expect(StandardGridToolbarComponent).toBeDefined();

        expect(StandardGridShallow.find('.noItemsExist')).toBePresent();
        expect(StandardGridShallow.find('.qbGrid')).not.toBePresent();
    });

    describe('grid performance timing', () => {
        let items = [];
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

        it('should create a time mark in window.performance.mark for grid updating', () => {
            let StandardGridShallow = shallow(
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

            let oldMark = window.performance.mark;
            window.performance.mark = () => {
            };

            spyOn(window.performance, 'mark');

            StandardGridShallow.setProps({items: ['test']});
            expect(window.performance.mark).toHaveBeenCalledWith('accountUsersGridRefreshStart');

            window.performance.mark = oldMark;
        });

        describe('calculateGridRefreshTime', () => {
            let StandardGridShallow,
                instance,
                oldMark,
                oldMeasure,
                oldGetEntriesByName;

            beforeEach(() => {
                oldMark = window.performance.mark;
                oldMeasure = window.performance.measure;
                // oldGetEntriesByName = window.performance.getEntriesByName;
                // spyOn(window.performance, 'getEntriesByName').and.returnValue({duration: 10});

                StandardGridShallow = shallow(
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
                window.performance.mark = oldMark;
                window.performance.measure = oldMeasure;
            });

            fit('should return null if the window.performance.mark function does not exist', () => {
                window.performance.mark = null;
                instance = StandardGridShallow.instance();

                expect(instance.calculateGridRefreshTime()).toBeNull();
            });

            fit('should return null if the window.performance.mark function exists, but measure entries DO NOT exist', () => {
                window.performance.mark = () => {};
                window.performance.measure = () => {};
                spyOn(window.performance, 'getEntriesByName').and.returnValue([]);
                instance = StandardGridShallow.instance();

                expect(instance.calculateGridRefreshTime()).toBeNull();
            });

            fit('should return a time if the window.performance.mark function exists, and measure entries exist', () => {
                window.performance.mark = () => {};
                window.performance.measure = () => {};
                spyOn(window.performance, 'getEntriesByName').and.returnValue([{duration: 10}]);
                instance = StandardGridShallow.instance();

                expect(instance.calculateGridRefreshTime()).toEqual(10);
            });
        });

        describe('pageLoadTime and gridRefreshTime calls', () => {
            let pageLoadTime,
                gridRefreshTime,
                itemsNew,
                StandardGridShallow,
                instance,
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
                StandardGridShallow = createShallowStandardGrid(itemsNew);
                instance = StandardGridShallow.instance();
                spyOn(instance, 'calculateGridRefreshTime').and.returnValue(10);
                instance.componentDidUpdate();

                expect(pageLoadTime).toHaveBeenCalled();
                expect(gridRefreshTime).toHaveBeenCalled();
            });

            it('should call pageLoadTime or gridRefreshTime even if items is empty', () => {
                itemsNew = [];
                StandardGridShallow = createShallowStandardGrid(itemsNew);
                instance = StandardGridShallow.instance();
                spyOn(instance, 'calculateGridRefreshTime').and.returnValue(10);

                instance.componentDidUpdate();

                expect(pageLoadTime).toHaveBeenCalled();
                expect(gridRefreshTime).toHaveBeenCalled();
            });

            it('should not call pageLoadTime or gridRefreshTime if items is null', () => {
                itemsNew = null;
                StandardGridShallow = createShallowStandardGrid(itemsNew);
                instance = StandardGridShallow.instance();
                spyOn(instance, 'calculateGridRefreshTime').and.returnValue(10);

                instance.componentDidUpdate();

                expect(pageLoadTime).not.toHaveBeenCalled();
                expect(gridRefreshTime).not.toHaveBeenCalled();
            });
        });
    });
});


