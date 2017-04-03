import React from 'react';
import _ from 'lodash';
import  {
      SortAndGroup as UnConnectedSortAndGroup,
    __RewireAPI__ as SortAndGroupRewireAPI}  from '../../src/components/sortGroup/sortAndGroup';
import WindowLocationUtils from '../../src/utils/windowLocationUtils';
import MockData from '../../src/mocks/sortGroup';
import constants from '../../../common/src/constants';
import {GROUP_TYPE} from '../../../common/src/groupTypes';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

const SortAndGroupDialogMock = React.createClass({
    render: function() {
        return (
            <div>SortAndGroupDialogMock</div>
        );
    }
});

describe('SortAndGroup functions', () => {
    'use strict';

    let component;
    let instance;


    const fields = {
        fields: {
            data: [
                {
                    appId: '1',
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
                    tblId: "0",
                    type: "SCALAR",
                    userEditableValue: false
                },
                {
                    appId: '1',
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
                    tblId: "1",
                    type: "SCALAR",
                    userEditableValue: false
                },
                {
                    appId: '1',
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
                    tblId: "2",
                    type: "SCALAR",
                    userEditableValue: false
                },
                {
                    appId: '1',
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
                    tblId: "3",
                    type: "SCALAR",
                    userEditableValue: false
                }

            ]
        }
    };
    const fieldsArray = [
        {
            appId: '1',
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
            tblId: "0",
            type: "SCALAR",
            userEditableValue: false,
            fields : fields
        },
        {
            appId: '1',
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
            tblId: "1",
            type: "SCALAR",
            userEditableValue: false,
            fields : fields
        },
        {
            appId: '1',
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
            tblId: "2",
            type: "SCALAR",
            userEditableValue: false,
            fields : fields
        },
        {
            appId: '1',
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
            tblId: "3",
            type: "SCALAR",
            userEditableValue: false,
            fields : fields
        }
    ];

    const fieldsData = {
        fields: {
            data: fieldsArray
        }
    };

    const aField = {
        name: 'project',
        id: 12
    };

    const reportData = {
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

    const reportDataWithEdits = {
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



    const reportDataEmpty = {
        data: {
            originalMetaData: {
                sortList: []
            },
        }
    };

    const props = {
        appId: '1',
        tblId: '2',
        rptId: '3',
        reportData: reportData,
        filter: {},
        fields: fieldsArray,
        onMenuEnter: () => {},
        onMenuExit: () => {}
    };

    beforeEach(() => {
        jasmineEnzyme();
        SortAndGroupRewireAPI.__Rewire__('SortAndGroupDialog', SortAndGroupDialogMock);
    });

    afterEach(() => {
        SortAndGroupRewireAPI.__ResetDependency__('SortAndGroupDialog');
    });

    it('test render of not visible SortAndGroup', () => {
        component = shallow(
                <UnConnectedSortAndGroup {...props} show={false}/>
        );
        expect(component).toBePresent();
    });

    it('test render of visible SortAndGroup', () => {
        component = shallow(
            <UnConnectedSortAndGroup {...props}/>
        );
        expect(component).toBePresent();

        component.setState({show: true});
        expect(component).toBePresent();
    });

    it('test get initial state', () => {
        component = shallow(
            <UnConnectedSortAndGroup {...props} />
        );
        instance = component.instance();
        const initialState = instance.getInitialState();
        expect(initialState.show).toBeFalsy();
    });

    it('test click sortButtonSpan button', () => {
        component = shallow(
            <UnConnectedSortAndGroup {...props} />
        );
        instance = component.instance();
        const sortButtonSpan = component.find(".sortButtonSpan");
        expect(sortButtonSpan).toBePresent();
        const sortAndGroupAction = component.find(".sortButtonSpan");
        sortAndGroupAction.simulate('click');
        expect(instance.state.show).toBeTruthy();
        sortAndGroupAction.simulate('click');
        expect(instance.state.show).toBeFalsy();
    });

    describe('test state change methods', () => {

        it('test initialState ', () => {
            component = shallow(
                    <UnConnectedSortAndGroup {...props} />
            );

            const initState = component.instance().initialState();
            expect(initState.dirty).toBeFalsy();
            expect(initState.show).toBeFalsy();
            expect(initState.showFields).toBeFalsy();
            expect(initState.showNotVisible).toBeFalsy();
            expect(initState.newSelectionsGroup.length).toBe(0);
            expect(initState.newSelectionsSort.length).toBe(0);
        });

        it('test showMoreFields ', () => {
            component = shallow(
                <UnConnectedSortAndGroup  {...props}/>
            );
            instance = component.instance();
            instance.showMoreFields();
            expect(instance.state.showNotVisible).toBeTruthy();
        });

        it('test hideMoreFields ', () => {
            component = shallow(
                <UnConnectedSortAndGroup  {...props}/>
            );
            instance = component.instance();
            instance.hideMoreFields();
            expect(instance.state.showNotVisible).toBeFalsy();
        });

        it('test toggleShow ', () => {
            component = shallow(
                <UnConnectedSortAndGroup  {...props}/>
            );
            instance = component.instance();
            instance.toggleShow();
            expect(instance.state.show).toBeTruthy();
            instance.toggleShow();
            expect(instance.state.show).toBeFalsy();
        });

        it('test toggleShowFields ', () => {
            component = shallow(
                <UnConnectedSortAndGroup  {...props}/>
            );
            instance = component.instance();
            instance.toggleShowFields();
            expect(instance.state.showFields).toBeTruthy();
            instance.toggleShowFields();
            expect(instance.state.showFields).toBeFalsy();
        });
    });

    describe('test apply and reset methods', () => {
        let obj = {};
        beforeEach(() => {
            obj = {
                loadDynamicReport: null
            };
        });
        it('test applyAndHide not dirty ', () => {
            spyOn(obj, 'loadDynamicReport');
            component = shallow(<UnConnectedSortAndGroup {...props}/>);
            instance = component.instance();
            component.setProps({loadDynamicReport: obj.loadDynamicReport});
            instance.show();
            expect(instance.state.dirty).toBeFalsy();
            instance.applyAndHide();
            expect(obj.loadDynamicReport).not.toHaveBeenCalled();
            obj.loadDynamicReport.calls.reset();
            expect(instance.state.show).toBeFalsy();
        });

        it('test applyAndHide dirty with order', () => {
            spyOn(obj, 'loadDynamicReport');
            component = shallow(<UnConnectedSortAndGroup {...props} fields={fieldsArray} />);
            instance = component.instance();
            component.setProps({loadDynamicReport: obj.loadDynamicReport});
            instance.show();
            expect(instance.state.dirty).toBeFalsy();
            instance.handleSetOrder('sort', 1, true, aField);
            expect(instance.state.dirty).toBeTruthy();
            instance.applyAndHide();
            expect(obj.loadDynamicReport).toHaveBeenCalled();
            obj.loadDynamicReport.calls.reset();
            expect(instance.state.show).toBeFalsy();
        });


        it('test applyAndHide dirty with adds', () => {
            spyOn(obj, 'loadDynamicReport');
            component = shallow(<UnConnectedSortAndGroup {...props} reportData={reportData} />);
            instance = component.instance();
            component.setProps({loadDynamicReport: obj.loadDynamicReport});
            instance.show();
            expect(instance.state.dirty).toBeFalsy();
            instance.handleAddField('sort', aField);
            expect(instance.state.dirty).toBeTruthy();
            let otherField = _.cloneDeep(aField);
            otherField.id = 15;
            instance.handleAddField('group', otherField);
            expect(instance.state.dirty).toBeTruthy();
            instance.applyAndHide();
            expect(obj.loadDynamicReport).toHaveBeenCalled();
            obj.loadDynamicReport.calls.reset();
            expect(instance.state.show).toBeFalsy();
        });


        it('test applyAndHide dirty with removes', () => {
            spyOn(obj, 'loadDynamicReport');
            component = shallow(<UnConnectedSortAndGroup {...props} reportData={_.cloneDeep(reportData)} />);
            instance = component.instance();
            component.setProps({loadDynamicReport: obj.loadDynamicReport});
            instance.show();
            expect(instance.state.dirty).toBeFalsy();
            instance.handleRemoveField('sort', 1);
            expect(instance.state.dirty).toBeTruthy();
            instance.handleRemoveField('group', 1);
            expect(instance.state.dirty).toBeTruthy();
            instance.applyAndHide();
            expect(obj.loadDynamicReport).toHaveBeenCalled();
            obj.loadDynamicReport.calls.reset();
            expect(instance.state.show).toBeFalsy();
        });

        it('test resetAndHide no original', () => {
            spyOn(obj, 'loadDynamicReport');
            component = shallow(<UnConnectedSortAndGroup fields={fieldsArray}/>);
            instance = component.instance();
            component.setProps({loadDynamicReport: obj.loadDynamicReport});
            instance.show();
            instance.resetAndHide();
            expect(obj.loadDynamicReport).not.toHaveBeenCalled();
            obj.loadDynamicReport.calls.reset();
            expect(instance.state.show).toBeFalsy();
        });

        it('test resetAndHide has original', () => {
            spyOn(obj, 'loadDynamicReport');
            component = shallow(<UnConnectedSortAndGroup {...props} reportData={reportData} />);
            instance = component.instance();
            component.setProps({loadDynamicReport: obj.loadDynamicReport});
            instance.show();
            instance.resetAndHide();
            expect(obj.loadDynamicReport).toHaveBeenCalled();
            obj.loadDynamicReport.calls.reset();
            expect(instance.state.show).toBeFalsy();
        });
    });

    describe('test modify sort group methods on original report settings', () => {

        it('test getSortState clean original', () => {
            component = shallow(
                <UnConnectedSortAndGroup {...props}/>
            );

            instance = component.instance();
            instance.show();
            const sortState = instance.getSortState();

            expect(sortState).toBeTruthy();
            expect(sortState.length).toBe(2);
            expect(sortState[0].id).toBe(5);
            expect(sortState[1].id).toBe(4);
        });

        it('test getSortState add a sort', () => {
            component = shallow(
                <UnConnectedSortAndGroup {...props}
                                         reportData={reportDataEmpty}/>
            );

            instance = component.instance();
            instance.show();
            instance.handleAddField('sort', aField);
            const sortState = instance.getSortState();
            expect(sortState).toBeTruthy();
            expect(sortState.length).toBe(1);
            expect(sortState[0].id).toBe(aField.id);
            expect(instance.state.dirty).toBeTruthy();
            expect(reportDataEmpty.data.originalMetaData.sortList.length).toBe(0);
            const groupState = instance.getGroupState();
            expect(groupState.length).toBe(0);

        });

        it('test getGroupState add a groupBy', () => {
            component = shallow(
                <UnConnectedSortAndGroup {...props}
                                         reportData={reportDataEmpty}/>
            );

            instance = component.instance();

            instance.show();
            instance.handleAddField('group', aField);
            const groupState = instance.getGroupState();
            expect(groupState).toBeTruthy();
            expect(groupState.length).toBe(1);
            expect(groupState[0].id).toBe(aField.id);
            expect(groupState[0].howToGroup).toBe(GROUP_TYPE.COMMON.equals);
            expect(instance.state.dirty).toBeTruthy();
            expect(reportDataEmpty.data.originalMetaData.sortList.length).toBe(0);
            const sortState = instance.getSortState();
            expect(sortState.length).toBe(0);
        });

        it('test getGroupState delete a sort', () => {
            component = shallow(
                <UnConnectedSortAndGroup {...props}
                                         reportData={_.cloneDeep(reportData)}/>
            );

            instance = component.instance();

            instance.show();
            const startSortState = instance.getSortState();
            expect(startSortState).toBeTruthy();
            instance.handleRemoveField('sort', 1);
            const sortState = instance.getSortState();
            expect(sortState).toBeTruthy();
            expect(sortState.length).toBe(1);
            expect(instance.state.dirty).toBeTruthy();
            const groupState = instance.getGroupState();
            expect(groupState.length).toBe(1);
        });

        it('test getGroupState delete a groupBy', () => {
            component = shallow(
                <UnConnectedSortAndGroup {...props}
                                         reportData={_.cloneDeep(reportData)}/>
            );

            instance = component.instance();

            instance.show();
            const startGroupState = instance.getGroupState();
            expect(startGroupState).toBeTruthy();
            instance.handleRemoveField('group', 1);
            const groupState = instance.getGroupState();
            expect(groupState).toBeTruthy();
            expect(groupState.length).toBe(1);
            expect(instance.state.dirty).toBeTruthy();
            const sortState = instance.getSortState();
            expect(sortState.length).toBe(2);
        });
    });

    describe('test modify sort group methods on different report settings', () => {

        it('test getSortState clean original', () => {

            component = shallow(
                <UnConnectedSortAndGroup {...props}
                                         reportData={reportDataWithEdits}/>
            );

            instance = component.instance();
            instance.show();
            const sortState = instance.getSortState();

            expect(sortState).toBeTruthy();
            expect(sortState.length).toBe(2);
            expect(sortState[0].id).toBe(5);
            expect(sortState[1].id).toBe(4);
        });

        it('test getSortState add a sort', () => {
            component = shallow(
                <UnConnectedSortAndGroup {...props}
                                         reportData={reportDataWithEdits}/>
            );

            instance = component.instance();
            instance.show();
            instance.handleAddField('sort', aField);
            const sortState = instance.getSortState();
            expect(sortState).toBeTruthy();
            expect(sortState.length).toBe(3);
            expect(sortState[2].id).toBe(aField.id);
            expect(instance.state.dirty).toBeTruthy();
            expect(reportDataEmpty.data.originalMetaData.sortList.length).toBe(0);
            const groupState = instance.getGroupState();
            expect(groupState.length).toBe(1);

        });

        it('test getGroupState add a groupBy', () => {
            component = shallow(
                <UnConnectedSortAndGroup {...props}
                                         reportData={reportDataWithEdits}/>
            );

            instance = component.instance();
            instance.show();
            instance.handleAddField('group', aField);
            const groupState = instance.getGroupState();
            expect(groupState).toBeTruthy();
            expect(groupState.length).toBe(2);
            expect(groupState[1].id).toBe(aField.id);
            expect(groupState[0].howToGroup).toBe(GROUP_TYPE.COMMON.equals);
            expect(instance.state.dirty).toBeTruthy();
            expect(reportDataEmpty.data.originalMetaData.sortList.length).toBe(0);
            const sortState = instance.getSortState();
            expect(sortState.length).toBe(2);
        });

        it('test getGroupState delete a sort', () => {
            component = shallow(<UnConnectedSortAndGroup {...props}
                                                         reportData={_.cloneDeep(reportDataWithEdits)}/>
            );
            instance = component.instance();
            instance.show();
            instance.handleRemoveField('sort', 1);
            const sortState = instance.getSortState();
            expect(sortState).toBeTruthy();
            expect(sortState.length).toBe(1);
            expect(instance.state.dirty).toBeTruthy();
            const groupState = instance.getGroupState();
            expect(groupState.length).toBe(1);
        });

        it('test getGroupState delete a groupBy', () => {
            component = shallow(<UnConnectedSortAndGroup {...props}
                                                         reportData={_.cloneDeep(reportDataWithEdits)}/>
            );
            instance = component.instance();
            instance.show();
            instance.handleRemoveField('group', 1);
            const groupState = instance.getGroupState();
            expect(groupState).toBeTruthy();
            expect(groupState.length).toBe(1);
            expect(instance.state.dirty).toBeTruthy();
            const sortState = instance.getSortState();
            expect(sortState.length).toBe(2);
        });
    });

    describe('test misc utils ', () => {
        let obj = {};
        beforeEach(() => {
            obj = {
                loadDynamicReport: null
            };
        });
        it('test handleClickOutside with edits', () => {
            spyOn(obj, 'loadDynamicReport');
            component = shallow(<UnConnectedSortAndGroup {...props}/>
            );
            component.setProps({loadDynamicReport: obj.loadDynamicReport});
            instance = component.instance();
            instance.show();
            expect(instance.state.dirty).toBeFalsy();
            instance.handleSetOrder('sort', 1, true, aField);
            expect(instance.state.dirty).toBeTruthy();
            instance.handleSetOrder('group', 0, false, aField);
            instance.handleClickOutside();
            expect(obj.loadDynamicReport).toHaveBeenCalled();
            obj.loadDynamicReport.calls.reset();
            expect(instance.state.show).toBeFalsy();
        });

        it('test handleClickOutside without edits', () => {
            spyOn(obj, 'loadDynamicReport');
            component = shallow(<UnConnectedSortAndGroup {...props}
                                                         reportData={reportData}/>
            );
            component.setProps({loadDynamicReport: obj.loadDynamicReport});
            instance = component.instance();
            instance.show();
            expect(instance.state.dirty).toBeFalsy();
            instance.handleClickOutside();
            expect(obj.loadDynamicReport).not.toHaveBeenCalled();
            obj.loadDynamicReport.calls.reset();
            expect(instance.state.show).toBeFalsy();
        });

        describe('MockData via url ', () => {
            class mockMethod {
                static searchIncludes(findThis) {
                    return true;
                }
            }

            it('test mockData ', () => {
                SortAndGroupRewireAPI.__Rewire__('WindowLocationUtils', mockMethod);

                component = shallow(
                        <UnConnectedSortAndGroup {...props}
                                      reportData={reportData}/>
                );
                instance = component.instance();
                const grp = instance.getGroupFields(null);
                expect(grp).toBe(MockData.GROUP);
                const srt = instance.getSortFields(null);
                expect(srt).toBe(MockData.SORT);
                SortAndGroupRewireAPI.__ResetDependency__('WindowLocationUtils');

            });
        });

    });

});

