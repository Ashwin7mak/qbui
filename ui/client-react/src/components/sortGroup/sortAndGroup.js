import React from 'react';
import ReactDOM from 'react-dom';

import {Overlay} from 'react-bootstrap';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';
import StringUtils from '../../utils/stringUtils';

import QBicon from '../qbIcon/qbIcon';
import LimitConstants from './../../../../common/src/limitConstants';

import './sortAndGroup.scss';

import SortAndGroupDialog from './sortAndGroupDialog';
import ReportUtils from '../../utils/reportUtils';
import MockData from '../../mocks/sortGroup';
import * as query from '../../constants/query';

import _ from 'lodash';
import Fluxxor from 'fluxxor';

let logger = new Logger();
let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

/**
 *  SortAndGroup container component manages the state and presents the components that are :
 *  a trigger button that when clicked shows the panel of options for sorting and grouping
 *  When the panel is shown and the trigger button is clicked again it hides the panel.
 *
**/
const SortAndGroup = React.createClass({
    mixins: [FluxMixin],
    //mixins: [FluxMixin, StoreWatchMixin('SortAndGroupStore')],

    displayName: 'SortAndGroup',
    contextTypes: {
        touch: React.PropTypes.bool
    },
    buttonNode : null,

    propTypes: {
        /**
         *  Takes in for properties the reportData which includes the list of fields
         *  and a function to call when a sort group options are applied
         **/
        reportData: React.PropTypes.object,
        fields:  React.PropTypes.object,
        onSortGroupApply : React.PropTypes.func,
        onMenuEnter : React.PropTypes.func,
        onMenuExit : React.PropTypes.func
    },

    getInitialState() {
        return this.initialState();
    },

    initialState() {
        return _.clone({
            show: false,
            showFields: false,
            newSelectionsGroup :[],
            newSelectionsSort:[],
            fieldsForType:null,
            dirty : false,
            showNotVisible :false
        });
    },

    showMoreFields(type) {
        this.setState({showNotVisible : true});
    },

    toggleShow() {
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

        //closes popover
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

    applyChanges() {
        if (!window.location.search.includes('mockSort')) {
            //reload data using the adhoc sort values
            let flux = this.getFlux();
            let overrideParams = {};

            let sortList = ReportUtils.getListString(this.state.newSelectionsSort);
            let groupList = ReportUtils.getListString(this.state.newSelectionsGroup);
            overrideParams[query.SORT_LIST_PARAM] = sortList;
            overrideParams[query.GLIST_PARAM] = groupList;

            flux.actions.getFilteredRecords(this.props.appId,
                this.props.tblId,
                this.props.rptId, {format:true}, this.props.filter, overrideParams);
        }

    },

    reset() {
        //reload data using report with no overrides
        let flux = this.getFlux();

        flux.actions.getFilteredRecords(this.props.appId,
            this.props.tblId,
            this.props.rptId, {format:true}, this.props.filter, null);
    },

    resetAndHide() {
        this.reset();

        //close popover
        this.hide();
    },

    getSortState() {
        let answer = [];
        if (this.state.dirty) {
            //populate from pending settings
            answer = this.state.newSelectionsSort;
        } else {
            // populate from report data
            this.props.reportData.data.sortFids.map((originalVal) => {
                answer.push(Number(originalVal));
            });
        }
        return answer;
    },

    getGroupState() {
        let answer = [];
        if (this.state.dirty) {
            answer = this.state.newSelectionsGroup;
        } else {
            // populate from report data
            this.props.reportData.data.groupEls.map((fidInfo) => {
                if (fidInfo.includes(ReportUtils.groupDelimiter)) {
                    //strip off fid part
                    let delimOffset = fidInfo.indexOf(ReportUtils.groupDelimiter);
                    let justFid = fidInfo.substr(0, delimOffset);
                    answer.push(Number(justFid));
                }
            });
        }
        return answer;
    },

    getNewOrderState(origState, index, field, isDescending) {
        let newGroup = _.clone(origState);
        if (newGroup && newGroup[index] && field) {
            newGroup[index] = isDescending ? -field.id : field.id;
        }
        return newGroup;
    },

    handleSetOrder(type, index, isDescending, field) {
        // set state to the change in order
        if (type === 'group') {
            let currGroupState = this.getGroupState();
            let newGrouping = this.getNewOrderState(currGroupState, index, field, isDescending);
            this.setState({newSelectionsGroup : newGrouping, dirty: true});
        } else {
            let currSortState = this.getSortState();
            let newSort = this.getNewOrderState(currSortState, index, field, isDescending);
            this.setState({newSelectionsSort : newSort, dirty: true});
        }
    },

    handleSelectField(type, fid) {
        // set state to add a field to the sort or grouping using ascending order default
        if (type === 'group') {
            let newGroup = _.clone(this.getGroupState());
            newGroup.push(fid);
            this.setState({newSelectionsGroup :  newGroup, dirty: true});
        } else {
            let newSort = _.clone(this.getSortState());
            newSort.push(fid);
            this.setState({newSelectionsSort :  newSort, dirty: true});
        }
    },


    handleRemoveField(type, index, fid) {
        // set state to add a field to the sort or grouping using ascending order default
        if (type === 'group') {
            let newGroup = _.clone(this.getGroupState());
            let removed = newGroup.splice(index, 1);
            this.setState({newSelectionsGroup : newGroup, dirty: true});
        } else {
            let newSort = _.clone(this.getSortState());
            let removed = newSort.splice(index, 1);
            this.setState({newSelectionsSort : newSort, dirty: true});
        }
    },

    handleClickOutside(evt) {
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
        let index = _.findIndex(fields, function(f) {
            return (f.id === fid);
        });
        return (index !== -1) ? fields[index] : null;

    },

    getSortFields(fields) {
        let answer = [];

        if (window.location.search.includes('mockSort')) {
            //just show some static info
            answer = MockData.SORT;
        } else if (this.state.dirty) {
            // use the non applied values
            this.state.newSelectionsSort.forEach((fid) => {
                let sortItem = {originalVal : fid};
                sortItem.id = Math.abs(fid);
                sortItem.decendOrder = fid < 0;
                //get field name from fields list
                let field = this.getField(sortItem.id, fields);
                if (field) {
                    sortItem.name = field.name;
                    answer.push(sortItem);
                }
            });
        } else {
            // get the sort info from the props
            this.props.reportData.data.sortFids.map((originalVal) => {
                let sortItem = {originalVal : originalVal} ;
                let fid = Number(originalVal);

                sortItem.id = Math.abs(fid);
                // ascending or descending
                sortItem.decendOrder = fid < 0;

                //get field name from fields list
                let field = this.getField(sortItem.id, fields);
                if (field) {
                    sortItem.name = field.name;
                    answer.push(sortItem);
                }
            });
        }

        return answer;

    },

    getGroupFields(fields) {
        let answer = [];
        //get groupFields from reportdata prop
        if (window.location.search.includes('mockSort')) {
            //just show some static info
            answer =  MockData.GROUP;
        } else if (this.state.dirty) {
            // use the non applied values
            this.state.newSelectionsGroup.forEach((fid) => {
                let groupItem = {originalVal : fid};
                groupItem.howToGroup = "V"; //for now group by equal values
                groupItem.id = Math.abs(fid);
                groupItem.decendOrder = fid < 0;
                //get field name from fields list
                let field = this.getField(groupItem.id, fields);
                if (field) {
                    groupItem.name = field.name;
                    answer.push(groupItem);
                }
            });
        } else {
            // get the sort info from the props
            this.props.reportData.data.groupEls.map((fidInfo) => {
                if (fidInfo.includes(ReportUtils.groupDelimiter)) {
                    let groupItem = {originalVal : fidInfo};
                    //strip off fid part
                    let delimOffset = fidInfo.indexOf(ReportUtils.groupDelimiter);
                    let justFid = fidInfo.substr(0, delimOffset);
                    let fid = Number(justFid);
                    groupItem.howToGroup = fidInfo.substr(delimOffset + 1);
                    groupItem.id = Math.abs(fid);
                    // ascending or descending
                    groupItem.decendOrder = fid < 0;

                    //get field name from fields list
                    let field = this.getField(fid, fields);
                    if (field) {
                        groupItem.name = field.name;
                        answer.push(groupItem);
                    }
                }
            });
        }

        return answer;
    },



    /**
     * Prepares the menu button used to show/hide the dialog of sort and group options when clicked
     *
     **/
    render() {

        let flux = this.getFlux();

        let fields = this.state.show && this.props.fields && this.props.fields.fields ? this.props.fields.fields.data : [];
        let fieldsLoading = this.state.show && this.props.fields && this.props.fields.fieldsLoading;
        let sortByFields = this.state.show ? this.getSortFields(fields) : [];
        let groupByFields = this.state.show ? this.getGroupFields(fields) : [];
        let fieldChoiceList = this.getFieldsNotYetUsed(fields, groupByFields, sortByFields);

        return (
            <div ref="sortAndGroupContainer" className="sortAndGroupContainer">

                {/* the sort/group icon button */}
                <div className={"sortAndGroupButton " +
                            (this.state.show ? "shown " : "") +
                            (this.state.show ? " ignore-react-onclickoutside" : "")}
                     ref="SortAndGroupButton"

                     >
                    <span className="sortButtonSpan" tabIndex="0"  onClick={() => this.toggleShow()}>
                        <QBicon className="sortButton" icon="sort-az" />
                    </span>
                </div>


                {/* options shown when icon clicked */}
                <Overlay container={this} placement="bottom"
                         show={this.state.show}
                         onClose={() => this.hide()}
                         onEntering={this.props.onMenuEnter} onExited={this.props.onMenuExit} >
                                <SortAndGroupDialog  show={this.state.show}
                                                            fields={fields}
                                                            fieldsLoading={fieldsLoading}
                                                            showFields={this.state.showFields}
                                                            sortByFields={sortByFields}
                                                            groupByFields={groupByFields}
                                                            fieldsForType={this.state.fieldsForType}
                                                            fieldChoiceList={fieldChoiceList}
                                                            dirty={this.state.dirty}
                                                            reportData={this.props.reportData}
                                                            showNotVisible={this.state.showNotVisible}
                                                            showMoreFields={(type) => this.showMoreFields(type)}
                                                            onShowFields={(type) => this.showFields(type)}
                                                            onHideFields={() => this.hideFields()}
                                                            onSelectField={(type, fieldId) => this.handleSelectField(type, fieldId)}
                                                            onRemoveField={(type, index, fieldId) => this.handleRemoveField(type, index, fieldId)}
                                                            onSetOrder={this.handleSetOrder}
                                                            onReset={this.resetAndHide}
                                                            onApplyChanges={() => this.applyAndHide()}
                                                            handleClickOutside={(evt) => this.handleClickOutside(evt)}
                                                            onClose={() => this.hide()}/>
                </Overlay>
            </div>
        );
    }
});

export default SortAndGroup;
