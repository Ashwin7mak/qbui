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
import thwartClickOutside from '../hoc/thwartClickOutside';
import closeOnEscape from '../hoc/catchEscapeKey';
import ReportUtils from '../../utils/reportUtils';

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

    getInitialState: function() {
        return {show: false,
                showFields: false,
                newSelectionsGroup :[],
                newSelectionsSort:[],
                fieldsForType:null
        };
    },

    toggleShow: function() {
        //let flux = this.getFlux();
        //flux.actions.showSortAndGroup({show:!this.state.show});
        this.setState({show: !this.state.show});
    },

    toggleShowFields: function() {
        //let flux = this.getFlux();
        //flux.actions.showSortAndGroup({show:!this.state.show});
        this.setState({showFields: !this.state.showFields});
    },

    hide: function() {
        //let flux = this.getFlux();
        //flux.actions.showSortAndGroup({show:false});
        this.setState({show: false});
    },

    show: function() {
        //let flux = this.getFlux();
        //flux.actions.showSortAndGroup({show:true});
        this.setState({show: true});
    },

    showFields: function(type) {
        this.setState({showFields: true, fieldsForType:type});
    },

    hideFields : function() {
        this.setState({showFields: false, fieldsForType:null});
    },

    selectFieldFor(fid, list) {
        let newGroup = _.clone(list);
        newGroup.push(fid);
        setState({newSelectionsGroup :  newGroup});
    },

    selectField(fid, type) {
        if (type === 'group') {
            let newGroup = _.clone(this.state.newSelectionsGroup);
            newGroup.push(fid);
            setState({newSelectionsGroup :  newGroup});
        } else {
            return;
        }
    },

    onApplyChanges() {
        //reload table
        //close display
    },
    onReset() {
        //reload table
        //close display
    },


    getStateFromFlux() {
        //let flux = this.getFlux();
        //return flux.store('SortAndGroupStore').getState();
        return {show: false};
    },

    // return true if event.target or its parent is
    // the sort button
    isButton(evt) {
        let answer = false;
        let localButtonNode = this.refs.SortAndGroupButton;
        if (evt && evt.target && localButtonNode) {
            let target = evt.target;
            while (target.parentNode) {
                answer = (target === localButtonNode);
                if (answer) {
                    break;
                }
                target = target.parentNode;
            }
        }
        return answer;
    },


    getField(fid, fields) {
        let index = _.findIndex(fields, function(f) {
            return (f.id === fid);
        });
        return (index !== -1) ? fields[index] : null;

    },

    getSortFields(fields) {
        let answer = [];
        let sortByFields = [{name:'Claire', decendOrder:true, fid: 6},
            //{name:'A longer klhlhklh lkh klh field ', decendOrder:false, fid: 7},
            //{name:'A longer klhlhklh lkh klh field ', decendOrder:false},
            {name:'A longer klhlhklh lkh klh ldskf lskdfhlksdhf lkhsdf lheld ', decendOrder:false, fid: 8},
            //{name:'A longer klhlhklh lkh klh field ', decendOrder:false, fid: 9},
            //{name:'A longer klhlhklh lkh klh field ', decendOrder:false, fid: 10},
            //{name:'A longer klhlhklh lkh klh field ', decendOrder:false, fid: 11},
            {name:'Company', fid: 12},
            {name:'Company', fid: 13}
        ];
        if (window.location.search.includes('mockSort')) {
            answer = sortByFields;
        } else {
            // get the sort info from the props
            this.props.reportData.data.sortFids.map((originalVal) => {
                let sortItem = {originalVal : originalVal} ;
                let fid = Number(originalVal);

                sortItem.id = Math.abs(fid);
                // ascending or descending
                sortItem.decendOrder = fid < 0;

                //get field name from fields list
                let field = this.getField(fid, fields);
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
        let groupByFields = [
            //{name:'Project', decendOrder:true, fid: 1},
            //{name:'People', decendOrder:true, fid: 2},
            //{name:'Region', decendOrder:true, fid: 3},
            //{name:'Status', decendOrder:true, fid: 4},
            // {name:'Date', decendOrder:false, fid: 5}
        ];
        if (window.location.search.includes('mockSort')) {
            answer = groupByFields;
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

        // wrap the sort dialog in additional functionality to close the dialog on escape
        // and to not handle any outside clicks while the dialog is open
        let SortAndGroupDialogWrapped = closeOnEscape(thwartClickOutside(
                            SortAndGroupDialog, this.isButton));

        let fields = this.state.show && this.props.fields && this.props.fields.fields ? this.props.fields.fields.data : [];
        let fieldsLoading = this.state.show && this.props.fields && this.props.fields.fieldsLoading;
        let sortByFields = this.state.show ? this.getSortFields(fields) : [];
        let groupByFields = this.state.show ? this.getGroupFields(fields) : [];

        return (
            <div ref="sortAndGroupContainer" className="sortAndGroupContainer">

                {/* the sort/group icon button */}
                <div className={"sortAndGroupButton " +
                            (this.state.show ? "shown " : "") }
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
                                <SortAndGroupDialogWrapped  show={this.state.show}
                                                            fields={fields}
                                                            fieldsLoading={fieldsLoading}
                                                            showFields={this.state.showFields}
                                                            sortByFields={sortByFields}
                                                            groupByFields={groupByFields}
                                                            fieldsForType={this.state.fieldsForType}
                                                            reportData={this.props.reportData}
                                                            onShowFields={(type) => this.showFields(type)}
                                                            onHideFields={() => this.hideFields()}
                                                            onSelectField={(fieldId, type) => this.selectField(fieldId, type)}
                                                            onApplyChanges={() => this.onApplyChanges()}
                                                            onClose={() => this.hide()}/>
                </Overlay>
            </div>
        );
    }
});

export default SortAndGroup;
