import React from 'react';
import ReactDOM from 'react-dom';

import {Overlay} from 'react-bootstrap';

import Logger from '../../utils/logger';
import QBicon from '../qbIcon/qbIcon';

import './sortAndGroup.scss';

import SortAndGroupDialog from './sortAndGroupDialog';
import ReportUtils from '../../utils/reportUtils';
import * as GroupTypes from '../../constants/groupTypes';
import MockData from '../../mocks/sortGroup';
import * as query from '../../constants/query';
import WindowLocationUtils from '../../utils/windowLocationUtils';
import constants from '../../../../common/src/constants';
import _ from 'lodash';
import Fluxxor from 'fluxxor';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

/**
 *  SortAndGroup container component manages the state and presents the components that are :
 *  a trigger button that when clicked shows the panel of options for sorting and grouping
 *  When the panel is shown and the trigger button is clicked again it hides the panel.
 *
**/

let KIND = {
    GROUP : 'group',
    SORT :'sort'
};

const SortAndGroup = React.createClass({
    mixins: [FluxMixin],
    //mixins: [FluxMixin, StoreWatchMixin('SortAndGroupStore')],

    displayName: 'SortAndGroup',
    contextTypes: {
        touch: React.PropTypes.bool
    },

    propTypes: {
        /**
         *  Takes in for properties the reportData which includes the list of fields
         *  and a function to call when a sort group options are applied
         **/
        // the app id of the current report
        appId: React.PropTypes.string,

        // the table id of the current report
        tblId: React.PropTypes.string,

        // the report id of the current report
        rptId: React.PropTypes.string,

        // the report data
        reportData: React.PropTypes.object,

        // the adhoc filter information selected facets and search
        filter: React.PropTypes.object,

        // the fields in the table
        fields:  React.PropTypes.object.isRequired,

        // the callback to call when the sort group dialog in shown
        onMenuEnter : React.PropTypes.func,

        // the callback to call when the sort group dialog in exited
        onMenuExit : React.PropTypes.func
    },

    getInitialState() {
        return this.initialState();
    },

    initialState() {
        return _.clone({
            show: false,
            showFields: false,
            //field for newSelectionsSort and group have array of objects containing
            // type - sort or group
            // name - fieldName
            // id - fieldId
            // unparsedVal - unparsed value i.e. -5:V or -6
            // descendOrder - true or false
            // howToGroup - "V" for now see list of possible grouping types
            //}
            newSelectionsGroup :[],
            newSelectionsSort:[],
            // when showing the fields select panel whether its for sorting or grouping
            fieldsForType:null,
            // ad hoc changes to sort/group were initiated and not applied
            dirty : false,
            // whether we are showing the remaining fields not visible in the table or see more.. link
            showNotVisible :false
        });
    },

    showMoreFields() {
        this.setState({showNotVisible : true});
    },

    hideMoreFields() {
        this.setState({showNotVisible : false});
    },

    toggleShow() {
        //TODO:move state to flux action & store
        //let flux = this.getFlux();
        //flux.actions.showSortAndGroup({show:!this.state.show});
        return this.state.show ? this.hide() : this.show();
    },

    toggleShowFields() {
        return this.state.showFields ? this.hideFields() : this.showFields();
    },

    hide() {
        this.setState(this.initialState());
    },

    applyAndHide() {
        if (this.state.dirty) {
            this.applyChanges();
        }
        this.hide();
    },

    show() {
        this.setState({show: true});
    },

    showFields(type) {
        this.setState({showFields: true, fieldsForType:type});
    },

    hideFields() {
        this.setState({showFields: false, fieldsForType:null});
    },

    updateRecords(sortGroupString) {
        let flux = this.getFlux();
        let overrideParams = {};
        //if report was grouped in the last render and is grouped in this render
        // or was ungrouped in last and this render no need to re-load report.
        let groupKeys = _.map(this.state.newSelectionsGroup, 'unparsedVal');
        let changedGroupingStyle = true;
        if (this.props.reportData && this.props.reportData.data && this.props.reportData.data.groupEls) {
            if ((this.props.reportData.data.groupEls.length && groupKeys.length) || //report was grouped before and after
                (this.props.reportData.data.groupEls.length === 0 && groupKeys.length === 0)) { //report was ungrouped before and after
                changedGroupingStyle = false;
            }
        }

        if (changedGroupingStyle) {
            flux.actions.loadReport(this.props.appId,
                this.props.tblId,
                this.props.rptId, true, null, null, sortGroupString);
        } else {
            overrideParams[query.SORT_LIST_PARAM] = sortGroupString;
            flux.actions.getFilteredRecords(this.props.appId, this.props.tblId, this.props.rptId, {format:true}, this.props.filter, overrideParams);
        }
    },

    applyChanges() {
        if (!WindowLocationUtils.searchIncludes('mockSort')) {
            //reload data using the adhoc sort values

            // get the group string and the sort string from state
            let sortKeys = _.map(this.state.newSelectionsSort, 'unparsedVal');
            let groupKeys = _.map(this.state.newSelectionsGroup, 'unparsedVal');
            let sortList = ReportUtils.getListString(sortKeys);
            let groupList = ReportUtils.getListString(groupKeys);

            let sortGroupString = "";
            if (groupKeys.length) {
                sortGroupString += groupList;
            }
            if (sortList.length) {
                if (sortGroupString.length) {
                    sortGroupString += ReportUtils.listDelimiter;
                }
                sortGroupString += sortList;
            }
            this.updateRecords(sortGroupString);
        }

    },

    reset() {
        //reload data using report with original sort/group overrides & keep filter settings
        if (_.has(this.props, 'reportData.data.originalMetaData.sortList')) {
            let sortGroupString = ReportUtils.getGListString(this.props.reportData.data.originalMetaData.sortList);
            this.updateRecords(sortGroupString);
        }
    },

    resetAndHide() {
        this.reset();

        //close popover
        this.hide();
    },

    getSortState() {
        let answer = this.state.dirty ? this.state.newSelectionsSort : this.getSortFields(this.props.fields.fields.data);
        return answer;
    },

    getGroupState() {
        let answer = this.state.dirty ? this.state.newSelectionsGroup : this.getGroupFields(this.props.fields.fields.data);
        return answer;
    },

    prepStateArrays() {
        //returns a new object of current sort and group settings
        return {
            newSelectionsGroup :  this.state.dirty ?  _.clone(this.state.newSelectionsGroup)  : this.getGroupState(),
            newSelectionsSort  :  this.state.dirty ?  _.clone(this.state.newSelectionsSort) : this.getSortState()
        };
    },

    getUnparsedVal(item, type) {
        let answer = "";
        if (type === KIND.GROUP) {
            answer =  ReportUtils.getGroupString(item.id, !item.descendOrder, item.howToGroup);
        } else {
            answer = (item.descendOrder ? '-' : '') + item.id;
        }
        return answer;
    },


    getNewOrderState(origStateArray, index, field, isDescending, type) {
        //returns modified array
        let newGroup = _.clone(origStateArray);
        if (newGroup && newGroup[index] && field) {
            let editEntry = newGroup[index]; // modifies the entry at index's sort order
            editEntry.descendOrder = isDescending;
            editEntry.unparsedVal = this.getUnparsedVal(editEntry, type);
        }
        return newGroup;
    },


    handleSetOrder(type, index, isDescending, field) {
        // set state to the change in order
        // newSelectionsGroup newSelectionsSort state is set when edits are made
        let editArrays = this.prepStateArrays();
        if (type === KIND.GROUP) {
            editArrays.newSelectionsGroup = this.getNewOrderState(editArrays.newSelectionsGroup,
                                    index, field, isDescending, KIND.GROUP);
        } else {
            editArrays.newSelectionsSort = this.getNewOrderState(editArrays.newSelectionsSort,
                                    index, field, isDescending, KIND.SORT);
        }
        this.setState({newSelectionsGroup:editArrays.newSelectionsGroup,
                        newSelectionsSort:editArrays.newSelectionsSort,
                        dirty: true});
    },

    handleAddField(type, field) {
        // set state to add a field to the sort or grouping using ascending order default
        let item = {};
        item.id = field.id;
        item.decendOrder = false;
        item.type = type;
        if (type === KIND.GROUP) {
            item.howToGroup = GroupTypes.COMMON.equals;
        }
        item.unparsedVal = this.getUnparsedVal(item, type);
        item.name = field.name;

        let editArrays = this.prepStateArrays();
        if (type === KIND.GROUP) {
            editArrays.newSelectionsGroup.push(item);
        } else {
            editArrays.newSelectionsSort.push(item);
        }
        this.setState({newSelectionsGroup: editArrays.newSelectionsGroup,
                       newSelectionsSort:editArrays.newSelectionsSort,
                       dirty: true});
    },


    handleRemoveField(type, index) {
        // remove a field from the list of type and index specified
        let editArrays = this.prepStateArrays();

        if (type === KIND.GROUP) {
            let removed = editArrays.newSelectionsGroup.splice(index, 1);
        } else {
            let removed = editArrays.newSelectionsSort.splice(index, 1);
        }
        this.setState({newSelectionsGroup: editArrays.newSelectionsGroup,
            newSelectionsSort:editArrays.newSelectionsSort,
            dirty: true});

    },

    handleClickOutside() {
        this.applyAndHide();
        //console.log('clicked outside on' + evt.target);
    },


    getFieldsNotYetUsed(fields, groups, sorts) {
        // return the list of fields that are not yet used in either sort or groups
        let answer = [];
        if (fields && groups && sorts) {
            answer = _.differenceBy(fields, groups, 'id');
            answer = _.differenceBy(answer, sorts, 'id');
        }
        return answer;
    },

    getStateFromFlux() {
        //let flux = this.getFlux();
        //return flux.store('SortAndGroupStore').getState();
        return {show: false};
    },


    getField(fid, fields) {
        return fields.find((field) => (field.id === fid));
    },


    parseSortItem(originalVal, fields) {
        let sortItem = {unparsedVal : originalVal} ;
        let fid = Number(originalVal);

        sortItem.id = Math.abs(fid);
        // ascending or descending
        sortItem.descendOrder = fid < 0;
        sortItem.type = KIND.SORT;

        //get field name from fields list
        let field = this.getField(sortItem.id, fields);
        if (field) {
            sortItem.name = field.name;
            return sortItem;
        }
        return null;
    },

    parseGroupItem(originalVal, fields) {
        if (ReportUtils.hasGroupingFids(originalVal)) {
            let groupItem = {unparsedVal : originalVal};

            groupItem.id = groupItem.unparsedVal.fieldId;
            groupItem.type = KIND.GROUP;

            // ascending or descending
            groupItem.descendOrder = groupItem.unparsedVal.sortOrder === constants.SORT_ORDER.DESC;

            groupItem.howToGroup = GroupTypes.COMMON.equals; //for default group by equal values
            if (groupItem.unparsedVal.groupType) {
                groupItem.howToGroup = groupItem.unparsedVal.groupType;
            }

            //get field name from fields list
            let field = this.getField(groupItem.id, fields);
            if (field) {
                groupItem.name = field.name;
                return groupItem;
            }
        }
        return null;
    },

    getSortFields(fields) {
        /**
         * the information about current state of sort to show in the dialog depends on whether
         * the user had made edits in the sort/group popover that are not yet applied
         * so we set the settings from the popover state info
         * or
         * the report has adhoc sort and grouping setting applied via menus or prior apply from the popover
         * so we get the settings from the reportData prop
         * or
         * the is report was freshly loaded and no adhoc sort/grouping is in effect
         * so we get the settings from the report meta data
         *
         * returns and {Array} of group item settings
         */
        let answer = [];

        if (WindowLocationUtils.searchIncludes('mockSort')) {
            //just show some static dummy sort info
            return MockData.SORT;
        }

        if (this.state.dirty && this.state.newSelectionsSort) {
            //..or use the non applied values
            this.state.newSelectionsSort.forEach((sortItem) => {
                if (sortItem) {
                    answer.push(sortItem);
                }
            });
        } else if (_.has(this.props, 'reportData.data.sortFids')) {
            // .. or get the sort info from the record data props
            this.props.reportData.data.sortFids.map((originalVal) => {
                let sortItem = this.parseSortItem(originalVal, fields);
                if (sortItem) {
                    answer.push(sortItem);
                }
            });
        } else if (_.has(this.props, 'reportData.data.originalMetaData.sortList')) {
            // .. or get the sort info from the original report meta data
            let sorts = ReportUtils.getSortFidsOnly(this.props.reportData.data.originalMetaData.sortList);
            sorts.map((originalVal) => {
                let sortItem = this.parseSortItem(originalVal, fields);
                if (sortItem) {
                    answer.push(sortItem);
                }
            });
        }
        return answer;
    },

    getGroupFields(fields) {
        /**
         * the information about current state of grouping to show in the dialog depends on whether
         * the user had made edits in the sort/group popover that are not yet applied
         * so we set the settings from the popover state info
         * or
         * the report has adhoc sort and grouping setting applied via menus or prior apply from the popover
         * so we get the settings from the reportData prop
         * or
         * the is report was freshly loaded and no adhoc sort/grouping is in effect
         * so we get the settings from the report meta data
         *
         * returns and {Array} of group item settings
         */
        let answer = [];
        //get groupFields from report data prop
        if (WindowLocationUtils.searchIncludes('mockSort')) {
            //just show some static dummy grouping info
            return MockData.GROUP;
        }

        if (this.state.dirty) {
            // use the non applied values
            this.state.newSelectionsGroup.forEach((groupItem) => {
                if (groupItem) {
                    answer.push(groupItem);
                }
            });
        } else if (_.has(this.props, 'reportData.data.groupEls')) {
            // get the group info from the report data
            this.props.reportData.data.groupEls.map((fidInfo) => {
                let groupItem = this.parseGroupItem(fidInfo, fields);
                if (groupItem) {
                    answer.push(groupItem);
                }
            });
        } else if (_.has(this.props, 'reportData.data.originalMetaData.sortList')) {
            // get the group info from the original meta data
            this.props.reportData.data.originalMetaData.sortList.map((fidInfo) => {
                let groupItem = this.parseGroupItem(fidInfo, fields);
                if (groupItem) {
                    answer.push(groupItem);
                }
            });

        }
        return answer;
    },

    getVisGroupEls(els, fields) {
        let answer = [];
        ReportUtils.getGroupElements(els).map((item) => {
            let groupItem = this.parseGroupItem(item, fields);
            if (groupItem) {
                answer.push(this.getField(groupItem.id, fields));
            }
        });
        return answer;
    },

    /**
     * Prepares the menu button used to show/hide the dialog of sort and group options when clicked
     *
     **/
    render() {

        let fields = this.state.show &&  _.has(this.props, 'fields.fields.data') ?
                                this.props.fields.fields.data : [];
        let sortByFields = this.state.show ? this.getSortFields(fields) : [];
        let groupByFields = this.state.show ? this.getGroupFields(fields) : [];
        let fieldChoiceList = this.getFieldsNotYetUsed(fields, groupByFields, sortByFields);
        let visGroupEls = _.has(this.props, 'reportData.data.groupEls') ?
                            this.getVisGroupEls(this.props.reportData.data.groupEls, fields) :  [];
        return (
            <div ref="sortAndGroupContainer" className="sortAndGroupContainer">
                {/* the sort/group icon button */}
                <div className={"sortAndGroupButton " + (this.state.show ? "shown " : "") }
                     ref="SortAndGroupButton"
                     >
                    <span className="sortButtonSpan" tabIndex="0"  onClick={this.toggleShow}>
                        <QBicon className="sortButton" icon="sort-az" />
                    </span>
                </div>

                {/* options shown when icon clicked */}
                <Overlay container={this} placement="bottom"
                         show={this.state.show}
                         onClose={this.hide}
                         onEntering={this.props.onMenuEnter} onExited={this.props.onMenuExit} >
                                <SortAndGroupDialog         key={"SortGroupPopover" +
                                                                this.props.rptId}
                                                            show={this.state.show}
                                                            showFields={this.state.showFields}
                                                            sortByFields={sortByFields}
                                                            groupByFields={groupByFields}
                                                            fieldsForType={this.state.fieldsForType}
                                                            fieldChoiceList={fieldChoiceList}
                                                            dirty={this.state.dirty}
                                                            visGroupEls={visGroupEls}
                                                            reportData={this.props.reportData}
                                                            showNotVisible={this.state.showNotVisible}
                                                            onShowMoreFields={this.showMoreFields}
                                                            onHideMoreFields={this.hideMoreFields}
                                                            onShowFields={this.showFields}
                                                            onHideFields={this.hideFields}
                                                            onSelectField={this.handleAddField}
                                                            onRemoveField={this.handleRemoveField}
                                                            onSetOrder={this.handleSetOrder}
                                                            onReset={this.resetAndHide}
                                                            onApplyChanges={this.applyAndHide}
                                                            handleClickOutside={this.handleClickOutside}
                                                            onClose={this.hide}/>
                </Overlay>
            </div>
        );
    }
});

export default SortAndGroup;
