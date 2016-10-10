import React from 'react';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import SortAndGroup  from '../../src/components/sortGroup/sortAndGroup';
import WindowLocationUtils from '../../src/utils/windowLocationUtils';
import MockData from '../../src/mocks/sortGroup';
import constants from '../../../common/src/constants';
import {GROUP_TYPE} from '../../../common/src/groupTypes';

import TestUtils from 'react-addons-test-utils';

let SortAndGroupDialogMock = React.createClass({
    render: function() {
        return (
            <div>SortAndGroupDialogMock</div>
        );
    }
});

describe('SortAndGroup functions', () => {
    'use strict';

    var component;
    let flux = {
        actions: {
            getFilteredRecords() {
                return;
            },
            loadReport() {
                return;
            }
        }
    };

    let fieldsArray = [
        {
            appearsByDefault: false,
            builtIn: true,
            dataIsCopyable: true,
            datatypeAttributes: {
                clientSideAttributes: {},
            },
            defaultValue: {},
            id: 3,
            includeInQuickSearch: true,
            multiChoiceSourceAllowed: false,
            name: "Example",
            required: true,
            tableId: "0mrfhdaaaaad",
            type: "SCALAR",
            userEditableValue: false
        },
        {
            appearsByDefault: false,
            builtIn: true,
            dataIsCopyable: true,
            datatypeAttributes: {
                clientSideAttributes: {},
            },
            defaultValue: {},
            id: 4,
            includeInQuickSearch: true,
            multiChoiceSourceAllowed: false,
            name: "Text",
            required: true,
            tableId: "0mrfhdaaaaad",
            type: "SCALAR",
            userEditableValue: false
        },
        {
            appearsByDefault: false,
            builtIn: true,
            dataIsCopyable: true,
            datatypeAttributes: {
                clientSideAttributes: {},
            },
            defaultValue: {},
            id: 5,
            includeInQuickSearch: true,
            multiChoiceSourceAllowed: false,
            name: "Task",
            required: true,
            tableId: "0mrfhdaaaaad",
            type: "SCALAR",
            userEditableValue: false
        },
        {
            appearsByDefault: false,
            builtIn: true,
            dataIsCopyable: true,
            datatypeAttributes: {
                clientSideAttributes: {},
            },
            defaultValue: {},
            id: 12,
            includeInQuickSearch: true,
            multiChoiceSourceAllowed: false,
            name: "project",
            required: true,
            tableId: "0mrfhdaaaaad",
            type: "SCALAR",
            userEditableValue: false
        }
    ];

    let fieldsData = {
        fields: {
            data: fieldsArray
        }
    };

    let aField = {
        name: 'project',
        id: 12
    };

    let reportData = {
        data: {
            originalMetaData: {
                sortList: [{fieldId: 5, sortOrder: constants.SORT_ORDER.ASC, groupType: null},
                    {fieldId: 4, sortOrder: constants.SORT_ORDER.ASC, groupType: null},
                    {fieldId: 3, sortOrder: constants.SORT_ORDER.ASC, groupType: GROUP_TYPE.COMMON.equals}],
                pageOffset: 0,
                numRows: 20
            },
        }
    };

    let reportDataWithEdits = {
        data: {
            originalMetaData: {
                sortList: [{fieldId: 5, sortOrder: constants.SORT_ORDER.ASC, groupType: null},
                    {fieldId: 4, sortOrder: constants.SORT_ORDER.ASC, groupType: null},
                    {fieldId: 3, sortOrder: constants.SORT_ORDER.ASC, groupType: GROUP_TYPE.COMMON.equals}]
            },
            sortList: [{fieldId: 5, sortOrder: constants.SORT_ORDER.DESC, groupType: null}],
            groupEls: [{fieldId: 6, sortOrder: constants.SORT_ORDER.ASC, groupType: GROUP_TYPE.COMMON.equals}, {fieldId: 4, sortOrder: constants.SORT_ORDER.DESC, groupType: GROUP_TYPE.COMMON.equals}]
        }
    };



    let reportDataEmpty = {
        data: {
            originalMetaData: {
                sortList: []
            },
        }
    };

    beforeEach(() => {
        SortAndGroup.__Rewire__('SortAndGroupDialog', SortAndGroupDialogMock);
    });

    afterEach(() => {
        SortAndGroup.__ResetDependency__('SortAndGroupDialog');
    });

    it('test render of not visible SortAndGroup', () => {
        component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux} show={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of visible SortAndGroup', () => {
        component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        component.setState({show: true});
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

    });

    it('test click sortButtonSpan button', () => {
        component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}/>);
        let sortButtonSpan = TestUtils.scryRenderedDOMComponentsWithClass(component, "sortButtonSpan");
        expect(sortButtonSpan.length).toEqual(1);
        TestUtils.Simulate.click(sortButtonSpan[0]);
        expect(component.state.show).toBeTruthy();
        TestUtils.Simulate.click(sortButtonSpan[0]);
        expect(component.state.show).toBeFalsy();
    });

    describe('test state change methods', () => {

        it('test initialState ', () => {
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}/>);
            let initState = component.initialState();
            expect(initState.dirty).toBeFalsy();
            expect(initState.show).toBeFalsy();
            expect(initState.showFields).toBeFalsy();
            expect(initState.showNotVisible).toBeFalsy();
            expect(initState.newSelectionsGroup.length).toBe(0);
            expect(initState.newSelectionsSort.length).toBe(0);
        });

        it('test showMoreFields ', () => {
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}/>);
            component.showMoreFields();
            expect(component.state.showNotVisible).toBeTruthy();
        });

        it('test hideMoreFields ', () => {
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}/>);
            component.hideMoreFields();
            expect(component.state.showNotVisible).toBeFalsy();
        });

        it('test toggleShow ', () => {
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}/>);
            component.toggleShow();
            expect(component.state.show).toBeTruthy();
            component.toggleShow();
            expect(component.state.show).toBeFalsy();
        });

        it('test toggleShowFields ', () => {
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}/>);
            component.toggleShowFields();
            expect(component.state.showFields).toBeTruthy();
            component.toggleShowFields();
            expect(component.state.showFields).toBeFalsy();
        });
    });

    describe('test apply and reset methods', () => {

        it('test applyAndHide not dirty ', () => {
            spyOn(flux.actions, 'getFilteredRecords');
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}/>);
            component.show();
            expect(component.state.dirty).toBeFalsy();
            component.applyAndHide();
            expect(flux.actions.getFilteredRecords).not.toHaveBeenCalled();
            flux.actions.getFilteredRecords.calls.reset();
            expect(component.state.show).toBeFalsy();
        });

        it('test applyAndHide dirty with order', () => {
            spyOn(flux.actions, 'loadReport');
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux} fields={fieldsData}/>);
            component.show();
            expect(component.state.dirty).toBeFalsy();
            component.handleSetOrder('sort', 1, true, aField);
            expect(component.state.dirty).toBeTruthy();
            component.applyAndHide();
            expect(flux.actions.loadReport).toHaveBeenCalled();
            flux.actions.loadReport.calls.reset();
            expect(component.state.show).toBeFalsy();
        });


        it('test applyAndHide dirty with adds', () => {
            spyOn(flux.actions, 'loadReport');
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux} fields={fieldsData}
                                                                   reportData={reportData}/>);
            component.show();
            expect(component.state.dirty).toBeFalsy();
            component.handleAddField('sort', aField);
            expect(component.state.dirty).toBeTruthy();
            let otherField = _.cloneDeep(aField);
            otherField.id = 15;
            component.handleAddField('group', otherField);
            expect(component.state.dirty).toBeTruthy();
            component.applyAndHide();
            expect(flux.actions.loadReport).toHaveBeenCalled();
            flux.actions.loadReport.calls.reset();
            expect(component.state.show).toBeFalsy();
        });


        it('test applyAndHide dirty with removes', () => {
            spyOn(flux.actions, 'loadReport');
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux} fields={fieldsData}
                                                                   reportData={_.cloneDeep(reportData)}/>);
            component.show();
            expect(component.state.dirty).toBeFalsy();
            component.handleRemoveField('sort', 1);
            expect(component.state.dirty).toBeTruthy();
            component.handleRemoveField('group', 1);
            expect(component.state.dirty).toBeTruthy();
            component.applyAndHide();
            expect(flux.actions.loadReport).toHaveBeenCalled();
            flux.actions.loadReport.calls.reset();
            expect(component.state.show).toBeFalsy();
        });

        it('test resetAndHide no original', () => {
            spyOn(flux.actions, 'getFilteredRecords');
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux} fields={fieldsData}/>);
            component.show();
            component.resetAndHide();
            expect(flux.actions.getFilteredRecords).not.toHaveBeenCalled();
            flux.actions.getFilteredRecords.calls.reset();
            expect(component.state.show).toBeFalsy();
        });

        it('test resetAndHide has original', () => {
            spyOn(flux.actions, 'loadReport');
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}
                                                                   fields={fieldsData}
                                                                   reportData={reportData}/>);
            component.show();
            component.resetAndHide();
            expect(flux.actions.loadReport).toHaveBeenCalled();
            flux.actions.loadReport.calls.reset();
            expect(component.state.show).toBeFalsy();
        });
    });

    describe('test modify sort group methods on original report settings', () => {

        it('test getSortState clean original', () => {
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}
                                                                   fields={fieldsData}
                                                                   reportData={reportData}/>);
            component.show();
            let sortState = component.getSortState();

            expect(sortState).toBeTruthy();
            expect(sortState.length).toBe(2);
            expect(sortState[0].id).toBe(5);
            expect(sortState[1].id).toBe(4);
        });

        it('test getSortState add a sort', () => {
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}
                                                                   fields={fieldsData}
                                                                   reportData={reportDataEmpty}/>);

            component.show();
            component.handleAddField('sort', aField);
            let sortState = component.getSortState();
            expect(sortState).toBeTruthy();
            expect(sortState.length).toBe(1);
            expect(sortState[0].id).toBe(aField.id);
            expect(component.state.dirty).toBeTruthy();
            expect(reportDataEmpty.data.originalMetaData.sortList.length).toBe(0);
            let groupState = component.getGroupState();
            expect(groupState.length).toBe(0);

        });

        it('test getGroupState add a groupBy', () => {
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}
                                                                   fields={fieldsData}
                                                                   reportData={reportDataEmpty}/>);

            component.show();
            component.handleAddField('group', aField);
            let groupState = component.getGroupState();
            expect(groupState).toBeTruthy();
            expect(groupState.length).toBe(1);
            expect(groupState[0].id).toBe(aField.id);
            expect(groupState[0].howToGroup).toBe(GROUP_TYPE.COMMON.equals);
            expect(component.state.dirty).toBeTruthy();
            expect(reportDataEmpty.data.originalMetaData.sortList.length).toBe(0);
            let sortState = component.getSortState();
            expect(sortState.length).toBe(0);
        });

        it('test getGroupState delete a sort', () => {
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}
                                                                   fields={fieldsData}
                                                                   reportData={_.cloneDeep(reportData)}/>);

            component.show();
            let startSortState = component.getSortState();
            expect(startSortState).toBeTruthy();
            component.handleRemoveField('sort', 1);
            let sortState = component.getSortState();
            expect(sortState).toBeTruthy();
            expect(sortState.length).toBe(1);
            expect(component.state.dirty).toBeTruthy();
            let groupState = component.getGroupState();
            expect(groupState.length).toBe(1);
        });

        it('test getGroupState delete a groupBy', () => {
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}
                                                                   fields={fieldsData}
                                                                   reportData={_.cloneDeep(reportData)}/>);

            component.show();
            let startGroupState = component.getGroupState();
            expect(startGroupState).toBeTruthy();
            component.handleRemoveField('group', 1);
            let groupState = component.getGroupState();
            expect(groupState).toBeTruthy();
            expect(groupState.length).toBe(1);
            expect(component.state.dirty).toBeTruthy();
            let sortState = component.getSortState();
            expect(sortState.length).toBe(2);
        });
    });

    describe('test modify sort group methods on different report settings', () => {

        it('test getSortState clean original', () => {
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}
                                                                   fields={fieldsData}
                                                                   reportData={reportDataWithEdits}/>);
            component.show();
            let sortState = component.getSortState();

            expect(sortState).toBeTruthy();
            expect(sortState.length).toBe(2);
            expect(sortState[0].id).toBe(5);
            expect(sortState[1].id).toBe(4);
        });

        it('test getSortState add a sort', () => {
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}
                                                                   fields={fieldsData}
                                                                   reportData={reportDataWithEdits}/>);

            component.show();
            component.handleAddField('sort', aField);
            let sortState = component.getSortState();
            expect(sortState).toBeTruthy();
            expect(sortState.length).toBe(3);
            expect(sortState[2].id).toBe(aField.id);
            expect(component.state.dirty).toBeTruthy();
            expect(reportDataEmpty.data.originalMetaData.sortList.length).toBe(0);
            let groupState = component.getGroupState();
            expect(groupState.length).toBe(1);

        });

        it('test getGroupState add a groupBy', () => {
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}
                                                                   fields={fieldsData}
                                                                   reportData={reportDataWithEdits}/>);

            component.show();
            component.handleAddField('group', aField);
            let groupState = component.getGroupState();
            expect(groupState).toBeTruthy();
            expect(groupState.length).toBe(2);
            expect(groupState[1].id).toBe(aField.id);
            expect(groupState[0].howToGroup).toBe(GROUP_TYPE.COMMON.equals);
            expect(component.state.dirty).toBeTruthy();
            expect(reportDataEmpty.data.originalMetaData.sortList.length).toBe(0);
            let sortState = component.getSortState();
            expect(sortState.length).toBe(2);
        });

        it('test getGroupState delete a sort', () => {
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}
                                                                   fields={fieldsData}
                                                                   reportData={_.cloneDeep(reportDataWithEdits)}/>);

            component.show();
            component.handleRemoveField('sort', 1);
            let sortState = component.getSortState();
            expect(sortState).toBeTruthy();
            expect(sortState.length).toBe(1);
            expect(component.state.dirty).toBeTruthy();
            let groupState = component.getGroupState();
            expect(groupState.length).toBe(1);
        });

        it('test getGroupState delete a groupBy', () => {
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}
                                                                   fields={fieldsData}
                                                                   reportData={_.cloneDeep(reportDataWithEdits)}/>);

            component.show();
            component.handleRemoveField('group', 1);
            let groupState = component.getGroupState();
            expect(groupState).toBeTruthy();
            expect(groupState.length).toBe(1);
            expect(component.state.dirty).toBeTruthy();
            let sortState = component.getSortState();
            expect(sortState.length).toBe(2);
        });
    });

    describe('test misc utils ', () => {
        it('test handleClickOutside with edits', () => {
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}
                                                                   fields={fieldsData}
                                                                   reportData={reportData}/>);

            spyOn(flux.actions, 'loadReport');
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux} fields={fieldsData}/>);
            component.show();
            expect(component.state.dirty).toBeFalsy();
            component.handleSetOrder('sort', 1, true, aField);
            expect(component.state.dirty).toBeTruthy();
            component.handleSetOrder('group', 0, false, aField);
            component.handleClickOutside();
            expect(flux.actions.loadReport).toHaveBeenCalled();
            flux.actions.loadReport.calls.reset();
            expect(component.state.show).toBeFalsy();
        });

        it('test handleClickOutside without edits', () => {
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}
                                                                   fields={fieldsData}
                                                                   reportData={reportData}/>);

            spyOn(flux.actions, 'getFilteredRecords');
            component.show();
            expect(component.state.dirty).toBeFalsy();
            component.handleClickOutside();
            expect(flux.actions.getFilteredRecords).not.toHaveBeenCalled();
            flux.actions.getFilteredRecords.calls.reset();
            expect(component.state.show).toBeFalsy();
        });

        it('test getStateFromFlux ', () => {
            component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}
                                                                   fields={fieldsData}
                                                                   reportData={reportData}/>);

            let state = component.getStateFromFlux();
            expect(state.show).toBeFalsy();
        });

        describe('MockData via url ', () => {
            class mockMethod {
                static searchIncludes(findThis) {
                    return true;
                }
            }

            it('test mockData ', () => {
                SortAndGroup.__Rewire__('WindowLocationUtils', mockMethod);

                component = TestUtils.renderIntoDocument(<SortAndGroup flux={flux}
                                                                       fields={fieldsData}
                                                                       reportData={reportData}/>);

                let grp = component.getGroupFields(null);
                expect(grp).toBe(MockData.GROUP);
                let srt = component.getSortFields(null);
                expect(srt).toBe(MockData.SORT);
                SortAndGroup.__ResetDependency__('WindowLocationUtils');

            });
        });

    });

});

